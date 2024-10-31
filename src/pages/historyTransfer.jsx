import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

const HistoryTransfer = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for category filter
  const [categories, setCategories] = useState([]); // State for unique categories
  const [startDate, setStartDate] = useState(''); // State for start date filter
  const [endDate, setEndDate] = useState(''); // State for end date filter

  useEffect(() => {
    // Set default start and end dates to today's date in the Philippines timezone
    const today = new Date();
    const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
    const [month, day, year] = new Intl.DateTimeFormat('en-PH', options).format(today).split('/');
    const localToday = `${year}-${month}-${day}`; // Format to YYYY-MM-DD for date inputs
    setStartDate(localToday);
    setEndDate(localToday);
  }, []);

  useEffect(() => {
    const fetchTransactions = () => {
      const historyRef = ref(db, 'historyTransfer');
      onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        const transactionList = [];
        const categorySet = new Set(); // To store unique categories

        if (data) {
          // Loop through each transaction and add it to the list
          Object.keys(data).forEach((transactionId) => {
            const transaction = {
              id: transactionId,
              ...data[transactionId],
            };
            transactionList.push(transaction);

            // Add each transaction's category to the set
            if (transaction.category) {
              categorySet.add(transaction.category);
            }
          });
        }

        // Sort transactions by date (most recent first)
        transactionList.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(transactionList);

        // Convert set to array and add 'All' option for filter
        setCategories(['All', ...Array.from(categorySet)]);
      });
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on the selected category and date range
  const filteredTransactions = transactions.filter((transaction) => {
    // Check if the transaction matches the selected category
    const categoryMatch = selectedCategory === 'All' || transaction.category === selectedCategory;

    // Convert transaction date to local Philippine date string (YYYY-MM-DD)
    const transactionDate = new Date(transaction.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }); // Format to YYYY-MM-DD
    const startMatch = startDate ? transactionDate >= startDate : true;
    const endMatch = endDate ? transactionDate <= endDate : true;

    return categoryMatch && startMatch && endMatch;
  });

  // Calculate total earnings by summing up `totalPrice` for each filtered transaction
  const totalEarnings = filteredTransactions.reduce((total, transaction) => {
    return total + (transaction.totalPrice || 0); // Sum up totalPrice, defaulting to 0 if undefined
  }, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mx-4 my-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Transaction History</h2>

      {/* Category Filter Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">Category</th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">Item Name</th>
              <th className="py-2 px-4 border-b font-semibold text-gray-700">Quantity</th>
              <th className="py-2 px-9 border-b font-semibold text-gray-700">Total Price</th>
              <th className="py-2 px-16 border-b font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="py-2 px-4 border-b text-gray-700">{transaction.category}</td>
                <td className="py-2 px-4 border-b text-gray-700">{transaction.itemName}</td>
                <td className="py-2 px-9 border-b text-gray-700 ">{transaction.quantity || 0}</td>
                <td className="py-2 px-12 border-b text-gray-700">₱{(transaction.totalPrice || 0).toFixed(2)}</td>
                <td className="py-2 px-4 border-b text-gray-700">
                  {new Date(transaction.date).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No transactions available for the selected category and date range.</p>
      )}

      {/* Total Earnings Summary */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 p-4 bg-purple-100 rounded-lg shadow">
          <h3 className="text-purple-700 font-semibold">Total Earnings</h3>
          <p className="text-purple-800 text-lg mt-2">
            ₱{totalEarnings.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryTransfer;
