import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, update, push } from 'firebase/database';

const Billing = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemData, setItemData] = useState(null); // Holds data of the selected item
  const [cart, setCart] = useState([]); // Holds items added to the cart

  useEffect(() => {
    const fetchCategories = () => {
      const inventoryRef = ref(db, 'inventory');
      onValue(inventoryRef, (snapshot) => {
        const data = snapshot.val();
        const categoryList = Object.keys(data);
        setCategories(categoryList);
      });
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const itemsRef = ref(db, `inventory/${selectedCategory}`);
      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        const itemList = Object.keys(data).map((itemId) => ({
          id: itemId,
          ...data[itemId],
        }));
        setItems(itemList);
      });
    } else {
      setItems([]);
    }
  }, [selectedCategory]);

  const handleItemSelect = (itemId) => {
    const selected = items.find((item) => item.id === itemId);
    setSelectedItem(itemId);
    setItemData(selected);
  };

  const addToCart = () => {
    if (!selectedCategory || !selectedItem || !quantity) {
      alert('Please select category, item, and enter quantity.');
      return;
    }

    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (itemData && itemData.quantity < newQuantity) {
      alert('Insufficient quantity in inventory.');
      return;
    }

    const newItem = {
      id: itemData.id,
      category: selectedCategory,
      brandName: itemData.brandName,
      quantity: newQuantity,
      price: itemData.price,
      availableQuantity: itemData.quantity, // Track available quantity to validate before transaction
    };

    setCart((prevCart) => [...prevCart, newItem]);
    setQuantity(''); // Reset quantity input
    setSelectedItem('');
    setItemData(null);
  };

  const handleTransaction = async () => {
    if (cart.length === 0) {
      alert('Please add items to the cart.');
      return;
    }

    try {
      const updates = {};

      // Update inventory and log each item in historyTransfer
      for (const item of cart) {
        // Validate available quantity from the cart item before updating
        if (item.availableQuantity < item.quantity) {
          alert(`Insufficient quantity for ${item.brandName} in inventory.`);
          return;
        }

        const itemRef = ref(db, `inventory/${item.category}/${item.id}`);
        const updatedQuantity = item.availableQuantity - item.quantity;

        // Prepare each item’s quantity update in inventory
        updates[`inventory/${item.category}/${item.id}/quantity`] = updatedQuantity;

        // Log each item transaction in historyTransfer
        const historyRef = ref(db, 'historyTransfer');
        await push(historyRef, {
          category: item.category,
          itemName: item.brandName,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
          date: new Date().toISOString(),
        });
      }

      // Execute all inventory updates in a single transaction
      await update(ref(db), updates);

      alert('Transaction successful.');
      setCart([]); // Clear the cart after transaction
      setSelectedCategory('');
      setSelectedItem('');
      setItemData(null);
    } catch (error) {
      alert('Transaction failed: ' + error.message);
    }
  };

  return (
    <div className="bg-white max-w-md mx-auto p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Billing</h2>
      
      {/* Category Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedItem('');
            setItemData(null);
          }}
          className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Item Dropdown */}
      {selectedCategory && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Item:</label>
          <select
            value={selectedItem}
            onChange={(e) => handleItemSelect(e.target.value)}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.brandName} (Available: {item.quantity})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity Input */}
      {selectedItem && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Enter Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter quantity to deduct"
          />
        </div>
      )}

      <button
        onClick={addToCart}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2 py-2 rounded-lg shadow font-semibold"
      >
        Add to Cart
      </button>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="p-4 mt-4 bg-blue-100 rounded-lg shadow">
          <h3 className="text-blue-600 font-semibold">Cart Summary</h3>
          <ul className="mt-2 space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between text-blue-700">
                <span>{item.brandName} x {item.quantity}</span>
                <span>₱{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-blue-700 font-semibold">
            Total: ₱{cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
          </p>
        </div>
      )}

      <button
        onClick={handleTransaction}
        className="w-full bg-green-500 hover:bg-green-600 text-white mt-6 py-2 rounded-lg shadow font-semibold"
      >
        Process Transaction
      </button>
    </div>
  );
};

export default Billing;
