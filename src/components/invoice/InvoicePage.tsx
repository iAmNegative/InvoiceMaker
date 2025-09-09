"use client";

import type { Invoice, InvoiceItem, ThemeName } from "@/types";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Plus, Building2 } from "lucide-react";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import ThemeSelector from "./ThemeSelector";
import InvoiceHistory from "./InvoiceHistory";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef, useCallback } from "react";
// Note: uuid is not in package.json. We will use a simple unique id generator.
const simpleUuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);


const initialItem: InvoiceItem = {
  id: simpleUuid(),
  description: "Architectural Design & Planning",
  quantity: 10,
  price: 150,
};

const initialInvoice: Invoice = {
  id: simpleUuid(),
  invoiceNumber: "",
  date: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  fromName: "Your Company",
  fromAddress: "123 Your Street, Your City, 12345",
  clientName: "Client Company",
  clientAddress: "456 Client Avenue, Client City, 54321",
  items: [initialItem],
  notes: "Thank you for your business. Please make payment within 30 days.",
  gstRate: 5,
  theme: "modern",
  currency: "USD",
};

export default function InvoicePage() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [history, setHistory] = useState<Invoice[]>([]);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedInvoices = localStorage.getItem("archi-invoices");
    if (savedInvoices) {
      setHistory(
        JSON.parse(savedInvoices).map((inv: any) => ({
          ...inv,
          date: new Date(inv.date),
          dueDate: new Date(inv.dueDate),
        }))
      );
    }
    setInvoice(prev => ({
        ...prev,
        invoiceNumber: `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    }));
  }, []);

  const updateInvoice = (updatedFields: Partial<Invoice>) => {
    setInvoice((prev) => ({ ...prev, ...updatedFields }));
  };

  const handlePrint = () => {
    window.print();
  };

  const saveInvoice = useCallback(() => {
    const isNew = !history.some(h => h.id === invoice.id);
    const newHistory = isNew ? [invoice, ...history] : history.map(h => h.id === invoice.id ? invoice : h);
    
    setHistory(newHistory);
    localStorage.setItem("archi-invoices", JSON.stringify(newHistory));
    
    toast({
      title: "Invoice Saved",
      description: `Invoice ${invoice.invoiceNumber} has been saved successfully.`,
    });
  }, [invoice, history, toast]);

  const handleSaveAndPrint = () => {
    saveInvoice();
    handlePrint();
  };
  
  const loadInvoice = (id: string) => {
    const loaded = history.find(h => h.id === id);
    if (loaded) {
      setInvoice(loaded);
      toast({
        title: "Invoice Loaded",
        description: `Invoice ${loaded.invoiceNumber} is now active.`,
      });
    }
  };
  
  const createNewInvoice = () => {
    const newId = simpleUuid();
    setInvoice({
        ...initialInvoice,
        id: newId,
        items: [{...initialItem, id: simpleUuid()}],
        invoiceNumber: `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    });
    toast({
        title: "New Invoice",
        description: "A new blank invoice has been created.",
      });
  };

  const deleteInvoice = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem("archi-invoices", JSON.stringify(newHistory));
    if(invoice.id === id) {
        createNewInvoice();
    }
    toast({
      title: "Invoice Deleted",
      description: "The invoice has been removed from history.",
      variant: "destructive"
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="no-print">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
                <Building2 className="text-primary"/>
                <h1 className="text-xl font-semibold">ArchiInvoice</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <Button className="w-full" onClick={createNewInvoice}><Plus className="mr-2"/> New Invoice</Button>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Themes</SidebarGroupLabel>
              <ThemeSelector
                currentTheme={invoice.theme}
                onThemeChange={(theme) => updateInvoice({ theme })}
              />
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>History</SidebarGroupLabel>
              <InvoiceHistory invoices={history} onLoad={loadInvoice} onDelete={deleteInvoice} activeId={invoice.id} />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8 flex items-center justify-between no-print">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Invoice Generator</h1>
                <p className="text-muted-foreground">Fill in the details to generate your invoice.</p>
              </div>
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <Button onClick={saveInvoice} variant="outline">Save</Button>
                <Button onClick={handleSaveAndPrint} className="bg-accent hover:bg-accent/90">
                  <Download className="mr-2 h-4 w-4" />
                  Save & Download PDF
                </Button>
              </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 no-print">
                <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
              </div>
              <div className="lg:col-span-3">
                <Card id="invoice-preview-wrapper" className="shadow-lg">
                  <CardHeader className="no-print">
                    <CardTitle>Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div ref={previewRef} id="invoice-preview-container">
                       <InvoicePreview invoice={invoice} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
