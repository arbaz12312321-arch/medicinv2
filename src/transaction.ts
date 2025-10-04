export interface Transaction {
  id: string;
  invoice: string;
  customer: string;
  amount: string;
  payment: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  description?: string;
  type: 'Sale' | 'Purchase' | 'Batch Addition' | 'Batch Update';
}