export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export type ThemeName = 'classic' | 'modern' | 'minimal' | 'bold' | 'elegant';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  fromName: string;
  fromAddress: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  notes: string;
  gstRate: number;
  theme: ThemeName;
  currency: string;
}
