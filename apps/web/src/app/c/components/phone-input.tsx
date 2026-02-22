"use client";

import { Input } from "@vendly/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vendly/ui/components/select";

const COUNTRY_OPTIONS = [
  { code: "256", label: "Uganda", flag: "🇺🇬" },
  { code: "254", label: "Kenya", flag: "🇰🇪" },
];

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onValueChange: (v: string) => void;
  onCountryChange: (code: string) => void;
  disabled?: boolean;
}

export function PhoneInput({
  value,
  countryCode,
  onValueChange,
  onCountryChange,
  disabled,
}: PhoneInputProps) {
  const selected = COUNTRY_OPTIONS.find((o) => o.code === countryCode);

  return (
    <div className="flex h-9 rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden">
      <Select
        value={countryCode}
        onValueChange={(value) => {
          if (value) onCountryChange(value);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-[68px] shrink-0 rounded-none border-0 border-r border-input bg-muted/40 shadow-none focus:ring-0 focus-visible:ring-0 gap-1 px-2">
          <SelectValue>
            <span className="text-base leading-none">{selected?.flag}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" className="min-w-[200px]">
          {COUNTRY_OPTIONS.map((opt) => (
            <SelectItem key={opt.code} value={opt.code}>
              <span className="flex items-center gap-2">
                <span>{opt.flag}</span>
                <span>{opt.label}</span>
                <span className="text-xs text-muted-foreground">+{opt.code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="tel"
        placeholder="780 000 000"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        className="flex-1 rounded-none border-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

export { COUNTRY_OPTIONS };