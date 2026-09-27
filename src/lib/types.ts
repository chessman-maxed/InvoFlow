export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category?: string;
}

export interface Invoice {
  invoiceNumber: string;
  freelancerName: string;
  clientName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  total: number;
  currency: string;
  notes?: string;
}

export interface ExtractedItem {
  name: string;
  quantity: number;
  action: "add" | "update" | "remove";
  confidence?: number;
}

export interface ConversationExtraction {
  items: ExtractedItem[];
  clientName?: string;
  freelancerName?: string;
  budget?: number;
  notes?: string;
}

export interface InvoiceChange {
  type: "add" | "update" | "remove";
  itemName: string;
  quantity?: number;
  reason?: string;
}
