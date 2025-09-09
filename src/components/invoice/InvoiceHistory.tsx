"use client";

import type { Invoice } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/alert-dialog"

interface InvoiceHistoryProps {
  invoices: Invoice[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  activeId: string;
}

export default function InvoiceHistory({
  invoices,
  onLoad,
  onDelete,
  activeId
}: InvoiceHistoryProps) {
  return (
    <ScrollArea className="h-64">
        {invoices.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground p-4">No saved invoices.</div>
        ) : (
            <div className="space-y-1">
                {invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        className={cn(
                            "group flex items-center justify-between p-2 rounded-md text-sm",
                            activeId === invoice.id ? "bg-accent/20" : "hover:bg-muted/50"
                        )}
                    >
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
  );
}
