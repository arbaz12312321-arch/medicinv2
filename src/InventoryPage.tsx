import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, CreditCard as Edit2, Package, Calendar, AlertTriangle, CheckCircle, XCircle, Filter, Download } from 'lucide-react';
import { Medicine, InventoryStats } from './inventory';
import { Transaction } from './transaction';
import { medicinesData } from './inventoryData';
import AddBatchModal from './AddBatchModal';
import AddMedicineForm from './AddMedicineForm';
import MedicineForm from './components/MedicineForm';
import ThemeProvider from './components/ThemeProvider';
import { v4 as uuidv4 } from 'uuid';

interface InventoryPageProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const EditMedicineWrapper: React.FC<{ medicine: Medicine }> = ({ medicine }) => {
  return (
    <ThemeProvider>
      <MedicineForm
        onNavigateToBatches={() => {
          console.log('Navigate to batches for medicine:', medicine.name);
        }}
      />
    </ThemeProvider>
  );
};

const InventoryPage: React.FC<InventoryPageProps> = ({ onAddTransaction }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(medicinesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in-stock' | 'out-of-stock' | 'low-stock'>('all');
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [selectedMedicineForBatch, setSelectedMedicineForBatch] = useState<Medicine | null>(null);
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [showEditMedicineForm, setShowEditMedicineForm] = useState(false);
  const [selectedMedicineForEdit, setSelectedMedicineForEdit] = useState<Medicine | null>(null);

  // Calculate inventory statistics
  const inventoryStats: InventoryStats = useMemo(() => {
    const totalMedicines = medicines.length;
    const totalStock = medicines.reduce((sum, medicine) => 
      sum + medicine.batches.reduce((batchSum, batch) => batchSum + batch.stock, 0), 0
    );
    const inStock = medicines.filter(m => m.status === 'In Stock').length;
    const outOfStock = medicines.filter(m => m.status === 'Out of Stock').length;
    const lowStock = medicines.filter(m => m.status === 'Low Stock').length;

    return { totalMedicines, totalStock, inStock, outOfStock, lowStock };
  }, [medicines]);

  // Filter medicines based on search term and filter
  const filteredMedicines = useMemo(() => {
    let filtered = medicines;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.hsn.includes(searchTerm) ||
        medicine.batches.some(batch => 
          batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      const statusMap = {
        'in-stock': 'In Stock',
        'out-of-stock': 'Out of Stock',
        'low-stock': 'Low Stock'
      };
      filtered = filtered.filter(medicine => medicine.status === statusMap[selectedFilter]);
    }

    return filtered;
  }, [medicines, searchTerm, selectedFilter]);

  const handleDeleteMedicine = (medicineId: string) => {
    if (window.confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
      setMedicines(prev => prev.filter(medicine => medicine.id !== medicineId));
    }
  };

  const handleOpenAddBatchModal = (medicine: Medicine) => {
    setSelectedMedicineForBatch(medicine);
    setIsAddBatchModalOpen(true);
  };

  const handleAddBatch = (batchData: {
    batchNumber: string;
    expiryDate: string;
    stock: number;
    sellingPrice: number;
    purchasePrice: number;
    mrp: number;
    manufacturingDate: string;
  }) => {
    if (!selectedMedicineForBatch) return;

    const medicineId = selectedMedicineForBatch.id;
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;

    // Check if batch already exists
    const existingBatchIndex = medicine.batches.findIndex(
      batch => batch.batchNumber.toLowerCase() === batchData.batchNumber.toLowerCase()
    );

    let transactionDescription = '';
    let isUpdate = false;

    if (existingBatchIndex !== -1) {
      // Batch exists, ask user if they want to update
      const existingBatch = medicine.batches[existingBatchIndex];
      const confirmUpdate = window.confirm(
        `Batch "${batchData.batchNumber}" already exists with ${existingBatch.stock} units.\n\n` +
        `Do you want to proceed? This will:\n` +
        `• Add ${batchData.stock} units to existing stock (Total: ${existingBatch.stock + batchData.stock})\n` +
        `• Update expiry date to ${batchData.expiryDate}\n` +
        `• Update MRP to ₹${batchData.mrp}`
      );

      if (!confirmUpdate) return;

      // Update existing batch
      const updatedMedicines = medicines.map(med => {
        if (med.id === medicineId) {
          const updatedBatches = [...med.batches];
          updatedBatches[existingBatchIndex] = {
            ...existingBatch,
            stock: existingBatch.stock + batchData.stock,
            expiryDate: batchData.expiryDate,
            mrp: batchData.mrp,
            manufacturingDate: batchData.manufacturingDate,
            purchasePrice: batchData.purchasePrice,
            sellingPrice: batchData.sellingPrice
          };

          // Update medicine status based on total stock
          const totalStock = updatedBatches.reduce((sum, batch) => sum + batch.stock, 0);
          let status: 'In Stock' | 'Out of Stock' | 'Low Stock' = 'In Stock';
          if (totalStock === 0) status = 'Out of Stock';
          else if (totalStock <= 20) status = 'Low Stock';

          return {
            ...med,
            batches: updatedBatches,
            status
          };
        }
        return med;
      });

      setMedicines(updatedMedicines);
      transactionDescription = `Updated batch ${batchData.batchNumber} for ${medicine.name} - Added ${batchData.stock} units`;
      isUpdate = true;
    } else {
      // Add new batch
      const newBatch = {
        id: uuidv4(),
        batchNumber: batchData.batchNumber,
        expiryDate: batchData.expiryDate,
        stock: batchData.stock,
        mrp: batchData.mrp,
        manufacturingDate: batchData.manufacturingDate,
        purchasePrice: batchData.purchasePrice,
        sellingPrice: batchData.sellingPrice
      };

      const updatedMedicines = medicines.map(med => {
        if (med.id === medicineId) {
          const updatedBatches = [...med.batches, newBatch];
          
          // Update medicine status based on total stock
          const totalStock = updatedBatches.reduce((sum, batch) => sum + batch.stock, 0);
          let status: 'In Stock' | 'Out of Stock' | 'Low Stock' = 'In Stock';
          if (totalStock === 0) status = 'Out of Stock';
          else if (totalStock <= 20) status = 'Low Stock';

          return {
            ...med,
            batches: updatedBatches,
            status
          };
        }
        return med;
      });

      setMedicines(updatedMedicines);
      transactionDescription = `Added new batch ${batchData.batchNumber} for ${medicine.name} - ${batchData.stock} units`;
    }

    // Create transaction record
    const transaction: Transaction = {
      id: uuidv4(),
      invoice: `BATCH-${Date.now()}`,
      customer: 'System',
      amount: `₹${(batchData.purchasePrice * batchData.stock).toFixed(2)}`,
      payment: 'Purchase',
      date: new Date().toLocaleDateString('en-GB'),
      status: 'Completed',
      description: transactionDescription,
      type: isUpdate ? 'Batch Update' : 'Batch Addition'
    };

    onAddTransaction(transaction);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Out of Stock':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Low Stock':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTotalStock = (medicine: Medicine) => {
    return medicine.batches.reduce((sum, batch) => sum + batch.stock, 0);
  };

  if (showAddMedicineForm) {
    return <AddMedicineForm onBack={() => setShowAddMedicineForm(false)} />;
  }

  if (showEditMedicineForm && selectedMedicineForEdit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          <button
            onClick={() => {
              setShowEditMedicineForm(false);
              setSelectedMedicineForEdit(null);
            }}
            className="mb-4 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
          >
            ← Back to Inventory
          </button>
          <EditMedicineWrapper medicine={selectedMedicineForEdit} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage your medicine inventory and track stock levels</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddMedicineForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Medicines</h3>
          <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalMedicines.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Stock</h3>
          <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalStock.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">In Stock</h3>
          <p className="text-2xl font-bold text-gray-900">{inventoryStats.inStock}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Low Stock</h3>
          <p className="text-2xl font-bold text-gray-900">{inventoryStats.lowStock}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Out of Stock</h3>
          <p className="text-2xl font-bold text-gray-900">{inventoryStats.outOfStock}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicine by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'in-stock', label: 'In Stock' },
              { key: 'low-stock', label: 'Low Stock' },
              { key: 'out-of-stock', label: 'Out of Stock' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          All Medicines ({filteredMedicines.length})
        </h2>
        <div className="text-sm text-gray-600">
          Total Medicines: {inventoryStats.totalMedicines.toLocaleString()}
        </div>
      </div>

      {/* Medicine List */}
      <div className="space-y-6">
        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first medicine to the inventory'}
            </p>
          </div>
        ) : (
          filteredMedicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
              {/* Medicine Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{medicine.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(medicine.status)}`}>
                        {getStatusIcon(medicine.status)}
                        {medicine.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span> {medicine.type} | <span className="font-medium">HSN:</span> {medicine.hsn} | <span className="font-medium">{medicine.category}</span>
                      </div>
                      <div>
                        <span className="font-medium">Manufacturer:</span> {medicine.manufacturer}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600">Total Stock</p>
                      <p className="text-2xl font-bold text-gray-900">{getTotalStock(medicine)}</p>
                    </div>
                    <button
                      onClick={() => handleOpenAddBatchModal(medicine)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Add Batch"
                    >
                      <Package className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMedicineForEdit(medicine);
                        setShowEditMedicineForm(true);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      title="Edit Medicine"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete Medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Batches Section */}
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Active Batches ({medicine.batches.length})
                </h4>
                
                {medicine.batches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No active batches for this medicine.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicine.batches.map((batch) => (
                      <div key={batch.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-900">Batch: {batch.batchNumber}</h5>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Exp: {new Date(batch.expiryDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Stock</p>
                            <p className="text-lg font-bold text-gray-900">{batch.stock}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-600 font-medium">MRP: ₹{batch.mrp}</span>
                          <span className="text-gray-500">
                            Mfg: {new Date(batch.manufacturingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Batch Modal */}
      {selectedMedicineForBatch && (
        <AddBatchModal
          isOpen={isAddBatchModalOpen}
          onClose={() => {
            setIsAddBatchModalOpen(false);
            setSelectedMedicineForBatch(null);
          }}
          onAddBatch={handleAddBatch}
          medicineName={selectedMedicineForBatch.name}
        />
      )}
    </div>
  );
};

export default InventoryPage;