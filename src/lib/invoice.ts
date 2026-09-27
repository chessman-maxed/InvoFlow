import { Invoice, InvoiceItem } from "./types";
import { CatalogItem } from "./priceMatch";

export interface MatchedInputItem {
  catalogItem: CatalogItem;
  quantity: number;
}

/**
 * Calculates the line total for an item given its unit price and quantity.
 */
export function calculateLineTotal(unitPrice: number, quantity: number): number {
  return unitPrice * Math.max(0, quantity);
}

/**
 * Creates an InvoiceItem from a catalog item and desired quantity.
 */
export function createInvoiceItem(catalogItem: CatalogItem, quantity: number): InvoiceItem {
  const safeQty = Math.max(1, quantity);
  const total = calculateLineTotal(catalogItem.price, safeQty);

  return {
    id: catalogItem.id,
    name: catalogItem.name,
    quantity: safeQty,
    unit: catalogItem.unit,
    unitPrice: catalogItem.price,
    total,
    category: catalogItem.category,
  };
}

/**
 * Generates a standard readable invoice number.
 * Example: INV-20260927-1234
 */
export function generateInvoiceNumber(): string {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV-${timestamp}-${randomSuffix}`;
}

export interface CreateInvoiceOptions {
  invoiceNumber?: string;
  freelancerName?: string;
  clientName?: string;
  taxRate?: number; // e.g. 0.18 for 18% GST (optional)
  notes?: string;
}

/**
 * Deterministically constructs an Invoice from a list of matched catalog items and quantities.
 */
export function calculateInvoice(
  matchedItems: MatchedInputItem[],
  options?: CreateInvoiceOptions
): Invoice {
  const items: InvoiceItem[] = matchedItems.map(({ catalogItem, quantity }) =>
    createInvoiceItem(catalogItem, quantity)
  );

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = options?.taxRate ? Math.round(subtotal * options.taxRate) : undefined;
  const total = subtotal + (tax || 0);

  return {
    invoiceNumber: options?.invoiceNumber || generateInvoiceNumber(),
    freelancerName: options?.freelancerName || "Freelancer / Agency",
    clientName: options?.clientName || "Valued Client",
    items,
    subtotal,
    tax,
    total,
    currency: "INR",
    notes: options?.notes,
  };
}
