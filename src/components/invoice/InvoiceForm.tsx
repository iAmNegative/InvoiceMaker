"use client";

import type { Invoice, InvoiceItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"];

export default function InvoiceForm({ invoice, setInvoice }: InvoiceFormProps) {
  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `item-${Date.now()}`, description: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleFieldChange = (
    field: keyof Invoice,
    value: string | number | Date
  ) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
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
                        <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
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
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={invoice.date} onSelect={(date) => handleFieldChange("date", date || new Date())} initialFocus/>
                </PopoverContent>
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
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={invoice.dueDate} onSelect={(date) => handleFieldChange("dueDate", date || new Date())} initialFocus/>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
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
          <CardHeader>
            <CardTitle>To</CardTitle>
          </CardHeader>
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
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
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
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addItem}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={invoice.notes} onChange={(e) => handleFieldChange("notes", e.target.value)} placeholder="Terms and conditions, payment details, etc."/>
        </CardContent>
      </Card>
    </div>
  );
}
