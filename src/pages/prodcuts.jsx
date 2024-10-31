import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, push, get, child } from 'firebase/database';

function Products() {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    // Fetch categories from the database
    const fetchCategories = async () => {
      try {
        const dbRef = ref(db);
        const productsSnapshot = await get(child(dbRef, 'products'));
        if (productsSnapshot.exists()) {
          const data = productsSnapshot.val();
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

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!category) {
      alert("Please select a category.");
      return;
    }

    const itemData = {
      brandName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    try {
      const dbRef = ref(db);
      const categoryRef = child(dbRef, `products/${category}`);
      const inventoryRef = child(dbRef, `inventory/${category}`);

      // Use push to create a unique ID inside 'products/<category>'
      await push(ref(db, `products/${category}`), itemData);

      // Use push to create a unique ID inside 'inventory/<category>'
      await push(ref(db, `inventory/${category}`), itemData);

      // Clear input fields after submission
      setCategory('');
      setBrandName('');
      setQuantity('');
      setPrice('');
      alert('Item added successfully to both Products and Inventory');
    } catch (error) {
      alert('Error adding item: ' + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mx-4 my-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Add New Product</h2>
      <form onSubmit={handleAddItem} className="mb-6">
        
        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700">Category Name:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

        {/* Brand Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Product Name:</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Price Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow">
          Add Item
        </button>
      </form>
    </div>
  );
}

export default Products;
