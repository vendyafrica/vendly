// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@vendly/ui/components/button";
// import {
//     Field,
//     FieldGroup,
//     FieldLabel,
// } from "@vendly/ui/components/field";
// import { Input } from "@vendly/ui/components/input";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@vendly/ui/components/select";
// import { StoreThemeProvider, useTheme, type ThemeVariant } from "../../../components/theme-provider";

// const themeOptions: Array<{ key: ThemeVariant; name: string; colors: string[] }> = [
//     { key: "default", name: "Default", colors: ["#71717a", "#52525b", "#3f3f46", "#27272a"] },
//     { key: "glacier", name: "Glacier", colors: ["#0ea5e9", "#0284c7", "#0369a1", "#075985"] },
//     { key: "harvest", name: "Harvest", colors: ["#ea580c", "#dc2626", "#c2410c", "#9a3412"] },
//     { key: "lavender", name: "Lavender", colors: ["#a855f7", "#9333ea", "#7c3aed", "#6b21a8"] },
//     { key: "brutalist", name: "Brutalist", colors: ["#000000", "#18181b", "#27272a", "#3f3f46"] },
//     { key: "obsidian", name: "Obsidian", colors: ["#64748b", "#475569", "#334155", "#1e293b"] },
//     { key: "orchid", name: "Orchid", colors: ["#ec4899", "#db2777", "#be185d", "#9d174d"] },
//     { key: "solar", name: "Solar", colors: ["#eab308", "#ca8a04", "#a16207", "#854d0e"] },
// ];

// export default function Branding() {
//     const [selectedTheme, setSelectedTheme] = useState<ThemeVariant>("default");

//     return (
//         <StoreThemeProvider defaultVariant={selectedTheme}>
//             <BrandingContent selectedTheme={selectedTheme} onChangeTheme={setSelectedTheme} />
//         </StoreThemeProvider>
//     );
// }

// function BrandingContent({ selectedTheme, onChangeTheme }: { selectedTheme: ThemeVariant; onChangeTheme: (t: ThemeVariant) => void }) {
//     const { setTheme } = useTheme();

//     useEffect(() => {
//         setTheme(selectedTheme);
//     }, [selectedTheme, setTheme]);

//     return (
//         <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 ">
//             <form className="space-y-6 shadow-md rounded-md p-8">
//                 {/* Header */}
//                 <div className="space-y-1">
//                     <h1 className="text-xl font-semibold">
//                         Let&apos;s get your brand right
//                     </h1>
//                     <p className="text-sm text-muted-foreground">
//                         Choose a theme for your store and see it applied in real-time
//                     </p>
//                 </div>

//                 <FieldGroup>
//                     <Field>
//                         <FieldLabel className="text-base font-medium mb-2">
//                             Store Theme
//                         </FieldLabel>
//                         <Select value={selectedTheme} onValueChange={(val) => onChangeTheme(val as ThemeVariant)}>
//                             <SelectTrigger className="w-full">
//                                 <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent align="start" sideOffset={8} className="w-full min-w-[240px]">
//                                 <div className="px-2 py-1 text-xs text-muted-foreground">Default themes</div>
//                                 {themeOptions.map((option) => (
//                                     <SelectItem key={option.key} value={option.key} className="flex items-center gap-2">
//                                         <span className="flex-1 text-sm font-medium">{option.name}</span>
//                                         <span className="flex items-center gap-1">
//                                             {option.colors.map((color) => (
//                                                 <span
//                                                     key={color}
//                                                     className="h-2.5 w-2.5 rounded-full border border-black/5 shadow-sm"
//                                                     style={{ backgroundColor: color }}
//                                                 />
//                                             ))}
//                                         </span>
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                         <p className="text-xs text-muted-foreground mt-2">
//                             Preview how your store will look with different themes.
//                         </p>
//                     </Field>

//                     <Field>
//                         <FieldLabel htmlFor="logo" className="cursor-pointer">
//                             Upload your logo
//                         </FieldLabel>
//                         <Input
//                             id="logo"
//                             type="file"
//                             required
//                             className="focus-visible:border-primary/50 focus-visible:ring-primary/10 cursor-pointer"
//                         />
//                     </Field>
//                 </FieldGroup>

//                 {/* Actions */}
//                 <div className="flex items-center justify-between pt-2">
//                     <Button
//                         type="button"
//                         variant="outline"
//                         className="bg-muted hover:bg-red-400 hover:text-white border-0"
//                     >
//                         Back
//                     </Button>

//                     <Button type="submit" className="bg-primary hover:bg-primary/90 hover:text-white">
//                         Continue
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }
