import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, update, get, child } from 'firebase/database';

function AddStock() {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dbRef = ref(db);
        const inventorySnapshot = await get(child(dbRef, 'inventory'));
        if (inventorySnapshot.exists()) {
          const data = inventorySnapshot.val();
          const formattedCategories = Object.keys(data).map((key) => ({
            name: key,
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      const fetchProducts = async () => {
        const productsRef = ref(db, `inventory/${category}`);
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productList = Object.keys(data).map((key) => ({
            id: key,
            brandName: data[key].brandName,
            quantity: data[key].quantity || 0, // Assuming initial quantity may not exist
          }));
          setProducts(productList);
        } else {
          setProducts([]);
        }
      };

      fetchProducts();
    }
  }, [category]);

  const handleAddStock = async (e) => {
    e.preventDefault();

    if (!category || !product || !quantity) {
      alert("Please select a category, product, and enter quantity.");
      return;
    }

    try {
      const productRef = ref(db, `inventory/${category}/${product}`);
      const productSnapshot = await get(productRef);

      if (productSnapshot.exists()) {
        const currentQuantity = productSnapshot.val().quantity || 0;
        const newQuantity = currentQuantity + parseInt(quantity);

        // Update the quantity in the inventory node
        await update(productRef, { quantity: newQuantity });

        alert('Stock added successfully');
      } else {
        alert('Product not found in inventory.');
      }

      setCategory('');
      setProduct('');
      setQuantity('');
    } catch (error) {
      alert('Error updating stock: ' + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mx-4 my-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Add Stock to Existing Product</h2>
      <form onSubmit={handleAddStock} className="mb-6">
        
        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700">Category Name:</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setProduct('');
            }}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Dropdown */}
        {products.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700">Select Product:</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Product</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.brandName} (Current Stock: {prod.quantity})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Quantity to Add:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow">
          Add Stock
        </button>
      </form>
    </div>
  );
}

export default AddStock;
