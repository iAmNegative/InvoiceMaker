"use client";

import type { ThemeName } from "@/types";
import { themes } from "@/lib/themes";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {(Object.keys(themes) as ThemeName[]).map((themeKey) => (
        <Card
          key={themeKey}
          onClick={() => onThemeChange(themeKey)}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md relative",
            currentTheme === themeKey
              ? "ring-2 ring-primary"
              : "ring-1 ring-border"
          )}
        >
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div
                  className={cn("w-5 h-8 rounded", themes[themeKey].preview.background)}
                ></div>
                <div
                  className={cn("w-5 h-8 rounded", themes[themeKey].preview.primary)}
                ></div>
                <div
                  className={cn("w-5 h-8 rounded", themes[themeKey].preview.secondary)}
                ></div>
              </div>
              <span className="text-sm font-medium">{themes[themeKey].name}</span>
            </div>
            {currentTheme === themeKey && (
              <CheckCircle className="w-5 h-5 text-primary" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
