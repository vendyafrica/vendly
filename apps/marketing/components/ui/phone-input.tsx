"use client";
import { useState, forwardRef, useEffect, useMemo } from "react";
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js";
import { CircleFlag } from "react-circle-flags";
import { lookup, countries } from "country-data-list";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { GlobeIcon } from "lucide-react";

export const phoneSchema = z.string().refine((value) => {
  try {
    return isValidPhoneNumber(value);
  } catch {
    return false;
  }
}, "Invalid phone number");

export type CountryData = {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
};

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onCountryChange?: (data: CountryData | undefined) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultCountry?: string;
  className?: string;
  inline?: boolean;
  allowedCountries?: string[]; // alpha2 codes (e.g., "UG", "KE")
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      onCountryChange,
      onChange,
      value,
      placeholder,
      defaultCountry,
      inline = false,
      allowedCountries,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [countryData, setCountryData] = useState<CountryData | undefined>();
    const [displayFlag, setDisplayFlag] = useState<string>("");
    const [hasInitialized, setHasInitialized] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
      defaultCountry || allowedCountries?.[0]
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const availableCountries = useMemo(() => {
      const baseList = allowedCountries?.length
        ? countries.all.filter((c) =>
          allowedCountries
            ?.map((code) => code.toUpperCase())
            .includes((c.alpha2 || "").toUpperCase())
        )
        : countries.all;

      return baseList
        .filter((c) => c.countryCallingCodes && c.countryCallingCodes.length > 0)
        .map((c) => ({
          ...c,
          alpha2: (c.alpha2 || "").toUpperCase(),
        })) as CountryData[];
    }, [allowedCountries]);

    const filteredCountries = useMemo(() => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return availableCountries;
      return availableCountries.filter((c) =>
        [c.name, c.alpha2, c.alpha3, c.countryCallingCodes?.[0] || ""]
          .filter(Boolean)
          .some((field) => field.toString().toLowerCase().includes(term))
      );
    }, [searchTerm, availableCountries]);

    useEffect(() => {
      const initial = defaultCountry || allowedCountries?.[0];
      if (initial) {
        const newCountryData = lookup.countries({
          alpha2: initial.toLowerCase(),
        })[0];
        setCountryData(newCountryData);
        setDisplayFlag(initial.toLowerCase());
        setSelectedCountry(initial.toUpperCase());

        if (
          !hasInitialized &&
          newCountryData?.countryCallingCodes?.[0] &&
          !value
        ) {
          const syntheticEvent = {
            target: {
              value: newCountryData.countryCallingCodes[0],
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange?.(syntheticEvent);
          setHasInitialized(true);
        }
      }
    }, [defaultCountry, onChange, value, hasInitialized, allowedCountries]);

    useEffect(() => {
      if (value) {
        const asYouType = new AsYouType();
        asYouType.input(value);
        const country = asYouType.getCountry();
        if (country) {
          const isAllowed = allowedCountries?.length
            ? allowedCountries.map((c) => c.toUpperCase()).includes(country)
            : true;

          if (isAllowed) {
            setDisplayFlag(country.toLowerCase());
            setSelectedCountry(country);
            const countryInfo = lookup.countries({ alpha2: country })[0];
            setCountryData(countryInfo);
            onCountryChange?.(countryInfo);
          }
        }
      }
    }, [value, allowedCountries, onCountryChange]);

    const handleCountrySelect = (countryCode: string) => {
      const countryInfo = lookup.countries({ alpha2: countryCode })[0];
      if (!countryInfo) return;

      setSelectedCountry(countryCode.toUpperCase());
      setDisplayFlag(countryCode.toLowerCase());
      setCountryData(countryInfo);
      onCountryChange?.(countryInfo);

      const callingCode = countryInfo.countryCallingCodes?.[0];
      if (callingCode) {
        // Normalize calling code to always start with +
        let normalizedCallingCode = callingCode.startsWith('+') ? callingCode : `+${callingCode}`;
        const syntheticEvent = {
          target: {
            value: normalizedCallingCode,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }

      setIsDropdownOpen(false);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      const rawDialCode = countryData?.countryCallingCodes?.[0] || "";
      const dialCode = rawDialCode.startsWith('+') ? rawDialCode : (rawDialCode ? `+${rawDialCode}` : "");

      if (dialCode && !newValue.startsWith(dialCode)) {
        // Prevent deletion of country code
        if (newValue.length < dialCode.length) {
          newValue = dialCode;
        } else {
          // If user modified prefix, Restore it.
          const rawInput = newValue.replace(/[^0-9]/g, '');
          const rawDial = dialCode.replace(/[^0-9]/g, '');

          if (rawInput.startsWith(rawDial)) {
            // Reconstruct: + + digits
            newValue = '+' + rawInput;
          } else {
            newValue = dialCode;
          }
        }
      }

      // Ensure the value starts with "+"
      if (!newValue.startsWith("+")) {
        if (newValue.startsWith("00")) {
          newValue = "+" + newValue.slice(2);
        } else {
          newValue = "+" + newValue;
        }
      }

      // Cleanup any double pluses just in case
      if (newValue.startsWith("++")) {
        newValue = '+' + newValue.replace(/^\++/, '');
      }

      const asYouType = new AsYouType();
      asYouType.input(newValue);
      const parsedCountry = asYouType.getCountry();

      const isAllowed = allowedCountries?.length
        ? parsedCountry && allowedCountries.map((c) => c.toUpperCase()).includes(parsedCountry)
        : true;

      // Only switch country if it's different AND valid AND allowed.
      // But if we enforce dialCode, we might prevent valid switches by typing?
      // User said "once we set the country code ... uneditable". 
      // This implies locking the country unless they use the dropdown.

      // However, if they clear everything and type +1, should it switch?
      // Our logic above prevents clearing dialCode if it exists!
      // So they MUST use dropdown to switch country. This aligns with "uneditable".

      if (parsedCountry && isAllowed) {
        const countryCode = parsedCountry;

        // Update internal state but maybe don't trigger onChange if we want strict locking?
        // Actually we should keep internal state consistent.

        setDisplayFlag(countryCode.toLowerCase());
        const countryInfo = lookup.countries({ alpha2: countryCode })[0];
        setCountryData(countryInfo);
        setSelectedCountry(countryCode);
        onCountryChange?.(countryInfo);
      }

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue,
        }
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    };


    const inputClasses = cn(
      "group flex items-center gap-3 relative bg-background transition-colors text-sm rounded-lg border border-input pl-2 pr-3 h-10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 [interpolate-size:allow-keywords]",
      inline && "rounded-l-none w-full",
      className
    );

    return (
      <div className={inputClasses}>
        {!inline && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-md border border-input bg-white px-2 h-8 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                {displayFlag ? (
                  <CircleFlag countryCode={displayFlag} height={20} />
                ) : (
                  <GlobeIcon size={16} />
                )}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {selectedCountry || ""}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">▾</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 w-72 rounded-xl border bg-popover shadow-xl">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search country..."
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="max-h-60 overflow-auto py-1">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.alpha2}
                      type="button"
                      onClick={() => handleCountrySelect(c.alpha2)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent outline-none"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                        <CircleFlag countryCode={c.alpha2.toLowerCase()} height={24} />
                      </div>
                      <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.countryCallingCodes?.[0]}
                      </span>
                    </button>
                  ))}

                  {filteredCountries.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No results
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder || "Enter number"}
          type="tel"
          autoComplete="tel"
          name="phone"
          className={cn(
            "flex w-full border-none bg-transparent text-sm transition-colors placeholder:text-muted-foreground outline-none h-10 py-1 px-1 leading-none [interpolate-size:allow-keywords]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";