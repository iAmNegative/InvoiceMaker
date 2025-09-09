"use client";

import type { Invoice, ThemeName } from "@/types";
import { themes } from "@/lib/themes";
import { formatCurrency, cn } from "@/lib/utils";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const gstAmount = subtotal * (invoice.gstRate / 100);
  const total = subtotal + gstAmount;

  const theme = themes[invoice.theme] || themes.modern;
  
  const renderCurrency = (amount: number) => {
    return formatCurrency(amount, invoice.currency);
  }

  return (
    <div className={cn("p-10 rounded-lg bg-background dark:bg-gray-800 h-full w-full", theme.styles.container)}>
      <div className={theme.styles.header}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold uppercase">Invoice</h1>
            <div className="flex items-center gap-2 mt-2">
              <FileText className="w-6 h-6"/>
              <p className="font-bold text-lg">{invoice.fromName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">{invoice.invoiceNumber}</p>
            <p className="text-sm">
              Date: {format(invoice.date, "MMM dd, yyyy")}
            </p>
            <p className="text-sm">
              Due: {format(invoice.dueDate, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className={cn("grid grid-cols-2 gap-8 my-8", theme.styles.fromTo)}>
        <div>
          <h3 className="font-semibold mb-2">From:</h3>
          <p>{invoice.fromName}</p>
          <p className="whitespace-pre-line">{invoice.fromAddress}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold mb-2">To:</h3>
          <p>{invoice.clientName}</p>
          <p className="whitespace-pre-line">{invoice.clientAddress}</p>
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className={theme.styles.tableHeader}>
            <th className="p-3">Description</th>
            <th className="p-3 text-center">Qty</th>
            <th className="p-3 text-right">Unit Price</th>
            <th className="p-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className={theme.styles.tableRow}>
              <td className="p-3">{item.description}</td>
              <td className="p-3 text-center">{item.quantity}</td>
              <td className="p-3 text-right">
                {renderCurrency(item.price)}
              </td>
              <td className="p-3 text-right">
                {renderCurrency(item.quantity * item.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={cn("flex justify-end mt-8", theme.styles.totals)}>
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{renderCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST ({invoice.gstRate}%)</span>
            <span>{renderCurrency(gstAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>{renderCurrency(total)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      <footer className={theme.styles.footer}>
        <p>Thank you for choosing {invoice.fromName}.</p>
      </footer>
    </div>
  );
}
