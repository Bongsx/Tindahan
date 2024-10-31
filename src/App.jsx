import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sideBar';
import Dashboard from './pages/dashBoard';
import InventoryManagement from './pages/inventoryManagement';
import Products from './pages/prodcuts';
import Billing from './pages/billing';
import HistoryTransfer from './pages/historyTransfer';
import AddStock from './pages/addStock';

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow ml-64 bg-secondary p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="inventoryManagement" element={<InventoryManagement />} />
            <Route path="products" element={<Products />} />
            <Route path="billing" element={<Billing />} />
            <Route path="historyTransfer" element={<HistoryTransfer />} />
            <Route path="addStock" element={<AddStock />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
