"use client";

import { useState } from "react";
import { Invoice, ConversationExtraction, InvoiceChange } from "@/lib/types";
import { applyConversationToInvoice } from "@/lib/invoiceState";
import { calculateLineTotal } from "@/lib/invoice";
import { generateInvoicePDF } from "@/lib/pdf";
import { LandingPageView } from "@/components/LandingPageView";

export default function Home() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing");
  const [platform, setPlatform] = useState<"whatsapp" | "email" | "slack">("whatsapp");
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Dynamic Conversation Turns State
  const [messages, setMessages] = useState<Array<{ id: string; turn: number; text: string }>>([]);
  const [extractionHistory, setExtractionHistory] = useState<ConversationExtraction | null>(null);
  const [ledgerChanges, setLedgerChanges] = useState<InvoiceChange[]>([]);
  const [detectedBudget, setDetectedBudget] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Full Invoice State managed by applyConversationToInvoice
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    invoiceNumber: "INV-20260927-1001",
    freelancerName: "John Doe",
    clientName: "Acme Corp",
    items: [],
    subtotal: 0,
    total: 0,
    currency: "INR",
  });

  const clientBudget = detectedBudget ?? 10000;
  const subtotal = currentInvoice.subtotal;
  const total = currentInvoice.total;
  const headroom = clientBudget - total;

  const handleQtyChange = (id: string, newQty: number) => {
    setCurrentInvoice((prev) => {
      let updatedItems;
      if (newQty < 1) {
        // Remove item from invoice if quantity falls below 1
        updatedItems = prev.items.filter((item) => item.id !== id);
      } else {
        updatedItems = prev.items.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: newQty,
                total: calculateLineTotal(item.unitPrice, newQty),
              }
            : item
        );
      }
      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      return {
        ...prev,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newSubtotal,
      };
    });
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    if (newPrice < 0) return;
    setCurrentInvoice((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id === id
          ? {
              ...item,
              unitPrice: newPrice,
              total: calculateLineTotal(newPrice, item.quantity),
            }
          : item
      );
      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      return {
        ...prev,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newSubtotal,
      };
    });
  };

  const handleGenerateInvoice = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMsg = inputText.trim();
    setInputText("");
    setErrorMessage(null);
    setIsProcessing(true);

    const newTurn = messages.length + 1;
    const newMsgObj = { id: `turn-${Date.now()}`, turn: newTurn, text: userMsg };
    setMessages((prev) => [...prev, newMsgObj]);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Failed to extract invoice items" }));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }

      const extraction: ConversationExtraction = await res.json();
      setExtractionHistory(extraction);

      if (extraction.budget) {
        setDetectedBudget(extraction.budget);
      }

      // Apply changes statefully onto current invoice
      const result = applyConversationToInvoice(currentInvoice, extraction);
      setCurrentInvoice(result.invoice);

      // Append new ledger changes with turn tag
      const taggedChanges = result.changes.map((c) => ({
        ...c,
        reason: `${c.reason || c.itemName} (Turn #${newTurn})`,
      }));
      setLedgerChanges((prev) => [...prev, ...taggedChanges]);

    } catch (err: any) {
      console.error("API Extraction Error:", err);
      setErrorMessage(err.message || "An unexpected error occurred while parsing message.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSampleClick = (sampleText: string) => {
    setInputText(sampleText);
  };

  // -------------------------------------------------------------
  // LANDING PAGE VIEW
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // LANDING PAGE VIEW (White + Obsidian Black Premium Animated SaaS Experience)
  // -------------------------------------------------------------
  if (viewMode === "landing") {
    return <LandingPageView onOpenWorkspace={() => setViewMode("app")} />;
  }

  // -------------------------------------------------------------
  // MAIN INVOICE APPLICATION WORKSPACE VIEW (White + Obsidian Black Theme)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFFFFF] selection:text-[#0B0B0D]">
      {/* Top Navbar Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0B0B0D]/90 backdrop-blur-md z-50 border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode("landing")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="h-9 w-9 rounded-lg bg-white text-[#0B0B0D] flex items-center justify-center font-black text-sm shadow-md">
                IF
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                InvoFlow
              </span>
            </button>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-[#E7E7E5] border border-white/15 tracking-wide">
              AI Workspace
            </span>
          </div>

          {/* Quick Actions / Status Right */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("landing")}
              className="text-xs text-[#A0A0A0] hover:text-white transition-colors font-medium hidden sm:inline"
            >
              ← Back to Home
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#E7E7E5]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Ready for Client Messages</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 pt-20 pb-12 min-h-screen flex flex-col">
        
        {/* Simple Friendly Hero Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 w-full">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Conversational Invoicing
            </h1>
            <p className="text-xs sm:text-sm text-[#A0A0A0]">
              Paste WhatsApp messages or type client requests below. InvoFlow auto-calculates rates, updates quantities, and builds your invoice.
            </p>
          </div>
        </div>

        {/* 12-Column Split Workspace */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: CONVERSATION & INPUT (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              <div className="rounded-2xl bg-[#111113] border border-white/10 p-5 shadow-lg flex flex-col gap-4">
                
                {/* Section Header & Platform Switcher */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h2 className="font-heading text-sm font-bold text-white">
                      Client Conversation
                    </h2>
                  </div>

                  <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPlatform("whatsapp")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        platform === "whatsapp"
                          ? "bg-white text-[#0B0B0D] shadow-xs"
                          : "text-[#A0A0A0] hover:text-white"
                      }`}
                    >
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlatform("email")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        platform === "email"
                          ? "bg-white text-[#0B0B0D] shadow-xs"
                          : "text-[#A0A0A0] hover:text-white"
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlatform("slack")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        platform === "slack"
                          ? "bg-white text-[#0B0B0D] shadow-xs"
                          : "text-[#A0A0A0] hover:text-white"
                      }`}
                    >
                      Slack
                    </button>
                  </div>
                </div>

                {/* Conversation Turns Stream */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] font-bold">
                    Message History
                  </span>

                  {messages.length === 0 ? (
                    <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 flex flex-col gap-2">
                      <p className="text-xs text-[#A0A0A0] text-center">
                        No messages yet. Try pasting a client message below!
                      </p>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-[10px] uppercase tracking-wider text-white font-bold text-center">
                          Quick Examples:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSampleClick("I need 3 Instagram posts and a logo design for my new brand.")}
                          className="text-left text-xs p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#E7E7E5] transition-all border border-white/10 font-mono"
                        >
                          &ldquo;I need 3 Instagram posts and a logo design for my new brand.&rdquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSampleClick("Actually make the Instagram posts 5 instead.")}
                          className="text-left text-xs p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#E7E7E5] transition-all border border-white/10 font-mono"
                        >
                          &ldquo;Actually make the Instagram posts 5 instead.&rdquo;
                        </button>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Client Turn #{msg.turn}
                          </span>
                        </div>
                        <p className="text-xs text-[#E7E7E5] leading-relaxed font-mono">
                          &ldquo;{msg.text}&rdquo;
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Friendly Summary & Changes */}
                {(extractionHistory || ledgerChanges.length > 0) && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                      Detected Ledger Updates
                    </span>
                    <div className="flex flex-col gap-1 text-xs">
                      {ledgerChanges.map((change, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono">
                          <span>•</span>
                          <span>{change.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Input Area */}
                <div className="flex flex-col gap-3 pt-1">
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerateInvoice();
                      }
                    }}
                    placeholder="Type or paste what your client requested..."
                    className="w-full rounded-xl bg-black/50 border border-white/15 p-3.5 text-xs sm:text-sm text-white placeholder-[#A0A0A0]/60 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all resize-none leading-relaxed"
                  />

                  <button
                    type="button"
                    onClick={handleGenerateInvoice}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-[#F7F7F5] active:bg-[#E7E7E5] text-[#0B0B0D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0B0B0D]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Invoice...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-[#0B0B0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate / Update Invoice
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: LIVE INVOICE ARTIFACT (7 Cols) - CRISP PURE WHITE PHYSICAL DOCUMENT */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              <div className="relative rounded-2xl bg-[#FFFFFF] text-[#0B0B0D] border border-[#0B0B0D]/10 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#0B0B0D]/10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#0B0B0D] flex items-center justify-center text-white font-black text-sm shadow-md">
                        IF
                      </div>
                      <div>
                        <span className="font-heading text-lg font-bold text-[#0B0B0D] tracking-tight">
                          InvoFlow
                        </span>
                        <span className="text-xs text-[#6B6B6B] block">Freelancer Invoice</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#6B6B6B] pt-1 flex flex-col gap-0.5">
                      <span className="text-[#0B0B0D] font-bold">{currentInvoice.freelancerName}</span>
                      <span>Independent Creative Studio</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5">
                    <span className="font-heading text-2xl font-black tracking-tight text-[#0B0B0D]">
                      INVOICE
                    </span>
                    <div className="flex flex-col sm:items-end text-xs gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B6B6B]">Invoice No:</span>
                        <span className="text-[#0B0B0D] font-bold">{currentInvoice.invoiceNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B6B6B]">Issue Date:</span>
                        <span className="text-[#0B0B0D]">27 Sep 2026</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Details (Customizable From & Bill To) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F7F7F5] border border-[#0B0B0D]/10">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B0B0D] flex items-center gap-1">
                      <svg className="w-3 h-3 text-[#0B0B0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      From (Your Studio / Name):
                    </label>
                    <input
                      type="text"
                      value={currentInvoice.freelancerName}
                      onChange={(e) => setCurrentInvoice((prev) => ({ ...prev, freelancerName: e.target.value }))}
                      placeholder="e.g. John Doe / Studio"
                      className="w-full bg-[#FFFFFF] border border-[#0B0B0D]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#0B0B0D] font-bold focus:outline-none focus:border-[#0B0B0D] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B0B0D] flex items-center gap-1">
                      <svg className="w-3 h-3 text-[#0B0B0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Bill To (Client Name):
                    </label>
                    <input
                      type="text"
                      value={currentInvoice.clientName}
                      onChange={(e) => setCurrentInvoice((prev) => ({ ...prev, clientName: e.target.value }))}
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-[#FFFFFF] border border-[#0B0B0D]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#0B0B0D] font-bold focus:outline-none focus:border-[#0B0B0D] transition-colors"
                    />
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="flex flex-col overflow-x-auto rounded-xl border border-[#0B0B0D]/10 bg-[#FFFFFF] overflow-hidden">
                  <div className="grid grid-cols-12 gap-3 py-3 px-4 text-[#6B6B6B] text-[11px] font-extrabold uppercase tracking-wider bg-[#F7F7F5] border-b border-[#0B0B0D]/10 min-w-[500px]">
                    <div className="col-span-6">SERVICE / DELIVERABLE</div>
                    <div className="col-span-2 text-center">QTY</div>
                    <div className="col-span-2 text-right">RATE</div>
                    <div className="col-span-2 text-right">AMOUNT</div>
                  </div>

                  <div className="flex flex-col divide-y divide-[#0B0B0D]/10 min-w-[500px]">
                    {currentInvoice.items.length === 0 ? (
                      <div className="py-14 text-center text-xs text-[#6B6B6B] flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#F7F7F5] border border-[#0B0B0D]/10 flex items-center justify-center text-[#0B0B0D] mb-1">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="font-bold text-[#0B0B0D]">Your invoice is empty</span>
                        <span>Type a client request on the left to add items automatically.</span>
                      </div>
                    ) : (
                      currentInvoice.items.map((row) => (
                        <div key={row.id} className="grid grid-cols-12 gap-3 py-3.5 px-4 items-center hover:bg-[#F7F7F5] transition-colors">
                          <div className="col-span-6 flex flex-col gap-0.5">
                            <span className="text-xs sm:text-sm font-bold text-[#0B0B0D]">{row.name}</span>
                            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0B0B0D]"></span>
                              Custom item ({row.unit})
                            </span>
                          </div>

                          <div className="col-span-2 flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(row.id, row.quantity - 1)}
                              className="w-5 h-5 rounded-md bg-[#F7F7F5] hover:bg-[#E7E7E5] active:bg-[#D7D7D5] border border-[#0B0B0D]/15 flex items-center justify-center text-[#0B0B0D] text-xs font-bold transition-all cursor-pointer"
                              title="Decrease Qty"
                            >
                              -
                            </button>
                            <span className="text-xs sm:text-sm font-mono font-extrabold text-[#0B0B0D] px-1 w-6 text-center">
                              {row.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(row.id, row.quantity + 1)}
                              className="w-5 h-5 rounded-md bg-[#F7F7F5] hover:bg-[#E7E7E5] active:bg-[#D7D7D5] border border-[#0B0B0D]/15 flex items-center justify-center text-[#0B0B0D] text-xs font-bold transition-all cursor-pointer"
                              title="Increase Qty"
                            >
                              +
                            </button>
                          </div>

                          <div className="col-span-2 text-right">
                            <div className="flex items-center justify-end text-xs sm:text-sm text-[#6B6B6B] font-mono">
                              <span>₹</span>
                              <input
                                type="number"
                                value={row.unitPrice}
                                onChange={(e) => handlePriceChange(row.id, parseInt(e.target.value) || 0)}
                                className="w-16 bg-[#F7F7F5] text-right text-[#0B0B0D] font-bold border-b border-dashed border-[#0B0B0D]/30 focus:outline-none focus:border-[#0B0B0D] p-0.5 rounded-t-sm"
                              />
                            </div>
                          </div>

                          <div className="col-span-2 text-right text-xs sm:text-sm font-mono font-extrabold text-[#0B0B0D]">
                            ₹{(row.quantity * row.unitPrice).toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Totals Section */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#0B0B0D]/10">
                  <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Click quantity buttons or edit rate values to tweak live amounts.</span>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-[#F7F7F5] border border-[#0B0B0D]/10 min-w-[220px]">
                    <div className="flex items-center justify-between text-xs text-[#6B6B6B] font-mono">
                      <span>Subtotal</span>
                      <span className="text-[#0B0B0D] font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="w-full h-px bg-[#0B0B0D]/10"></div>
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-heading text-sm font-bold text-[#0B0B0D]">Grand Total</span>
                      <span className="font-heading text-xl sm:text-2xl font-black text-[#0B0B0D] tracking-tight">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Budget Headroom Indicator */}
                {detectedBudget && (
                  <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-emerald-500/30 flex items-center justify-between text-xs">
                    <span className="text-[#6B6B6B]">
                      Client Budget: <strong className="text-[#0B0B0D]">₹{clientBudget.toLocaleString("en-IN")}</strong>
                    </span>
                    <span className="text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      +₹{headroom.toLocaleString("en-IN")} headroom remaining
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => generateInvoicePDF(currentInvoice, detectedBudget ?? undefined)}
                  disabled={currentInvoice.items.length === 0}
                  className="w-full py-4 px-4 rounded-xl bg-[#0B0B0D] hover:bg-[#1c1b1d] active:bg-[#000000] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Approve & Download PDF
                </button>

              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
