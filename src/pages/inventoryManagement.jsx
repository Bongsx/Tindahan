import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for filtering
  const [categories, setCategories] = useState([]); // State to store unique categories

  useEffect(() => {
    const fetchItems = () => {
      const inventoryRef = ref(db, 'inventory');
      onValue(inventoryRef, (snapshot) => {
        const data = snapshot.val();
        const itemList = [];
        const categoryList = new Set(); // Use a set to get unique categories

        if (data) {
          // Loop through each category in inventory
          Object.keys(data).forEach((category) => {
            categoryList.add(category); // Add category to the set
            const categoryItems = data[category];
            // Loop through each item within the category
            Object.keys(categoryItems).forEach((itemId) => {
              itemList.push({
                id: itemId,
                category: category,
                brandName: categoryItems[itemId].brandName || 'N/A',
                quantity: categoryItems[itemId].quantity ?? 'N/A',
                price: categoryItems[itemId].price ?? 0,
              });
            });
          });
        }

        setItems(itemList);
        setCategories(['All', ...categoryList]); // Convert set to array and add 'All' option
      });
    };

    fetchItems();
  }, []);

  // Filter items based on the selected category
  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mx-4 my-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-700">Inventory Management</h2>

      {/* Category Filter Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Display Items in Table */}
      <div>
        <h3 className="text-lg font-bold mb-2 text-yellow-700">Inventory Items</h3>
        {filteredItems.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b font-semibold text-gray-700">Name</th>
                <th className="py-2 px-4 border-b font-semibold text-gray-700">Quantity</th>
                <th className="py-2 px-4 border-b font-semibold text-gray-700">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border-b text-gray-700">{item.brandName}</td>
                  <td className="py-2 px-7 border-b text-gray-700">{item.quantity}</td>
                  <td className="py-2 px-4 border-b text-gray-700">₱{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No items available in the inventory.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
