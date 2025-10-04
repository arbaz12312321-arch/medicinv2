import React, { useState, useEffect } from 'react';
import { X, CreditCard, Plus } from 'lucide-react';

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (batchData: {
    batchNumber: string;
    expiryDate: string;
    stock: number;
    sellingPrice: number;
    purchasePrice: number;
    mrp: number;
    manufacturingDate: string;
  }) => void;
  medicineName: string;
}

const AddBatchModal: React.FC<AddBatchModalProps> = ({
  isOpen,
  onClose,
  onAddBatch,
  medicineName
}) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [manufacturingDate, setManufacturingDate] = useState('');

  // Calculate bill summary
  const subtotal = sellingPrice * stock;
  const gstRate = 0.12; // 12% GST
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setBatchNumber('');
      setExpiryDate('');
      setStock(0);
      setSellingPrice(0);
      setPurchasePrice(0);
      setMrp(0);
      setManufacturingDate('');
    }
  }, [isOpen]);

  const handleSubmit = (processAndAddMore: boolean = false) => {
    // Validation
    if (!batchNumber.trim()) {
      alert('Please enter batch number');
      return;
    }
    if (!expiryDate) {
      alert('Please select expiry date');
      return;
    }
    if (!manufacturingDate) {
      alert('Please select manufacturing date');
      return;
    }
    if (stock <= 0) {
      alert('Please enter valid stock quantity');
      return;
    }
    if (sellingPrice <= 0) {
      alert('Please enter valid selling price');
      return;
    }
    if (purchasePrice <= 0) {
      alert('Please enter valid purchase price');
      return;
    }
    if (mrp <= 0) {
      alert('Please enter valid MRP');
      return;
    }

    // Check if manufacturing date is before expiry date
    if (new Date(manufacturingDate) >= new Date(expiryDate)) {
      alert('Manufacturing date must be before expiry date');
      return;
    }

    const batchData = {
      batchNumber: batchNumber.trim(),
      expiryDate,
      stock,
      sellingPrice,
      purchasePrice,
      mrp,
      manufacturingDate
    };

    onAddBatch(batchData);

    if (processAndAddMore) {
      // Reset form for next entry
      setBatchNumber('');
      setExpiryDate('');
      setStock(0);
      setSellingPrice(0);
      setPurchasePrice(0);
      setMrp(0);
      setManufacturingDate('');
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Batch</h2>
            <p className="text-gray-600 mt-1">Adding batch for: <span className="font-semibold">{medicineName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batch Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g., AB12345"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Manufacturing Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturing Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={manufacturingDate}
                    onChange={(e) => setManufacturingDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={stock || ''}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    placeholder="e.g., 100"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={purchasePrice || ''}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 95.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 120.50"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* MRP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MRP (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={mrp || ''}
                    onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 150.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Bill Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (12%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleSubmit(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    <CreditCard className="w-4 h-4" />
                    Process Payment
                  </button>
                  
                  <button
                    onClick={() => handleSubmit(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Process & Add More
                  </button>
                </div>

                {/* Batch Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Batch Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-medium">{stock} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost per unit:</span>
                      <span className="font-medium">₹{purchasePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Selling price:</span>
                      <span className="font-medium">₹{sellingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit margin:</span>
                      <span className="font-medium text-green-600">
                        {sellingPrice > 0 ? ((sellingPrice - purchasePrice) / purchasePrice * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBatchModal;