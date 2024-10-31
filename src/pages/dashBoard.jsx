import React from 'react';
import { Link } from 'react-router-dom';
import { FaCashRegister, FaHistory, FaBoxes, FaShoppingCart } from 'react-icons/fa';

function Dashboard() {
  return (
    <div className="flex-grow p-6 bg-secondary text-center">
      <h1 className="text-3xl font-bold text-textPrimary mb-6"> Sari-Sari Store Dashboard</h1>
      <p className="text-lg text-accent mb-10">Manage your store efficiently and track your inventory and transactions!</p>

      {/* Grid layout for navigation links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Billing */}
        <Link
          to="/billing"
          className="flex flex-col items-center bg-blue-100 rounded-lg shadow-md p-6 hover:bg-blue-200 transition transform hover:scale-105"
        >
          <FaCashRegister className="text-blue-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Billing</h3>
          <p className="text-sm text-blue-600">Process customer transactions</p>
        </Link>

        {/* History Transfer */}
        <Link
          to="/historyTransfer"
          className="flex flex-col items-center bg-green-100 rounded-lg shadow-md p-6 hover:bg-green-200 transition transform hover:scale-105"
        >
          <FaHistory className="text-green-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-2">Transaction History</h3>
          <p className="text-sm text-green-600">View past transactions</p>
        </Link>

        {/* Inventory Management */}
        <Link
          to="/inventoryManagement"
          className="flex flex-col items-center bg-yellow-100 rounded-lg shadow-md p-6 hover:bg-yellow-200 transition transform hover:scale-105"
        >
          <FaBoxes className="text-yellow-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">Inventory Management</h3>
          <p className="text-sm text-yellow-600">Manage your stock levels</p>
        </Link>

        {/* Products */}
        <Link
          to="/products"
          className="flex flex-col items-center bg-purple-100 rounded-lg shadow-md p-6 hover:bg-purple-200 transition transform hover:scale-105"
        >
          <FaShoppingCart className="text-purple-500 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-purple-700 mb-2">Products</h3>
          <p className="text-sm text-purple-600">Browse and add products</p>
        </Link>

      </div>
    </div>
  );
}

export default Dashboard;
