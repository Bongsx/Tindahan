import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaClipboardList, FaCashRegister, FaHistory } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation(); // Get current route location

  return (
    <aside className="w-64 h-screen bg-primary text-secondary fixed shadow-lg">
      {/* Logo Section */}
      <div className="p-6 text-center border-b border-gray-700">
        <svg
          className="mx-auto"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4" />
          <text
            x="50%"
            y="40%"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            Tindahan
          </text>
          <text
            x="50%"
            y="60%"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            Ni Perla
          </text>
        </svg>
        <h1 className="text-2xl font-bold text-white mt-2">Sari-Sari Store</h1>
      </div>

      <nav className="mt-10">
        <ul className="space-y-6 pl-6">
          <li className={`flex items-center space-x-3 ${location.pathname === '/' ? 'bg-maroon' : ''} p-2 rounded-lg hover:bg-maroon`}>
            <FaHome className="text-white" />
            <Link to="/" className="hover:text-white text-lg font-medium cursor-pointer">
              Overview
            </Link>
          </li>
          <li className={`flex items-center space-x-3 ${location.pathname === '/products' ? 'bg-maroon' : ''} p-2 rounded-lg hover:bg-maroon`}>
            <FaBoxOpen className="text-white" />
            <Link to="/products" className="hover:text-white text-lg font-medium cursor-pointer">
              Add Products
            </Link>
          </li>
          <li className={`flex items-center space-x-3 ${location.pathname === '/addStock' ? 'bg-maroon' : ''} p-2 rounded-lg hover:bg-maroon`}>
            <FaBoxOpen className="text-white" />
            <Link to="/addStock" className="hover:text-white text-lg font-medium cursor-pointer">
              Add Stock
            </Link>
          </li>
          <li className={`flex items-center space-x-3 ${location.pathname === '/inventoryManagement' ? 'bg-maroon' : ''} p-2 rounded-lg hover:bg-maroon`}>
            <FaClipboardList className="text-white" />
            <Link to="/inventoryManagement" className="hover:text-white text-lg font-medium cursor-pointer">
              Inventory Management
            </Link>
          </li>
          <li className={`flex items-center space-x-3 ${location.pathname === '/billing' ? 'bg-maroon' : ''} p-2 rounded-lg hover:bg-maroon`}>
            <FaCashRegister className="text-white" />
            <Link to="/billing" className="hover:text-white text-lg font-medium cursor-pointer">
              Billing
            </Link>
          </li>
          <li className={`flex items-center space-x-3 ${location.pathname === '/historyTransfer' ? 'bg-maroon' : ''} p-2 rounded-lg hover:bg-maroon`}>
            <FaHistory className="text-white" />
            <Link to="/historyTransfer" className="hover:text-white text-lg font-medium cursor-pointer">
              History Billing
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
