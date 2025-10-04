import React from 'react';
import {
  LayoutDashboard,
  Package,
  RotateCcw,
  ShoppingCart,
  AlertTriangle,
  TrendingDown,
  Settings,
  LogOut,
  Pill
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'restock', label: 'Restock', icon: RotateCcw },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'expiry', label: 'Expiry Alert', icon: AlertTriangle, alert: true },
    { id: 'lowstock', label: 'Low Stock', icon: TrendingDown, alert: true },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Pill className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-800">PharmaFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium">{item.label}</span>
                  {item.alert && !isActive && (
                    <div className="w-2 h-2 bg-red-500 rounded-full ml-auto"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-100">
        <ul className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;