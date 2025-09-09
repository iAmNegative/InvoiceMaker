"use client";

import type { AppSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import React from 'react';

interface SettingsPageProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"];

export default function SettingsPage({ settings, setSettings }: SettingsPageProps) {
  const { toast } = useToast();

  const handleFieldChange = (
    field: keyof AppSettings,
    value: string | number
  ) => {
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
    <div>
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
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="gstRate">Default GST Rate (%)</Label>
                        <Input id="gstRate" type="number" value={settings.gstRate} onChange={(e) => handleFieldChange("gstRate", parseFloat(e.target.value) || 0)}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select value={settings.currency} onValueChange={(value) => handleFieldChange("currency", value)}>
                            <SelectTrigger id="currency">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button onClick={handleSave}>Save Settings</Button>
            </CardContent>
        </Card>

    </div>
  );
}
