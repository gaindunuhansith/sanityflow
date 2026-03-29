import axios from "axios";

export const lookupBarcodeService = async (barcode: string) => {

  // -------- FIRST API (General Products) --------
  try {

    const response = await axios.get(
      `https://api.barcodelookup.com/v3/products?barcode=${barcode}&key=${process.env.BARCODE_API_KEY}`
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
    console.log("BarcodeLookup API failed");
  }

  // -------- SECOND API (Food Products) --------
  // try {

  //   const response = await axios.get(
  //     `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  //   );

  //   if (response.data.status === 1) {

  //     const product = response.data.product;

  //     return {
  //       name: product.product_name || "Unknown",
  //       brand: product.brands || "Unknown",
  //       category: product.categories || "Food",
  //       description: "",
  //       image: product.image_url || null,
  //       source: "OpenFoodFacts API"
  //     };
  //   }

  // } catch (error) {
  //   console.log("OpenFoodFacts API failed");
  // }

  return null;
};