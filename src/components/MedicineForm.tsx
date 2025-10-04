import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { ArrowLeft, Moon, Sun, User, Save, X, AlertTriangle, Package } from 'lucide-react';
import FormValidation from '../utils/formValidation';
import NotificationSystem from './NotificationSystem';

interface MedicineFormProps {
  onNavigateToBatches: () => void;
}

interface MedicineData {
  basicInfo: {
    medicineName: string;
    brandName: string;
    saltComposition: string;
    strength: string;
    form: string;
    packSize: string;
    description: string;
  };
  regulatoryInfo: {
    hsnCode: string;
    gtinBarcode: string;
    manufacturer: string;
    marketingCompany: string;
    isScheduleH1: boolean;
  };
}

interface BatchInfo {
  name: string;
  mrp: number;
  expiry: string;
  stock: number;
  isNearExpiry?: boolean;
  isExpired?: boolean;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ onNavigateToBatches }) => {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<MedicineData>({
    basicInfo: {
      medicineName: '',
      brandName: '',
      saltComposition: '',
      strength: '',
      form: 'tablet',
      packSize: '',
      description: ''
    },
    regulatoryInfo: {
      hsnCode: '',
      gtinBarcode: '',
      manufacturer: '',
      marketingCompany: '',
      isScheduleH1: false
    }
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [batches, setBatches] = useState<BatchInfo[]>([]);
  const [batchCount, setBatchCount] = useState(3);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    loadBatchData();
  }, []);

  const loadBatchData = () => {
    const savedBatches = localStorage.getItem('updatedBatches');
    const savedBatchCount = localStorage.getItem('batchCount');

    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    } else {
      const defaultBatchData = [
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

      const medicineFormBatches = defaultBatchData.map(batch => {
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

      setBatches(medicineFormBatches);
      localStorage.setItem('medicineBatches', JSON.stringify(defaultBatchData));
    }

    if (savedBatchCount) {
      setBatchCount(parseInt(savedBatchCount));
    } else {
      setBatchCount(3);
    }
  };

  const getNearExpiryCount = () => {
    return batches.filter(batch => batch.isNearExpiry || batch.isExpired).length;
  };

  const getOutOfStockCount = () => {
    return batches.filter(batch => batch.stock === 0).length;
  };

  const handleInputChange = (field: string, value: string | boolean, section: 'basicInfo' | 'regulatoryInfo') => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.basicInfo.medicineName.trim()) {
      errors.medicineName = 'Medicine name is required';
    } else if (formData.basicInfo.medicineName.length < 2) {
      errors.medicineName = 'Medicine name must be at least 2 characters';
    }

    if (!formData.basicInfo.brandName.trim()) {
      errors.brandName = 'Brand name is required';
    }

    if (!formData.basicInfo.strength.trim()) {
      errors.strength = 'Strength is required';
    } else if (!/^\d+(\.\d+)?\s*(mg|g|ml|mcg|iu)$/i.test(formData.basicInfo.strength)) {
      errors.strength = 'Please enter valid strength (e.g., 500mg, 10ml)';
    }

    if (!formData.basicInfo.form) {
      errors.form = 'Form is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification({ message: 'Please fix all validation errors before saving', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
      const medicineId = Date.now().toString();

      const newMedicine = {
        id: medicineId,
        ...formData,
        timestamp: new Date().toISOString()
      };

      medicines.push(newMedicine);
      localStorage.setItem('medicines', JSON.stringify(medicines));

      setNotification({ message: 'Medicine saved successfully!', type: 'success' });

      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error) {
      setNotification({ message: 'Error saving medicine. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      basicInfo: {
        medicineName: '',
        brandName: '',
        saltComposition: '',
        strength: '',
        form: 'tablet',
        packSize: '',
        description: ''
      },
      regulatoryInfo: {
        hsnCode: '',
        gtinBarcode: '',
        manufacturer: '',
        marketingCompany: '',
        isScheduleH1: false
      }
    });
    setValidationErrors({});
    setNotification({ message: 'Form has been reset', type: 'info' });
  };

  const hasUnsavedChanges = () => {
    return Object.values(formData.basicInfo).some(value => value !== '' && value !== 'tablet') ||
           Object.values(formData.regulatoryInfo).some((value, index) =>
             index === Object.keys(formData.regulatoryInfo).length - 1 ? value !== false : value !== ''
           );
  };

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  const nearExpiryCount = getNearExpiryCount();
  const outOfStockCount = getOutOfStockCount();

  return (
    <div className="dashboard-container container mx-auto max-w-6xl p-4 min-h-screen">
      <NotificationSystem notification={notification} onClose={() => setNotification(null)} />

      <header className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Medicine</h1>
          <div className="flex gap-2">
            {nearExpiryCount > 0 && (
              <span className="alert-badge animate-fade-in">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                {nearExpiryCount} items Near Expiry
              </span>
            )}
            {outOfStockCount > 0 && (
              <span className="alert-badge animate-fade-in">
                <Package className="w-3 h-3 inline mr-1" />
                {outOfStockCount} Out of Stock
              </span>
            )}
          </div>
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

      <form onSubmit={handleSubmit} className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md transition-all duration-300 ${isLoading ? 'loading' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Basic Information</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter the basic details of the medicine</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  id="medicineName"
                  value={formData.basicInfo.medicineName}
                  onChange={(e) => handleInputChange('medicineName', e.target.value, 'basicInfo')}
                  placeholder="e.g. Paracetamol"
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus-primary ${
                    validationErrors.medicineName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {validationErrors.medicineName && (
                  <span className="text-red-500 text-xs mt-1">{validationErrors.medicineName}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  id="brandName"
                  value={formData.basicInfo.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value, 'basicInfo')}
                  placeholder="e.g. Crocin"
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus-primary ${
                    validationErrors.brandName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {validationErrors.brandName && (
                  <span className="text-red-500 text-xs mt-1">{validationErrors.brandName}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="saltComposition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salt Composition (Search)
                </label>
                <input
                  type="text"
                  id="saltComposition"
                  value={formData.basicInfo.saltComposition}
                  onChange={(e) => handleInputChange('saltComposition', e.target.value, 'basicInfo')}
                  placeholder="Search by salt composition..."
                  className="search-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none"
                />
              </div>
              <div className="form-group">
                <label htmlFor="strength" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Strength *
                </label>
                <input
                  type="text"
                  id="strength"
                  value={formData.basicInfo.strength}
                  onChange={(e) => handleInputChange('strength', e.target.value, 'basicInfo')}
                  placeholder="e.g. 500mg"
                  className={`barcode-input w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none ${
                    validationErrors.strength ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {validationErrors.strength && (
                  <span className="text-red-500 text-xs mt-1">{validationErrors.strength}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="form" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Form *
                </label>
                <select
                  id="form"
                  value={formData.basicInfo.form}
                  onChange={(e) => handleInputChange('form', e.target.value, 'basicInfo')}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 focus:outline-none focus-primary cursor-pointer ${
                    validationErrors.form ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select form</option>
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="syrup">Syrup</option>
                  <option value="injection">Injection</option>
                  <option value="cream">Cream</option>
                  <option value="drops">Drops</option>
                </select>
                {validationErrors.form && (
                  <span className="text-red-500 text-xs mt-1">{validationErrors.form}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="packSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pack Size
                </label>
                <input
                  type="text"
                  id="packSize"
                  value={formData.basicInfo.packSize}
                  onChange={(e) => handleInputChange('packSize', e.target.value, 'basicInfo')}
                  placeholder="e.g. 10 tablets"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus-primary"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.basicInfo.description}
                onChange={(e) => handleInputChange('description', e.target.value, 'basicInfo')}
                placeholder="Additional details about the medicine"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus-primary resize-vertical"
              />
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Regulatory Information</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Compliance and regulatory details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="hsnCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  HSN Code
                </label>
                <input
                  type="text"
                  id="hsnCode"
                  value={formData.regulatoryInfo.hsnCode}
                  onChange={(e) => handleInputChange('hsnCode', e.target.value, 'regulatoryInfo')}
                  placeholder="e.g. 30049099"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus-primary"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gtinBarcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GTIN/Barcode
                </label>
                <input
                  type="text"
                  id="gtinBarcode"
                  value={formData.regulatoryInfo.gtinBarcode}
                  onChange={(e) => handleInputChange('gtinBarcode', e.target.value, 'regulatoryInfo')}
                  placeholder="e.g. 1234567890123"
                  className="barcode-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  value={formData.regulatoryInfo.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value, 'regulatoryInfo')}
                  placeholder="e.g. GSK Pharmaceuticals"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus-primary"
                />
              </div>
              <div className="form-group">
                <label htmlFor="marketingCompany" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Marketing Company
                </label>
                <input
                  type="text"
                  id="marketingCompany"
                  value={formData.regulatoryInfo.marketingCompany}
                  onChange={(e) => handleInputChange('marketingCompany', e.target.value, 'regulatoryInfo')}
                  placeholder="e.g. GSK Pharmaceuticals"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                id="scheduleH1"
                checked={formData.regulatoryInfo.isScheduleH1}
                onChange={(e) => handleInputChange('isScheduleH1', e.target.checked, 'regulatoryInfo')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="scheduleH1" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                This is a Schedule H1 medicine (requires prescription tracking)
              </label>
            </div>
          </section>
        </div>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active batches: <span style={{ color: 'var(--color-primary)' }}>{batchCount}</span>
            </h3>
            <button
              type="button"
              onClick={onNavigateToBatches}
              className="btn-primary text-sm px-4 py-2"
            >
              edit batches
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch, index) => {
              const isNearExpiry = batch.isNearExpiry;
              const isExpired = batch.isExpired;
              const isOutOfStock = batch.stock === 0;

              return (
                <div
                  key={index}
                  className={`inventory-row border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${
                    isNearExpiry || isExpired ? 'near-expiry' : 'bg-gray-50 dark:bg-gray-700'
                  } ${isOutOfStock ? 'zero-stock' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-medium text-sm ${isOutOfStock ? 'disabled-item' : 'text-gray-900 dark:text-white'}`}>
                      {batch.name}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 dark:text-gray-400">MRP</div>
                      <div className={`font-medium ${isOutOfStock ? 'disabled-item' : 'text-gray-900 dark:text-white'}`}>
                        ₹{batch.mrp}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className={isExpired ? 'expired-alert text-xs p-1 rounded' : isNearExpiry ? 'status-near-expiry' : 'text-gray-500 dark:text-gray-400'}>
                      Exp: {batch.expiry}
                      {isExpired && ' (EXPIRED)'}
                      {isNearExpiry && !isExpired && ' (Near Expiry)'}
                    </div>
                    <div className={batch.stock > 0 ? 'status-in-stock' : 'status-out-of-stock'}>
                      Stock: {batch.stock} {batch.stock === 0 ? '(Out of Stock)' : ''}
                    </div>
                  </div>
                  {isExpired && (
                    <div className="expired-alert mt-2 text-xs">
                      ⚠️ Expired Stock Alert
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Medicine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicineForm;
