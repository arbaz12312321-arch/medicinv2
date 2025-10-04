import React, { useState } from 'react';
import { Calendar, Plus, X, ArrowLeft } from 'lucide-react';

interface AddMedicineFormProps {
  onBack: () => void;
}

const AddMedicineForm: React.FC<AddMedicineFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    medicineName: '',
    brandName: '',
    saltComposition: '',
    strength: '',
    form: '',
    packSize: '',
    description: '',
    batchNumber: '',
    expiryDate: '',
    initialQuantity: '',
    costPrice: '',
    mrp: '',
    gstRate: '',
    hsnCode: '',
    gtinBarcode: '',
    manufacturer: '',
    marketingCompany: '',
    minStockLevel: '',
    maxStockLevel: '',
    reorderLevel: '',
    category: '',
    abcClassification: ''
  });

  const medicineFormsOptions = [
    'Select form',
    'Tablet',
    'Capsule',
    'Syrup',
    'Suspension',
    'Injection',
    'Cream',
    'Ointment',
    'Gel',
    'Drops',
    'Spray',
    'Inhaler',
    'Sachet',
    'Powder',
    'Lotion',
    'Solution'
  ];

  const gstRateOptions = [
    'Select GST rate',
    '0%',
    '5%',
    '12%',
    '18%',
    '28%'
  ];

  const categoryOptions = [
    'Select category',
    'Antibiotics',
    'Pain Relief',
    'Vitamins & Supplements',
    'Cardiovascular',
    'Diabetes Care',
    'Respiratory',
    'Gastrointestinal',
    'Dermatology',
    'Ophthalmology',
    'Neurology'
  ];

  const abcClassificationOptions = [
    'Select classification',
    'Class A',
    'Class B',
    'Class C'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Handle form submission logic here
  };

  const handleCancel = () => {
    // Reset form or navigate away
    setFormData({
      medicineName: '',
      brandName: '',
      saltComposition: '',
      strength: '',
      form: '',
      packSize: '',
      description: '',
      batchNumber: '',
      expiryDate: '',
      initialQuantity: '',
      costPrice: '',
      mrp: '',
      gstRate: '',
      hsnCode: '',
      gtinBarcode: '',
      manufacturer: '',
      marketingCompany: '',
      minStockLevel: '',
      maxStockLevel: '',
      reorderLevel: '',
      category: '',
      abcClassification: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Add New Medicine</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-medium text-gray-900 mb-1">Basic Information</h2>
                <p className="text-sm text-gray-500 mb-4">Enter the basic details of the medicine</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="medicineName"
                    value={formData.medicineName}
                    onChange={handleInputChange}
                    placeholder="e.g. Paracetamol"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    placeholder="e.g. Crocin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salt Composition
                  </label>
                  <input
                    type="text"
                    name="saltComposition"
                    value={formData.saltComposition}
                    onChange={handleInputChange}
                    placeholder="e.g. Paracetamol"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strength *
                  </label>
                  <input
                    type="text"
                    name="strength"
                    value={formData.strength}
                    onChange={handleInputChange}
                    placeholder="e.g. 500mg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form *
                  </label>
                  <select
                    name="form"
                    value={formData.form}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {medicineFormsOptions.map((option, index) => (
                      <option key={index} value={index === 0 ? '' : option} disabled={index === 0}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pack Size
                  </label>
                  <input
                    type="text"
                    name="packSize"
                    value={formData.packSize}
                    onChange={handleInputChange}
                    placeholder="e.g. 10 tablets"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional details about the medicine"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Initial Batch Information */}
            <div className="space-y-6 border-t border-gray-200 pt-8">
              <div>
                <h2 className="text-base font-medium text-gray-900 mb-1">Initial Batch Information</h2>
                <p className="text-sm text-gray-500 mb-4">Add the first batch for this medicine</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Number *
                  </label>
                  <input
                    type="text"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. BTC40115"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Quantity *
                  </label>
                  <input
                    type="number"
                    name="initialQuantity"
                    value={formData.initialQuantity}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    placeholder="e.g. 25.50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MRP *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    placeholder="e.g. 45.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Rate (%)
                  </label>
                  <select
                    name="gstRate"
                    value={formData.gstRate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {gstRateOptions.map((option, index) => (
                      <option key={index} value={index === 0 ? '' : option} disabled={index === 0}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Regulatory Information */}
            <div className="space-y-6 border-t border-gray-200 pt-8">
              <div>
                <h2 className="text-base font-medium text-gray-900 mb-1">Regulatory Information</h2>
                <p className="text-sm text-gray-500 mb-4">Compliance and regulatory details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSN Code
                  </label>
                  <input
                    type="text"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 30049099"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GTIN/Barcode
                  </label>
                  <input
                    type="text"
                    name="gtinBarcode"
                    value={formData.gtinBarcode}
                    onChange={handleInputChange}
                    placeholder="e.g. 123456789012"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="e.g. GSK Pharmaceuticals"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marketing Company
                  </label>
                  <input
                    type="text"
                    name="marketingCompany"
                    value={formData.marketingCompany}
                    onChange={handleInputChange}
                    placeholder="e.g. GSK Pharmaceuticals"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  📋 This is a Schedule H medicine (requires prescription tracking)
                </p>
              </div>
            </div>

            {/* Inventory Settings */}
            <div className="space-y-6 border-t border-gray-200 pt-8">
              <div>
                <h2 className="text-base font-medium text-gray-900 mb-1">Inventory Settings</h2>
                <p className="text-sm text-gray-500 mb-4">Stock management and reorder settings</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock Level
                  </label>
                  <input
                    type="number"
                    name="minStockLevel"
                    value={formData.minStockLevel}
                    onChange={handleInputChange}
                    placeholder="e.g. 10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Stock Level
                  </label>
                  <input
                    type="number"
                    name="maxStockLevel"
                    value={formData.maxStockLevel}
                    onChange={handleInputChange}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reorder Level
                  </label>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={formData.reorderLevel}
                    onChange={handleInputChange}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categoryOptions.map((option, index) => (
                      <option key={index} value={index === 0 ? '' : option} disabled={index === 0}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ABC Classification
                  </label>
                  <select
                    name="abcClassification"
                    value={formData.abcClassification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {abcClassificationOptions.map((option, index) => (
                      <option key={index} value={index === 0 ? '' : option} disabled={index === 0}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Save Medicine
              </button>
              
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Save & Add Another
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicineForm;