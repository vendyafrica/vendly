export function parseInstagramCaption(
  caption: string | null | undefined,
  defaultCurrency: string = "UGX"
): {
  productName: string;
  priceAmount: number;
  currency: string;
  description: string | null;
} {
  const raw = String(caption || "").trim();
  if (!raw) {
    return {
      productName: "Instagram Product",
      priceAmount: 0,
      currency: defaultCurrency,
      description: null,
    };
  }

  // Split into lines
  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  
  let productName = "";
  let priceAmount = 0;
  let currency = defaultCurrency;
  let descriptionLines: string[] = [];

  for (const line of lines) {
    // Check if this line contains price
    const priceMatch = line.match(/^(?:price|cost|amount)\s*[:=-]\s*(?:([A-Z]{3})\s*)?([\d,]+)(?:\s*([A-Z]{3}))?(?:\s*\/=)?/i);
    
    if (priceMatch) {
      // Extract price
      let priceStr = priceMatch[2].replace(/,/g, "");
      
      // Handle "50k" format
      if (priceStr.toLowerCase().endsWith("k")) {
        priceStr = String(parseFloat(priceStr) * 1000);
      }
      
      priceAmount = Number.parseInt(priceStr, 10) || 0;
      
      // Currency could be before or after the number
      const foundCurrency = priceMatch[1] || priceMatch[3];
      if (foundCurrency && foundCurrency.length === 3) {
        currency = foundCurrency.toUpperCase();
      }
    } else if (!productName) {
      // First non-price line is the product name
      productName = line;
    } else {
      // Everything else is description
      descriptionLines.push(line);
    }
  }

  // Fallback if no product name found
  if (!productName) {
    productName = lines[0] || "Instagram Product";
  }

  const description = descriptionLines.length > 0 
    ? descriptionLines.join("\n") 
    : null;

  return {
    productName: productName.slice(0, 100),
    priceAmount,
    currency,
    description,
  };
}