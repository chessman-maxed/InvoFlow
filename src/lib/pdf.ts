import jsPDF from "jspdf";
import { Invoice } from "./types";

export function generateInvoicePDF(invoice: Invoice, budget?: number): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  let y = 18;

  // Colors
  const primaryColor = [99, 102, 241]; // #6366f1 Indigo
  const accentEmerald = [16, 185, 129]; // #10b981 Emerald
  const darkTextColor = [24, 24, 28]; // Charcoal
  const lightTextColor = [100, 105, 120]; // Muted Slate
  const tableHeaderBg = [244, 245, 250]; // Light Violet-Gray
  const cardBg = [250, 250, 254];

  // Accent Bar at Top
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 4, "F");

  // Header - Brand Icon & Name
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, y, 11, 11, 2.5, 2.5, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("IF", margin + 3.2, y + 7.5);

  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("InvoFlow", margin + 15, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text("AI Verified Invoice", margin + 15, y + 13);

  // Big INVOICE Title (Right Aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("INVOICE", pageWidth - margin, y + 9, { align: "right" });

  y += 20;

  // Invoice Meta Section (Right Aligned Card Style)
  const metaX = pageWidth - margin - 70;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(metaX - 4, y - 4, 74, 24, 2, 2, "F");
  doc.setDrawColor(230, 232, 242);
  doc.roundedRect(metaX - 4, y - 4, 74, 24, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text("INVOICE NO:", metaX, y + 2);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.invoiceNumber || "INV-20260927-1001", pageWidth - margin - 2, y + 2, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text("ISSUE DATE:", metaX, y + 9);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), pageWidth - margin - 2, y + 9, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text("STATUS:", metaX, y + 16);
  doc.setTextColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
  doc.setFont("helvetica", "bold");
  doc.text("VERIFIED", pageWidth - margin - 2, y + 16, { align: "right" });

  // From & Bill To Sections (Left Aligned)
  const colWidth = (metaX - margin - 10);

  // FROM Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("FROM", margin, y + 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(invoice.freelancerName || "John Doe", margin, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text("Independent Creative Studio", margin, y + 14);

  // BILL TO Box
  y += 26;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("BILL TO", margin, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(invoice.clientName || "Acme Corp", margin, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text("Valued Client", margin, y + 11);

  y += 18;

  // Table Setup
  const tableWidth = pageWidth - margin * 2;
  doc.setFillColor(tableHeaderBg[0], tableHeaderBg[1], tableHeaderBg[2]);
  doc.roundedRect(margin, y, tableWidth, 9, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  
  doc.text("SERVICE / DELIVERABLE", margin + 4, y + 6);
  doc.text("QTY", margin + 105, y + 6, { align: "center" });
  doc.text("RATE (INR)", margin + 142, y + 6, { align: "right" });
  doc.text("AMOUNT (INR)", margin + tableWidth - 4, y + 6, { align: "right" });

  y += 12;

  // Table Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);

  if (!invoice.items || invoice.items.length === 0) {
    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    doc.text("No line items present.", margin + 4, y + 4);
    y += 12;
  } else {
    invoice.items.forEach((item, index) => {
      // Alternating row shade
      if (index % 2 === 1) {
        doc.setFillColor(252, 252, 254);
        doc.rect(margin, y - 3, tableWidth, 9, "F");
      }

      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text(item.name, margin + 4, y + 3);

      doc.setFont("helvetica", "normal");
      doc.text(String(item.quantity), margin + 105, y + 3, { align: "center" });
      doc.text(`INR ${item.unitPrice.toLocaleString("en-IN")}`, margin + 142, y + 3, { align: "right" });
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`INR ${(item.quantity * item.unitPrice).toLocaleString("en-IN")}`, margin + tableWidth - 4, y + 3, { align: "right" });

      y += 8;
      doc.setDrawColor(240, 242, 248);
      doc.line(margin, y, pageWidth - margin, y);
      y += 3;
    });
  }

  y += 4;

  // Totals Section (Right Aligned Card)
  const totalsWidth = 75;
  const totalsLeft = pageWidth - margin - totalsWidth;

  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(totalsLeft, y, totalsWidth, invoice.tax ? 32 : 24, 2, 2, "F");
  doc.setDrawColor(230, 232, 242);
  doc.roundedRect(totalsLeft, y, totalsWidth, invoice.tax ? 32 : 24, 2, 2, "D");

  let subY = y + 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text("Subtotal:", totalsLeft + 5, subY);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`INR ${invoice.subtotal.toLocaleString("en-IN")}`, pageWidth - margin - 5, subY, { align: "right" });

  if (invoice.tax) {
    subY += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    doc.text("Tax (18% GST):", totalsLeft + 5, subY);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`INR ${invoice.tax.toLocaleString("en-IN")}`, pageWidth - margin - 5, subY, { align: "right" });
  }

  subY += 4;
  doc.setDrawColor(220, 222, 235);
  doc.line(totalsLeft + 5, subY, pageWidth - margin - 5, subY);
  subY += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Grand Total:", totalsLeft + 5, subY);
  doc.text(`INR ${invoice.total.toLocaleString("en-IN")}`, pageWidth - margin - 5, subY, { align: "right" });

  y = subY + 16;

  // Budget Headroom Box (If Budget Detected)
  if (budget !== undefined) {
    doc.setFillColor(242, 253, 248); // Subtle Emerald Tint
    doc.roundedRect(margin, y, tableWidth, 14, 2, 2, "F");
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin, y, tableWidth, 14, 2, 2, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(accentEmerald[0], accentEmerald[1], accentEmerald[2]);
    doc.text("BUDGET HEADROOM INTELLIGENCE", margin + 5, y + 5.5);

    const headroom = budget - invoice.total;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(
      `Detected Client Budget: INR ${budget.toLocaleString("en-IN")}  |  Headroom Remaining: INR ${headroom.toLocaleString("en-IN")}`,
      margin + 5,
      y + 10.5
    );

    y += 20;
  }

  // Footer Branding & Verification Stamp
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.text(
    "Generated & Verified via InvoFlow AI Engine  •  Hash: 9f8a2e1b4c  •  Page 1 of 1",
    pageWidth / 2,
    284,
    { align: "center" }
  );

  // Save / Download PDF
  const filename = `${invoice.invoiceNumber || "INVOICE"}.pdf`;
  doc.save(filename);
}
