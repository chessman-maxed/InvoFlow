import { Invoice, InvoiceItem, ConversationExtraction, InvoiceChange } from "./types";
import { matchCatalogItem } from "./priceMatch";
import { calculateLineTotal } from "./invoice";

export interface InvoiceUpdateResult {
  invoice: Invoice;
  changes: InvoiceChange[];
}

/**
 * Applies a ConversationExtraction onto an existing Invoice in a stateful manner.
 * Handles ADD, UPDATE, and REMOVE actions deterministically with catalog price matching.
 */
export function applyConversationToInvoice(
  currentInvoice: Invoice,
  extraction: ConversationExtraction
): InvoiceUpdateResult {
  // Deep copy existing items to avoid mutation
  let updatedItems: InvoiceItem[] = currentInvoice.items.map((item) => ({ ...item }));
  const changes: InvoiceChange[] = [];

  for (const extractedItem of extraction.items) {
    const match = matchCatalogItem(extractedItem.name);
    
    // Fallback item name and ID if no catalog match is found
    const targetId = match ? match.item.id : extractedItem.name.toLowerCase().replace(/\s+/g, "-");
    const targetName = match ? match.item.name : extractedItem.name;
    const targetUnit = match ? match.item.unit : "unit";
    const targetUnitPrice = match ? match.item.price : 0;
    const targetCategory = match ? match.item.category : undefined;

    const existingIndex = updatedItems.findIndex(
      (item) => item.id === targetId || item.name.toLowerCase() === targetName.toLowerCase()
    );

    const safeQty = Math.max(1, extractedItem.quantity || 1);

    if (extractedItem.action === "remove") {
      if (existingIndex !== -1) {
        const removedItem = updatedItems[existingIndex];
        updatedItems.splice(existingIndex, 1);
        changes.push({
          type: "remove",
          itemName: removedItem.name,
          quantity: removedItem.quantity,
          reason: `Removed ${removedItem.name}`,
        });
      }
    } else if (extractedItem.action === "update") {
      if (existingIndex !== -1) {
        const prevQty = updatedItems[existingIndex].quantity;
        updatedItems[existingIndex].quantity = safeQty;
        updatedItems[existingIndex].total = calculateLineTotal(
          updatedItems[existingIndex].unitPrice,
          safeQty
        );
        changes.push({
          type: "update",
          itemName: updatedItems[existingIndex].name,
          quantity: safeQty,
          reason: `Updated ${updatedItems[existingIndex].name}: ${prevQty} → ${safeQty}`,
        });
      } else {
        // If not found, add as new item
        const newItem: InvoiceItem = {
          id: targetId,
          name: targetName,
          quantity: safeQty,
          unit: targetUnit,
          unitPrice: targetUnitPrice,
          total: calculateLineTotal(targetUnitPrice, safeQty),
          category: targetCategory,
        };
        updatedItems.push(newItem);
        changes.push({
          type: "add",
          itemName: newItem.name,
          quantity: safeQty,
          reason: `Added ${safeQty} × ${newItem.name}`,
        });
      }
    } else {
      // Action: "add"
      if (existingIndex !== -1) {
        const prevQty = updatedItems[existingIndex].quantity;
        const newQty = prevQty + safeQty;
        updatedItems[existingIndex].quantity = newQty;
        updatedItems[existingIndex].total = calculateLineTotal(
          updatedItems[existingIndex].unitPrice,
          newQty
        );
        changes.push({
          type: "update",
          itemName: updatedItems[existingIndex].name,
          quantity: newQty,
          reason: `Increased ${updatedItems[existingIndex].name}: ${prevQty} → ${newQty}`,
        });
      } else {
        const newItem: InvoiceItem = {
          id: targetId,
          name: targetName,
          quantity: safeQty,
          unit: targetUnit,
          unitPrice: targetUnitPrice,
          total: calculateLineTotal(targetUnitPrice, safeQty),
          category: targetCategory,
        };
        updatedItems.push(newItem);
        changes.push({
          type: "add",
          itemName: newItem.name,
          quantity: safeQty,
          reason: `Added ${safeQty} × ${newItem.name}`,
        });
      }
    }
  }

  // Recalculate totals
  const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
  const tax = currentInvoice.tax ? Math.round(subtotal * 0.18) : undefined;
  const total = subtotal + (tax || 0);

  const updatedInvoice: Invoice = {
    ...currentInvoice,
    clientName: extraction.clientName || currentInvoice.clientName,
    freelancerName: extraction.freelancerName || currentInvoice.freelancerName,
    items: updatedItems,
    subtotal,
    tax,
    total,
    notes: extraction.notes || currentInvoice.notes,
  };

  return {
    invoice: updatedInvoice,
    changes,
  };
}
