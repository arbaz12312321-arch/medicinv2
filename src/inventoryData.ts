import { Medicine } from './inventory';

export const medicinesData: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    type: 'Tablet',
    hsn: '30049099',
    category: 'Generic',
    manufacturer: 'GSK',
    status: 'In Stock',
    batches: [
      {
        id: 'b1',
        batchNumber: 'PCM001',
        expiryDate: '2025-12-31',
        stock: 81,
        mrp: 25,
        manufacturingDate: '2024-01-15'
      },
      {
        id: 'b2',
        batchNumber: 'PCM002',
        expiryDate: '2026-01-31',
        stock: 45,
        mrp: 25,
        manufacturingDate: '2024-02-20'
      }
    ]
  },
  {
    id: '2',
    name: 'Azithromycin 250mg',
    type: 'Tablet',
    hsn: '30042019',
    category: 'Generic',
    manufacturer: 'Cipla',
    status: 'Out of Stock',
    batches: []
  },
  {
    id: '3',
    name: 'Amoxicillin 500mg',
    type: 'Capsule',
    hsn: '30041010',
    category: 'Generic',
    manufacturer: 'Sun Pharma',
    status: 'In Stock',
    batches: [
      {
        id: 'b3',
        batchNumber: 'AMX001',
        expiryDate: '2025-08-15',
        stock: 120,
        mrp: 45,
        manufacturingDate: '2024-01-10'
      },
      {
        id: 'b4',
        batchNumber: 'AMX002',
        expiryDate: '2025-10-20',
        stock: 75,
        mrp: 45,
        manufacturingDate: '2024-03-05'
      }
    ]
  },
  {
    id: '4',
    name: 'Cetirizine 10mg',
    type: 'Tablet',
    hsn: '30049050',
    category: 'Generic',
    manufacturer: 'Dr. Reddy\'s',
    status: 'Low Stock',
    batches: [
      {
        id: 'b5',
        batchNumber: 'CET001',
        expiryDate: '2025-06-30',
        stock: 15,
        mrp: 18,
        manufacturingDate: '2024-01-20'
      }
    ]
  },
  {
    id: '5',
    name: 'Ibuprofen 400mg',
    type: 'Tablet',
    hsn: '30049020',
    category: 'Generic',
    manufacturer: 'Lupin',
    status: 'In Stock',
    batches: [
      {
        id: 'b6',
        batchNumber: 'IBU001',
        expiryDate: '2025-11-15',
        stock: 200,
        mrp: 35,
        manufacturingDate: '2024-02-10'
      },
      {
        id: 'b7',
        batchNumber: 'IBU002',
        expiryDate: '2026-02-28',
        stock: 150,
        mrp: 35,
        manufacturingDate: '2024-04-15'
      }
    ]
  },
  {
    id: '6',
    name: 'Omeprazole 20mg',
    type: 'Capsule',
    hsn: '30049030',
    category: 'Generic',
    manufacturer: 'Torrent',
    status: 'In Stock',
    batches: [
      {
        id: 'b8',
        batchNumber: 'OME001',
        expiryDate: '2025-09-30',
        stock: 90,
        mrp: 55,
        manufacturingDate: '2024-01-25'
      }
    ]
  }
];