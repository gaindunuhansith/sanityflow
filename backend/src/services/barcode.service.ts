import axios from "axios";
import env from "../config/env.js";
import Logger from "../utils/logger.js";

const sanitaryFallbackCatalog: Record<
  string,
  {
    name: string;
    brand: string;
    category: string;
    description: string;
    image: null;
  }
> = {
  "990000000001": {
    name: "Antibacterial Hand Wash (500ml)",
    brand: "SanityFlow Essentials",
    category: "Sanitary",
    description: "Internal hygiene stock item",
    image: null,
  },
  "990000000002": {
    name: "Surface Disinfectant Spray (750ml)",
    brand: "SanityFlow Essentials",
    category: "Sanitary",
    description: "Internal hygiene stock item",
    image: null,
  },
  "990000000003": {
    name: "Liquid Bleach (1L)",
    brand: "SanityFlow Essentials",
    category: "Sanitary",
    description: "Internal hygiene stock item",
    image: null,
  },
  "990000000004": {
    name: "Medical Disposable Gloves (Box)",
    brand: "SanityFlow Essentials",
    category: "Sanitary",
    description: "Internal hygiene stock item",
    image: null,
  },
  "990000000005": {
    name: "Hand Sanitizer Gel (100ml)",
    brand: "SanityFlow Essentials",
    category: "Sanitary",
    description: "Internal hygiene stock item",
    image: null,
  },
};

export const lookupBarcodeService = async (barcode: string) => {

  // -------- FIRST API (General Products) --------
  if (env.BARCODE_API_KEY) {
    try {
      const response = await axios.get(
        "https://api.barcodelookup.com/v3/products",
        {
          params: {
            barcode,
            key: env.BARCODE_API_KEY,
          },
          timeout: 8000,
        }
      );

      const product = response.data.products?.[0];

      if (product) {
        return {
          name: product.title || "Unknown",
          brand: product.brand || "Unknown",
          category: product.category || "General",
          description: product.description || "",
          image: product.images?.[0] || null,
          source: "BarcodeLookup API"
        };
      }
    } catch (error) {
      Logger.warn(`BarcodeLookup API failed for ${barcode}`);
    }
  } else {
    Logger.debug("BARCODE_API_KEY is missing, skipping BarcodeLookup API");
  }

  //-------- SECOND API (Food Products) --------
  
  try {

    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (response.data.status === 1) {

      const product = response.data.product;

      return {
        name: product.product_name || "Unknown",
        brand: product.brands || "Unknown",
        category: product.categories || "Food",
        description: "",
        image: product.image_url || null,
        source: "OpenFoodFacts API"
      };
    }

  } catch (error) {
    Logger.warn(`OpenFoodFacts API failed for ${barcode}`);
  }

  // -------- THIRD API (Sanitary & hygiene products) --------
  try {
    const response = await axios.get(
      `https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`,
      { timeout: 8000 }
    );

    if (response.data.status === 1) {
      const product = response.data.product;

      return {
        name: product.product_name || product.abbreviated_product_name || "Unknown",
        brand: product.brands || "Unknown",
        category: product.categories || "Sanitary & Personal Care",
        description: "",
        image: product.image_url || null,
        source: "OpenBeautyFacts API"
      };
    }
  } catch (error) {
    Logger.warn(`OpenBeautyFacts API failed for ${barcode}`);
  }

  // Optional internal sanitary product fallback (customize these barcodes to match your inventory labels).
  const sanitaryFallback = sanitaryFallbackCatalog[barcode];
  if (sanitaryFallback) {
    return {
      ...sanitaryFallback,
      source: "SanityFlow Local Catalog",
    };
  }

  return null;
};