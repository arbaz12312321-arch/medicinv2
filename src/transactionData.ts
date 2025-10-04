import { Transaction } from './transaction';

export const initialTransactions: Transaction[] = [
  {
    id: '1',
    invoice: 'INV-001',
    customer: 'John Doe',
    amount: '₹168.00',
    payment: 'Cash',
    date: '23/5/2025',
    status: 'Completed',
    description: 'Medicine sale',
    type: 'Sale'
  },
  {
    id: '2',
    invoice: 'INV-002',
    customer: 'Jane Smith',
    amount: '₹450.50',
    payment: 'Credit Card',
    date: '23/5/2025',
    status: 'Completed',
    description: 'Medicine sale',
    type: 'Sale'
  },
  {
    id: '3',
    invoice: 'INV-003',
    customer: 'Sam Wilson',
    amount: '₹75.00',
    payment: 'UPI',
    date: '22/5/2025',
    status: 'Completed',
    description: 'Medicine sale',
    type: 'Sale'
  },
  {
    id: '4',
    invoice: 'INV-004',
    customer: 'Emily Carter',
    amount: '₹210.00',
    payment: 'Cash',
    date: '22/5/2025',
    status: 'Pending',
    description: 'Medicine sale',
    type: 'Sale'
  },
  {
    id: '5',
    invoice: 'INV-005',
    customer: 'Michael Brown',
    amount: '₹325.75',
    payment: 'Credit Card',
    date: '21/5/2025',
    status: 'Completed',
    description: 'Medicine sale',
    type: 'Sale'
  }
];