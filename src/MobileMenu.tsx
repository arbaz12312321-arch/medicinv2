import React from 'react';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, activeItem, setActiveItem }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Menu */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-full">
          <Sidebar activeItem={activeItem} setActiveItem={(item) => {
            setActiveItem(item);
            onClose();
          }} />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;