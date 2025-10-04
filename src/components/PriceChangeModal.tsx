import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface PriceChange {
  batchNo: string;
  changes: {
    [key: string]: {
      old: number;
      new: number;
    };
  };
}

interface PriceChangeModalProps {
  priceChanges: PriceChange[];
  onClose: () => void;
  onConfirm: () => void;
}

const PriceChangeModal: React.FC<PriceChangeModalProps> = ({
  priceChanges,
  onClose,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Price Change Detected</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Price changes have been detected. This will create a checkout history entry.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            {priceChanges.map((change, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Batch: {change.batchNo}
                </h4>
                {Object.entries(change.changes).map(([field, values]) => (
                  <div
                    key={field}
                    className="flex justify-between items-center py-2 text-sm border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 line-through font-mono">
                        ₹{values.old.toFixed(2)}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-500 font-semibold font-mono">
                        ₹{values.new.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium hover:shadow-md hover:-translate-y-0.5"
            >
              Confirm Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChangeModal;
