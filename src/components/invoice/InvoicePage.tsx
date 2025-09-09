"use client";

import type { Invoice, InvoiceItem, ThemeName, AppSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef, useCallback } from "react";

const simpleUuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const initialItem: InvoiceItem = {
  id: simpleUuid(),
  description: "Service Description",
  quantity: 1,
  price: 100,
};

interface InvoicePageProps {
  settings: AppSettings;
  onNewInvoice: () => void;
  onLoadInvoice: (id: string) => void;
  activeInvoice: Invoice | null;
  setActiveInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>;
  history: Invoice[];
  setHistory: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

export default function InvoicePage({ 
    settings,
    onNewInvoice,
    onLoadInvoice,
    activeInvoice,
    setActiveInvoice,
    history,
    setHistory
}: InvoicePageProps) {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const saveInvoice = useCallback(() => {
    if (!activeInvoice) return;
    const isNew = !history.some(h => h.id === activeInvoice.id);
    const newHistory = isNew ? [activeInvoice, ...history] : history.map(h => h.id === activeInvoice.id ? activeInvoice : h);
    
    setHistory(newHistory);
    localStorage.setItem("outvoice-invoices", JSON.stringify(newHistory));
    
    toast({
      title: "Invoice Saved",
      description: `Invoice ${activeInvoice.invoiceNumber} has been saved successfully.`,
    });
  }, [activeInvoice, history, toast, setHistory]);

  const handleSaveAndPrint = () => {
    saveInvoice();
    handlePrint();
  };
  
  if (!activeInvoice) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h2 className="text-2xl font-semibold mb-2">Welcome to OutVoice</h2>
              <p className="text-muted-foreground mb-6">Select an invoice from the history or create a new one to get started.</p>
              <Button onClick={onNewInvoice}><Plus className="mr-2"/> New Invoice</Button>
          </div>
      )
  }

  return (
    <>
      <header className="mb-8 flex items-center justify-between no-print">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
          <p className="text-muted-foreground">Fill in the details to generate your invoice.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={saveInvoice} variant="outline">Save</Button>
          <Button onClick={handleSaveAndPrint} className="bg-accent hover:bg-accent/90">
            <Download className="mr-2 h-4 w-4" />
            Save & Download PDF
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 no-print">
          <InvoiceForm invoice={activeInvoice} setInvoice={setActiveInvoice as React.Dispatch<React.SetStateAction<Invoice>>} />
        </div>
        <div className="lg:col-span-3">
          <div id="invoice-preview-wrapper" className="shadow-lg rounded-lg border bg-card text-card-foreground">
            <div ref={previewRef} id="invoice-preview-container">
                <InvoicePreview invoice={activeInvoice} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
