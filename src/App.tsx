import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardCards from './DashboardCards';
import TransactionHistory from './TransactionHistory';
import MobileMenu from './MobileMenu';
import InventoryPage from './InventoryPage';
import { Transaction } from './transaction';
import { initialTransactions } from './transactionData';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">PharmaFlow</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeItem === 'dashboard' && (
              <>
                {/* Dashboard Cards */}
                <DashboardCards />
                {/* Transaction History */}
                <TransactionHistory transactions={transactions} />
              </>
            )}

            {activeItem === 'inventory' && <InventoryPage onAddTransaction={handleAddTransaction} />}

            {activeItem === 'restock' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Restock Management</h2>
                <p className="text-gray-600">Restock functionality coming soon...</p>
              </div>
            )}

            {activeItem === 'cart' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h2>
                <p className="text-gray-600">Cart functionality coming soon...</p>
              </div>
            )}

            {activeItem === 'expiry' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Expiry Alerts</h2>
                <p className="text-gray-600">Expiry alert system coming soon...</p>
              </div>
            )}

            {activeItem === 'lowstock' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Low Stock Alerts</h2>
                <p className="text-gray-600">Low stock management coming soon...</p>
              </div>
            )}

            {activeItem === 'settings' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
