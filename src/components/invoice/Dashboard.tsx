"use client";

import type { Invoice, InvoiceItem, ThemeName, AppSettings } from "@/types";
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
import { Plus, Settings, FileText } from "lucide-react";
import InvoicePage from "./InvoicePage";
import SettingsPage from "./SettingsPage";
import ThemeSelector from "./ThemeSelector";
import InvoiceHistory from "./InvoiceHistory";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useCallback } from "react";

const simpleUuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const initialItem: InvoiceItem = {
  id: simpleUuid(),
  description: "Service Description",
  quantity: 1,
  price: 100,
};

const initialSettings: AppSettings = {
  fromName: "Your Company",
  fromAddress: "123 Your Street, Your City, 12345",
  gstRate: 5,
  currency: "USD",
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'invoice' | 'settings'>('invoice');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [history, setHistory] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedInvoices = localStorage.getItem("outvoice-invoices");
    if (savedInvoices) {
      const parsedInvoices = JSON.parse(savedInvoices).map((inv: any) => ({
        ...inv,
        date: new Date(inv.date),
        dueDate: new Date(inv.dueDate),
      }));
      setHistory(parsedInvoices);
      if (parsedInvoices.length > 0) {
          setActiveInvoice(parsedInvoices[0]);
      }
    }
    
    const savedSettings = localStorage.getItem("outvoice-settings");
    if(savedSettings) {
        setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const createNewInvoice = () => {
    const newId = simpleUuid();
    const newInvoice: Invoice = {
      id: newId,
      invoiceNumber: `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      fromName: settings.fromName,
      fromAddress: settings.fromAddress,
      clientName: "Client Company",
      clientAddress: "456 Client Avenue, Client City, 54321",
      items: [{...initialItem, id: simpleUuid()}],
      notes: "Thank you for your business. Please make payment within 30 days.",
      gstRate: settings.gstRate,
      theme: "modern",
      currency: settings.currency,
    };
    setActiveInvoice(newInvoice);
    setActiveView('invoice');
    toast({
        title: "New Invoice",
        description: "A new blank invoice has been created.",
    });
  };

  const loadInvoice = (id: string) => {
    const loaded = history.find(h => h.id === id);
    if (loaded) {
      setActiveInvoice(loaded);
      setActiveView('invoice');
      toast({
        title: "Invoice Loaded",
        description: `Invoice ${loaded.invoiceNumber} is now active.`,
      });
    }
  };
  
  const deleteInvoice = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem("outvoice-invoices", JSON.stringify(newHistory));
    
    if(activeInvoice?.id === id) {
        setActiveInvoice(newHistory.length > 0 ? newHistory[0] : null);
    }

    toast({
      title: "Invoice Deleted",
      description: "The invoice has been removed from history.",
      variant: "destructive"
    });
  };

  const updateInvoiceTheme = (theme: ThemeName) => {
    if (activeInvoice) {
        setActiveInvoice(prev => prev ? {...prev, theme} : null);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="no-print">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
                <FileText className="text-primary"/>
                <h1 className="text-xl font-semibold">OutVoice</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex flex-col">
            <SidebarGroup>
              <Button className="w-full justify-start" onClick={createNewInvoice}><Plus className="mr-2"/> New Invoice</Button>
              <Button className="w-full justify-start mt-2" variant="ghost" onClick={() => setActiveView('settings')}><Settings className="mr-2"/> Settings</Button>
            </SidebarGroup>
            
            <div className="mt-auto flex flex-col">
                <SidebarGroup>
                  <SidebarGroupLabel>Themes</SidebarGroupLabel>
                  <ThemeSelector
                    currentTheme={activeInvoice?.theme || 'modern'}
                    onThemeChange={updateInvoiceTheme}
                  />
                </SidebarGroup>
                <SidebarGroup className="flex-grow flex flex-col">
                  <SidebarGroupLabel>History</SidebarGroupLabel>
                  <InvoiceHistory 
                    invoices={history} 
                    onLoad={loadInvoice} 
                    onDelete={deleteInvoice} 
                    activeId={activeInvoice?.id || ''}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </SidebarGroup>
            </div>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <header className="mb-8 flex items-center justify-between no-print md:hidden">
              <SidebarTrigger />
            </header>
            
            {activeView === 'invoice' && (
              <InvoicePage
                settings={settings}
                onNewInvoice={createNewInvoice}
                onLoadInvoice={loadInvoice}
                activeInvoice={activeInvoice}
                setActiveInvoice={setActiveInvoice}
                history={history}
                setHistory={setHistory}
              />
            )}
            {activeView === 'settings' && (
                <SettingsPage settings={settings} setSettings={setSettings} />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
