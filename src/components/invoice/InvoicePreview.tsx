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
    <div className={cn("p-6 sm:p-10 rounded-lg bg-background dark:bg-gray-800 h-full w-full", theme.styles.container)}>
      <div className={theme.styles.header}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase">Invoice</h1>
            <div className="flex items-center gap-2 mt-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6"/>
              <p className="font-bold text-base sm:text-lg">{invoice.fromName}</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs sm:text-sm">
            <p className="font-semibold sm:font-normal">{invoice.invoiceNumber}</p>
            <p>
              Date: {format(invoice.date, "MMM dd, yyyy")}
            </p>
            <p>
              Due: {format(invoice.dueDate, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className={cn("grid grid-cols-2 gap-4 sm:gap-8 my-6 sm:my-8 text-xs sm:text-sm", theme.styles.fromTo)}>
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

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className={theme.styles.tableHeader}>
              <th className="p-2 sm:p-3">Description</th>
              <th className="p-2 sm:p-3 text-center">Qty</th>
              <th className="p-2 sm:p-3 text-right">Unit Price</th>
              <th className="p-2 sm:p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className={theme.styles.tableRow}>
                <td className="p-2 sm:p-3">{item.description}</td>
                <td className="p-2 sm:p-3 text-center">{item.quantity}</td>
                <td className="p-2 sm:p-3 text-right">
                  {renderCurrency(item.price)}
                </td>
                <td className="p-2 sm:p-3 text-right">
                  {renderCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className={cn("flex justify-end mt-6 sm:mt-8", theme.styles.totals)}>
        <div className="w-full max-w-xs space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{renderCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST ({invoice.gstRate}%)</span>
            <span>{renderCurrency(gstAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
            <span>Total</span>
            <span>{renderCurrency(total)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-6 sm:mt-8 text-xs sm:text-sm">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      <footer className={cn("text-xs sm:text-sm", theme.styles.footer)}>
        <p>Thank you for choosing {invoice.fromName}.</p>
      </footer>
    </div>
  );
}
