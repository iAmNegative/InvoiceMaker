
"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn, formatCurrency } from "@/lib/utils";
import { templates } from "@/lib/themes";
import { format } from "date-fns";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Settings, FileText, Trash2, Search, Download, Save, PlusCircle, Calendar as CalendarIcon, CheckCircle, Edit, Eye } from "lucide-react";


// --- TYPE DEFINITIONS ---
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

type TemplateName = 'classic' | 'modern' | 'minimal' | 'bold' | 'elegant';

interface Invoice {
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
  template: TemplateName;
  currency: string;
}

interface AppSettings {
    fromName: string;
    fromAddress: string;
    gstRate: number;
    currency: string;
}

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"];

// --- HELPER FUNCTIONS ---
const simpleUuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// --- FORM AND PREVIEW COMPONENTS ---

const InvoiceForm = ({ invoice, setInvoice }: { invoice: Invoice, setInvoice: React.Dispatch<React.SetStateAction<Invoice>> }) => {
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice((prev) => ({ ...prev, items: prev.items.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const addItem = () => {
    setInvoice((prev) => ({ ...prev, items: [...prev.items, { id: simpleUuid(), description: "", quantity: 1, price: 0 }] }));
  };

  const removeItem = (id: string) => {
    setInvoice((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  };

  const handleFieldChange = (field: keyof Invoice, value: string | number | Date) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input id="invoiceNumber" value={invoice.invoiceNumber} onChange={(e) => handleFieldChange("invoiceNumber", e.target.value)}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstRate">GST Rate (%)</Label>
                <Input id="gstRate" type="number" value={invoice.gstRate} onChange={(e) => handleFieldChange("gstRate", parseFloat(e.target.value) || 0)}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={invoice.currency} onValueChange={(value) => handleFieldChange("currency", value)}>
                  <SelectTrigger id="currency"><SelectValue placeholder="Select currency" /></SelectTrigger>
                  <SelectContent>{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !invoice.date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {invoice.date ? format(invoice.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={invoice.date} onSelect={(date) => handleFieldChange("date", date || new Date())} initialFocus/></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !invoice.dueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {invoice.dueDate ? format(invoice.dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={invoice.dueDate} onSelect={(date) => handleFieldChange("dueDate", date || new Date())} initialFocus/></PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>From</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">Your Name/Company</Label>
              <Input id="fromName" value={invoice.fromName} onChange={(e) => handleFieldChange("fromName", e.target.value)} placeholder="e.g. ArchiDesigns LLC"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromAddress">Your Address</Label>
              <Textarea id="fromAddress" value={invoice.fromAddress} onChange={(e) => handleFieldChange("fromAddress", e.target.value)} placeholder="e.g. 123 Studio Lane, Design City, 12345"/>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>To</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client's Name/Company</Label>
              <Input id="clientName" value={invoice.clientName} onChange={(e) => handleFieldChange("clientName", e.target.value)} placeholder="e.g. Future Homes Inc."/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Client's Address</Label>
              <Textarea id="clientAddress" value={invoice.clientAddress} onChange={(e) => handleFieldChange("clientAddress", e.target.value)} placeholder="e.g. 456 Foundation Street, Buildsville, 54321"/>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="flex flex-wrap sm:flex-nowrap items-end gap-2">
              <div className="flex-grow w-full space-y-2">
                <Label htmlFor={`item-desc-${index}`} className="sr-only">Description</Label>
                <Input id={`item-desc-${index}`} placeholder="Item description" value={item.description} onChange={(e) => handleItemChange(item.id, "description", e.target.value)}/>
              </div>
              <div className="space-y-2 w-20 flex-shrink-0">
                <Label htmlFor={`item-qty-${index}`} className="sr-only">Qty</Label>
                <Input id={`item-qty-${index}`} type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)}/>
              </div>
              <div className="space-y-2 w-28 flex-shrink-0">
                <Label htmlFor={`item-price-${index}`} className="sr-only">Price</Label>
                <Input id={`item-price-${index}`} type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(item.id, "price", parseFloat(e.target.value) || 0)}/>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" onClick={addItem}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
        <CardContent><Textarea value={invoice.notes} onChange={(e) => handleFieldChange("notes", e.target.value)} placeholder="Terms and conditions, payment details, etc."/></CardContent>
      </Card>
    </div>
  );
}
InvoiceForm.displayName = 'InvoiceForm';

const InvoicePreview = React.forwardRef<HTMLDivElement, { invoice: Invoice }>(({ invoice }, ref) => {
  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const gstAmount = subtotal * (invoice.gstRate / 100);
  const total = subtotal + gstAmount;
  const template = templates[invoice.template] || templates.modern;
  const renderCurrency = (amount: number) => formatCurrency(amount, invoice.currency);

  return (
    <div id="invoice-preview-wrapper" className="shadow-lg rounded-lg border bg-card text-card-foreground">
        <div ref={ref} id="invoice-preview-container" className={cn("p-10 rounded-lg h-full w-full", template.styles.container, template.font)}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@400;500;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;700&family=Playfair+Display:wght@400;700&display=swap');
            `}</style>
          <div className={template.styles.header}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold uppercase">Invoice</h1>
                <p className="font-bold text-lg mt-2">{invoice.fromName}</p>
              </div>
              <div className="text-left sm:text-right text-sm">
                <p className="font-semibold">{invoice.invoiceNumber}</p>
                <p>Date: {format(invoice.date, "MMM dd, yyyy")}</p>
                <p>Due: {format(invoice.dueDate, "MMM dd, yyyy")}</p>
              </div>
            </div>
          </div>
          <div className={cn("grid grid-cols-2 gap-8 my-8 text-sm", template.styles.fromTo)}>
            <div>
              <h3 className="font-semibold mb-2 uppercase tracking-wider text-xs">From:</h3>
              <p className="font-semibold">{invoice.fromName}</p>
              <p className="whitespace-pre-line">{invoice.fromAddress}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-2 uppercase tracking-wider text-xs">To:</h3>
              <p className="font-semibold">{invoice.clientName}</p>
              <p className="whitespace-pre-line">{invoice.clientAddress}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className={template.styles.tableHeader}><th className="p-3">Description</th><th className="p-3 text-center">Qty</th><th className="p-3 text-right">Unit Price</th><th className="p-3 text-right">Total</th></tr></thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className={template.styles.tableRow}>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">{renderCurrency(item.price)}</td>
                    <td className="p-3 text-right">{renderCurrency(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={cn("flex justify-end mt-8", template.styles.totals)}>
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{renderCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>GST ({invoice.gstRate}%)</span><span>{renderCurrency(gstAmount)}</span></div>
              <div className={cn("flex justify-between font-bold text-lg border-t pt-2", template.styles.totalRow)}><span>Total</span><span>{renderCurrency(total)}</span></div>
            </div>
          </div>
          {invoice.notes && (
            <div className="mt-8 text-sm">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
          <footer className={cn("text-xs text-center mt-8 pt-4", template.styles.footer)}><p>Thank you for choosing {invoice.fromName}.</p></footer>
        </div>
    </div>
  );
});
InvoicePreview.displayName = 'InvoicePreview';

// --- SUB-COMPONENTS ---
const TemplateSelector = ({ currentTemplate, onTemplateChange }: { currentTemplate: TemplateName, onTemplateChange: (template: TemplateName) => void }) => (
    <div className="grid grid-cols-1 gap-2">
      {(Object.keys(templates) as TemplateName[]).map((templateKey) => (
        <Card
          key={templateKey}
          onClick={() => onTemplateChange(templateKey)}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md relative bg-sidebar-accent border-sidebar-border",
            currentTemplate === templateKey ? "ring-2 ring-sidebar-primary" : ""
          )}
        >
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className={cn("w-5 h-8 rounded", templates[templateKey].preview.background)}></div>
                <div className={cn("w-5 h-8 rounded", templates[templateKey].preview.primary)}></div>
                <div className={cn("w-5 h-8 rounded", templates[templateKey].preview.secondary)}></div>
              </div>
              <span className="text-sm font-medium text-sidebar-accent-foreground">{templates[templateKey].name}</span>
            </div>
            {currentTemplate === templateKey && <CheckCircle className="w-5 h-5 text-sidebar-primary" />}
          </CardContent>
        </Card>
      ))}
    </div>
);
TemplateSelector.displayName = 'TemplateSelector';

const InvoiceHistory = ({ invoices, onLoad, onDelete, activeId, searchTerm, setSearchTerm }: { invoices: Invoice[], onLoad: (id: string) => void, onDelete: (id: string) => void, activeId: string, searchTerm: string, setSearchTerm: (term: string) => void }) => {
    const filteredInvoices = invoices.filter(invoice => 
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="flex flex-col h-full">
        <div className="relative p-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by client..." className="pl-8 bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <ScrollArea className="flex-grow">
          {filteredInvoices.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground p-4">
              {invoices.length > 0 ? 'No matching invoices.' : 'No saved invoices.'}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className={cn("group flex items-center justify-between p-2 rounded-md text-sm", activeId === invoice.id ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50")}>
                  <button onClick={() => onLoad(invoice.id)} className="flex-grow text-left flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 shrink-0" />
                    <div className="truncate">
                      <p className="font-medium truncate">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground truncate">{invoice.clientName}</p>
                    </div>
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the invoice <span className="font-semibold">{invoice.invoiceNumber}</span>. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(invoice.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
}
InvoiceHistory.displayName = 'InvoiceHistory';

const SettingsPage = ({ settings, setSettings }: { settings: AppSettings, setSettings: React.Dispatch<React.SetStateAction<AppSettings>> }) => {
    const { toast } = useToast();
    const handleFieldChange = (field: keyof AppSettings, value: string | number) => {
      setSettings((prev) => ({ ...prev, [field]: value }));
    };
    
    const handleSave = () => {
        localStorage.setItem("outvoice-settings", JSON.stringify(settings));
        toast({
            title: "Settings Saved",
            description: "Your default settings have been updated.",
        });
    }

    return (
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your default invoice information.</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Default Invoice Details</CardTitle>
            <CardDescription>This information will be pre-filled on new invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fromName">Your Name/Company</Label>
              <Input id="fromName" value={settings.fromName} onChange={(e) => handleFieldChange("fromName", e.target.value)} placeholder="e.g. Acme Inc."/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromAddress">Your Address</Label>
              <Textarea id="fromAddress" value={settings.fromAddress} onChange={(e) => handleFieldChange("fromAddress", e.target.value)} placeholder="e.g. 123 Main St, Anytown, USA 12345"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstRate">Default GST Rate (%)</Label>
                <Input id="gstRate" type="number" value={settings.gstRate} onChange={(e) => handleFieldChange("gstRate", parseFloat(e.target.value) || 0)}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleFieldChange("currency", value)}>
                  <SelectTrigger id="currency"><SelectValue placeholder="Select currency" /></SelectTrigger>
                  <SelectContent>{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    );
}
SettingsPage.displayName = 'SettingsPage';
  
const InvoicePage = ({ activeInvoice, setActiveInvoice, saveInvoice, handleSaveAndPrint, createNewInvoice, previewRef }: { 
    activeInvoice: Invoice | null;
    setActiveInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>;
    saveInvoice: () => void;
    handleSaveAndPrint: () => void;
    createNewInvoice: () => void;
    previewRef: React.RefObject<HTMLDivElement>;
}) => {
    if (!activeInvoice) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome to OutVoice</h2>
          <p className="text-muted-foreground mb-6">Select an invoice from the history or create a new one to get started.</p>
          <Button onClick={createNewInvoice}><Plus className="mr-2"/> New Invoice</Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <header className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 no-print flex-shrink-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Fill in the details to generate your invoice.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={saveInvoice} variant="outline" className="shadow-sm"><Save className="mr-2 h-4 w-4" />Save</Button>
            <Button onClick={handleSaveAndPrint} className="shadow-sm font-semibold"><Download className="mr-2 h-4 w-4" />Save & Download</Button>
          </div>
        </header>

        {/* Desktop View: Side-by-side */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-8 flex-grow min-h-0">
            <ScrollArea className="lg:col-span-2 no-print pr-2 -mr-2">
                <InvoiceForm invoice={activeInvoice} setInvoice={setActiveInvoice as React.Dispatch<React.SetStateAction<Invoice>>} />
            </ScrollArea>
            <div className="lg:col-span-3">
                <ScrollArea className="h-full">
                    <div className="light">
                        <InvoicePreview invoice={activeInvoice} ref={previewRef} />
                    </div>
                </ScrollArea>
            </div>
        </div>

        {/* Mobile View: Tabs */}
        <div className="lg:hidden flex flex-col flex-grow min-h-0">
            <Tabs defaultValue="edit" className="flex flex-col flex-grow min-h-0">
                <TabsList className="grid w-full grid-cols-2 no-print">
                    <TabsTrigger value="edit"><Edit className="mr-2"/> Edit</TabsTrigger>
                    <TabsTrigger value="preview"><Eye className="mr-2"/> Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="flex-grow min-h-0">
                    <ScrollArea className="h-full">
                        <div className="pt-4">
                            <InvoiceForm invoice={activeInvoice} setInvoice={setActiveInvoice as React.Dispatch<React.SetStateAction<Invoice>>} />
                        </div>
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="preview" className="flex-grow min-h-0">
                     <ScrollArea className="h-full">
                        <div id="invoice-preview-wrapper-mobile" className="light mt-4">
                            <InvoicePreview invoice={activeInvoice} ref={previewRef} />
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    );
}
InvoicePage.displayName = 'InvoicePage';

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const [activeView, setActiveView] = useState<'invoice' | 'settings'>('invoice');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [history, setHistory] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ fromName: "Your Company", fromAddress: "123 Your Street, Your City, 12345", gstRate: 5, currency: "USD" });
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem("outvoice-invoices");
      if (savedInvoices) {
        const parsedInvoices = JSON.parse(savedInvoices).map((inv: any) => ({ ...inv, date: new Date(inv.date), dueDate: new Date(inv.dueDate) }));
        setHistory(parsedInvoices);
        if (parsedInvoices.length > 0) setActiveInvoice(parsedInvoices[0]);
      }
      
      const savedSettings = localStorage.getItem("outvoice-settings");
      if(savedSettings) setSettings(JSON.parse(savedSettings));

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  const createNewInvoice = () => {
    const newInvoice: Invoice = {
      id: simpleUuid(),
      invoiceNumber: `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      fromName: settings.fromName,
      fromAddress: settings.fromAddress,
      clientName: "Client Company",
      clientAddress: "456 Client Avenue, Client City, 54321",
      items: [{ id: simpleUuid(), description: "Service Description", quantity: 1, price: 100 }],
      notes: "Thank you for your business. Please make payment within 30 days.",
      gstRate: settings.gstRate,
      template: "modern",
      currency: settings.currency,
    };
    setActiveInvoice(newInvoice);
    setActiveView('invoice');
    toast({ title: "New Invoice", description: "A new blank invoice has been created." });
  };

  const loadInvoice = (id: string) => {
    const loaded = history.find(h => h.id === id);
    if (loaded) {
      setActiveInvoice(loaded);
      setActiveView('invoice');
      toast({ title: "Invoice Loaded", description: `Invoice ${loaded.invoiceNumber} is now active.` });
    }
  };
  
  const deleteInvoice = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem("outvoice-invoices", JSON.stringify(newHistory));
    if(activeInvoice?.id === id) setActiveInvoice(newHistory.length > 0 ? newHistory[0] : null);
    toast({ title: "Invoice Deleted", description: "The invoice has been removed from history.", variant: "destructive" });
  };

  const updateInvoiceTemplate = (template: TemplateName) => {
    if (activeInvoice) setActiveInvoice(prev => prev ? {...prev, template} : null);
  };
  
  const saveInvoice = useCallback(() => {
    if (!activeInvoice) return;
    const isNew = !history.some(h => h.id === activeInvoice.id);
    const newHistory = isNew ? [activeInvoice, ...history] : history.map(h => h.id === activeInvoice.id ? activeInvoice : h);
    
    setHistory(newHistory);
    localStorage.setItem("outvoice-invoices", JSON.stringify(newHistory));
    
    toast({ title: "Invoice Saved", description: `Invoice ${activeInvoice.invoiceNumber} has been saved successfully.` });
  }, [activeInvoice, history, toast]);

  const handlePrint = () => {
    const printContainer = document.createElement('div');
    printContainer.classList.add('print-only');
    const previewNode = previewRef.current;
    if (previewNode) {
        const clonedNode = previewNode.cloneNode(true);
        printContainer.appendChild(clonedNode);
        document.body.appendChild(printContainer);
        window.print();
        document.body.removeChild(printContainer);
    }
  };

  const handleSaveAndPrint = () => {
    saveInvoice();
    setTimeout(handlePrint, 100);
  };

  return (
    <div className="light">
      <SidebarProvider>
        <div className="flex min-h-screen invoice-page-wrapper">
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
              <div className="mt-auto flex flex-col min-h-0">
                <SidebarGroup>
                  <SidebarGroupLabel>Templates</SidebarGroupLabel>
                  <TemplateSelector currentTemplate={activeInvoice?.template || 'modern'} onTemplateChange={updateInvoiceTemplate} />
                </SidebarGroup>
                <SidebarGroup className="flex-grow flex flex-col">
                  <SidebarGroupLabel>History</SidebarGroupLabel>
                  <InvoiceHistory invoices={history} onLoad={loadInvoice} onDelete={deleteInvoice} activeId={activeInvoice?.id || ''} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </SidebarGroup>
              </div>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className={cn("p-4 sm:p-6 lg:p-8 flex flex-col h-screen", activeView === 'invoice' ? 'bg-muted/30' : '')}>
               <header className="mb-4 flex items-center justify-between no-print md:hidden">
                <SidebarTrigger />
                <div></div>
              </header>
              {activeView === 'invoice' && 
                <InvoicePage 
                  activeInvoice={activeInvoice} 
                  setActiveInvoice={setActiveInvoice} 
                  saveInvoice={saveInvoice} 
                  handleSaveAndPrint={handleSaveAndPrint}
                  createNewInvoice={createNewInvoice}
                  previewRef={previewRef}
                />
              }
              {activeView === 'settings' && <SettingsPage settings={settings} setSettings={setSettings} />}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

