import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { ArrowLeft, Moon, Sun, User, Save, X, Trash2, Plus, CreditCard, AlertTriangle } from 'lucide-react';
import NotificationSystem from './NotificationSystem';
import PriceChangeModal from './PriceChangeModal';

interface BatchEditorProps {
  onNavigateBack: () => void;
}

interface Batch {
  id: string;
  batchNo: string;
  expiryDate: string;
  stockQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
}

interface PriceChange {
  batchNo: string;
  changes: {
    [key: string]: {
      old: number;
      new: number;
    };
  };
}

const BatchEditor: React.FC<BatchEditorProps> = ({ onNavigateBack }) => {
  const { theme, toggleTheme } = useTheme();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [originalBatches, setOriginalBatches] = useState<Batch[]>([]);
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const [showPriceChangeModal, setShowPriceChangeModal] = useState(false);
  const [billTotal, setBillTotal] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const GST_RATE = 0.12;

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = () => {
    const savedBatches = localStorage.getItem('medicineBatches');
    let initialBatches: Batch[];

    if (savedBatches) {
      initialBatches = JSON.parse(savedBatches);
    } else {
      initialBatches = [
        {
          id: 'batch1',
          batchNo: 'BT2345',
          expiryDate: '2025-12-31',
          stockQuantity: 100,
          purchasePrice: 75.00,
          sellingPrice: 95.00,
          mrp: 100.00
        },
        {
          id: 'batch2',
          batchNo: 'BT7890',
          expiryDate: '2025-09-30',
          stockQuantity: 50,
          purchasePrice: 72.00,
          sellingPrice: 91.00,
          mrp: 98.00
        },
        {
          id: 'batch3',
          batchNo: 'BT1223',
          expiryDate: '2024-12-15',
          stockQuantity: 0,
          purchasePrice: 80.00,
          sellingPrice: 105.00,
          mrp: 110.00
        }
      ];
    }

    setBatches(initialBatches);
    setOriginalBatches(JSON.parse(JSON.stringify(initialBatches)));
  };

  const getExpiredBatchesCount = () => {
    const now = new Date();
    return batches.filter(batch => new Date(batch.expiryDate) < now).length;
  };

  const saveBatches = () => {
    localStorage.setItem('medicineBatches', JSON.stringify(batches));
  };

  const updateBatch = (batchId: string, field: keyof Batch, value: string | number) => {
    setBatches(prev => prev.map(batch =>
      batch.id === batchId
        ? { ...batch, [field]: value }
        : batch
    ));
  };

  const addNewBatch = () => {
    const newBatch: Batch = {
      id: `batch_${Date.now()}`,
      batchNo: `BT${Math.floor(Math.random() * 10000)}`,
      expiryDate: '',
      stockQuantity: 0,
      purchasePrice: 0,
      sellingPrice: 0,
      mrp: 0
    };

    setBatches(prev => [...prev, newBatch]);
    setNotification({ message: 'New batch added', type: 'success' });
  };

  const deleteBatch = (batchId: string) => {
    if (batches.length <= 1) {
      setNotification({ message: 'At least one batch is required', type: 'error' });
      return;
    }

    if (window.confirm('Are you sure you want to delete this batch?')) {
      setBatches(prev => prev.filter(batch => batch.id !== batchId));
      setNotification({ message: 'Batch deleted', type: 'success' });
    }
  };

  const calculateBillSummary = () => {
    let subtotal = 0;

    batches.forEach(batch => {
      const originalBatch = originalBatches.find(ob => ob.id === batch.id);
      if (originalBatch && originalBatch.purchasePrice !== batch.purchasePrice) {
        const priceDifference = batch.purchasePrice - originalBatch.purchasePrice;
        subtotal += priceDifference * batch.stockQuantity;
      }
    });

    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;

    return { subtotal, gst, total };
  };

  const detectPriceChanges = (): boolean => {
    const changes: PriceChange[] = [];

    batches.forEach(batch => {
      const originalBatch = originalBatches.find(ob => ob.id === batch.id);
      if (originalBatch) {
        const batchChanges: { [key: string]: { old: number; new: number } } = {};

        if (originalBatch.sellingPrice !== batch.sellingPrice) {
          batchChanges.sellingPrice = {
            old: originalBatch.sellingPrice,
            new: batch.sellingPrice
          };
        }

        if (originalBatch.purchasePrice !== batch.purchasePrice) {
          batchChanges.purchasePrice = {
            old: originalBatch.purchasePrice,
            new: batch.purchasePrice
          };
        }

        if (originalBatch.mrp !== batch.mrp) {
          batchChanges.mrp = {
            old: originalBatch.mrp,
            new: batch.mrp
          };
        }

        if (Object.keys(batchChanges).length > 0) {
          changes.push({
            batchNo: batch.batchNo,
            changes: batchChanges
          });
        }
      }
    });

    setPriceChanges(changes);
    return changes.length > 0;
  };

  const validateAllBatches = (): boolean => {
    return batches.every(batch =>
      batch.batchNo &&
      batch.expiryDate &&
      batch.stockQuantity >= 0 &&
      batch.sellingPrice >= 0 &&
      batch.purchasePrice >= 0 &&
      batch.mrp >= 0
    );
  };

  const handleSave = () => {
    if (!validateAllBatches()) {
      setNotification({ message: 'Please fix all validation errors', type: 'error' });
      return;
    }

    if (detectPriceChanges()) {
      setShowPriceChangeModal(true);
    } else {
      saveBatchesAndReturn();
    }
  };

  const saveBatchesAndReturn = () => {
    saveBatches();

    const medicineFormBatches = batches.map(batch => {
      const expiryDate = new Date(batch.expiryDate);
      const now = new Date();
      const monthsUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

      return {
        name: `Batch: ${batch.batchNo}`,
        mrp: batch.mrp,
        expiry: expiryDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        stock: batch.stockQuantity,
        isNearExpiry: monthsUntilExpiry <= 6 && monthsUntilExpiry > 0,
        isExpired: expiryDate < now
      };
    });

    localStorage.setItem('updatedBatches', JSON.stringify(medicineFormBatches));
    localStorage.setItem('batchCount', batches.length.toString());

    setNotification({ message: 'Batches saved successfully!', type: 'success' });

    setTimeout(() => {
      onNavigateBack();
    }, 1500);
  };

  const confirmPriceChanges = () => {
    const historyEntry = {
      id: `history_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'PRICE_CHANGE',
      changes: priceChanges,
      user: 'admin',
      reason: 'Batch price update'
    };

    const checkoutHistory = JSON.parse(localStorage.getItem('checkoutHistory') || '[]');
    checkoutHistory.push(historyEntry);
    localStorage.setItem('checkoutHistory', JSON.stringify(checkoutHistory));

    const { total } = calculateBillSummary();
    setBillTotal(prev => prev + total);

    setShowPriceChangeModal(false);
    setOriginalBatches(JSON.parse(JSON.stringify(batches)));
    setNotification({ message: 'Price changes confirmed and logged to checkout history', type: 'success' });
  };

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    setNotification({ message: 'Processing payment...', type: 'info' });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const currentBillTotal = billTotal;
      const paymentData = {
        id: `payment_${Date.now()}`,
        amount: currentBillTotal,
        batches: batches,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      payments.push(paymentData);
      localStorage.setItem('payments', JSON.stringify(payments));

      setBillTotal(0);

      setNotification({ message: 'Payment processed successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Payment processing failed', type: 'error' });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleHoldTransaction = () => {
    const currentBillTotal = billTotal;
    const holdData = {
      id: `hold_${Date.now()}`,
      batches: batches,
      amount: currentBillTotal,
      timestamp: new Date().toISOString(),
      status: 'held'
    };

    const heldTransactions = JSON.parse(localStorage.getItem('heldTransactions') || '[]');
    heldTransactions.push(holdData);
    localStorage.setItem('heldTransactions', JSON.stringify(heldTransactions));

    setNotification({ message: 'Transaction held successfully', type: 'success' });
  };

  const hasUnsavedChanges = (): boolean => {
    return JSON.stringify(batches) !== JSON.stringify(originalBatches);
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
        onNavigateBack();
      }
    } else {
      onNavigateBack();
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onNavigateBack();
      }
    } else {
      onNavigateBack();
    }
  };

  const { subtotal, gst, total } = React.useMemo(() => {
    const currentChangeCost = calculateBillSummary();
    return {
      subtotal: currentChangeCost.subtotal,
      gst: currentChangeCost.gst,
      total: billTotal + currentChangeCost.total
    };
  }, [batches, originalBatches, billTotal]);
  const expiredBatchesCount = getExpiredBatchesCount();

  return (
    <div className="dashboard-container container mx-auto max-w-7xl p-4 min-h-screen">
      <NotificationSystem notification={notification} onClose={() => setNotification(null)} />

      <header className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Batches & Price</h1>
          {expiredBatchesCount > 0 && (
            <span className="alert-badge animate-fade-in">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {expiredBatchesCount} Expired Batches
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="btn-primary p-2"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform duration-200 cursor-pointer">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
        <div className="xl:col-span-3 space-y-6">
          {batches.map((batch, index) => {
            const isExpired = new Date(batch.expiryDate) < new Date();
            const isOutOfStock = batch.stockQuantity === 0;

            return (
              <div key={batch.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Batch No {index + 1}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Update details for this batch</p>
                    {isExpired && (
                      <div className="expired-alert mt-2 text-sm">
                        ⚠️ This batch has expired
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteBatch(batch.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batch No</label>
                    <input
                      type="text"
                      value={batch.batchNo}
                      onChange={(e) => updateBatch(batch.id, 'batchNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus-primary transition-colors duration-200"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={batch.expiryDate}
                      onChange={(e) => updateBatch(batch.id, 'expiryDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus-primary transition-colors duration-200 ${
                        isExpired ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={batch.stockQuantity}
                      onChange={(e) => updateBatch(batch.id, 'stockQuantity', parseInt(e.target.value) || 0)}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus-primary transition-colors duration-200 ${
                        isOutOfStock ? 'border-gray-400 bg-gray-100 dark:bg-gray-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      required
                    />
                    {isOutOfStock && (
                      <span className="text-gray-500 text-xs mt-1">Out of stock</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price</label>
                    <input
                      type="number"
                      value={batch.sellingPrice}
                      onChange={(e) => updateBatch(batch.id, 'sellingPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus-primary transition-colors duration-200"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Price</label>
                    <input
                      type="number"
                      value={batch.purchasePrice}
                      onChange={(e) => updateBatch(batch.id, 'purchasePrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus-primary transition-colors duration-200"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MRP</label>
                    <input
                      type="number"
                      value={batch.mrp}
                      onChange={(e) => updateBatch(batch.id, 'mrp', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus-primary transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={addNewBatch}
            className="w-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Another Batch
          </button>
        </div>

        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Bill Summary</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Tracks cost changes only. Starts at ₹0 and increases when purchase prices change.</p>

            <div className="space-y-3 mb-6">
              {billTotal > 0 && (
                <div className="flex justify-between items-center py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3 rounded-lg">
                  <span className="text-blue-600 dark:text-blue-400">Previous Changes:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">₹{billTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Changes:</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">GST (12%):</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-semibold text-lg border-t-2 border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total Cost:</span>
                <span className="text-gray-900 dark:text-white">₹{total.toFixed(2)}</span>
              </div>
              {total === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
                  No price changes detected
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleProcessPayment}
                disabled={isProcessingPayment || total === 0}
                className="btn-primary w-full px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <CreditCard className="w-4 h-4" />
                {isProcessingPayment ? 'Processing...' : 'Process Payment'}
              </button>
              <button
                onClick={handleHoldTransaction}
                disabled={total === 0}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
              >
                Hold Transaction
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleCancel}
          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="btn-primary px-6 py-3 flex items-center justify-center gap-2 font-medium"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {showPriceChangeModal && (
        <PriceChangeModal
          priceChanges={priceChanges}
          onClose={() => setShowPriceChangeModal(false)}
          onConfirm={confirmPriceChanges}
        />
      )}
    </div>
  );
};

export default BatchEditor;
