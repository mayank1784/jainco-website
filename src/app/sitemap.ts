
import { MetadataRoute } from "next";
import { fetchCategories } from "@/src/_data/categories";
import { fetchProductData } from "../_data/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories } = await fetchCategories();
  function cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce(
      (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
      [[]] as string[][]
    );
  }

  // Helper function to escape XML special characters
  const escapeXML = (str: string): string =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  // Base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Helper function to generate all combinations of variation keys and values
  const generateCombinations = (variationTypes: Record<string, string[]>) => {
    const keys = Object.keys(variationTypes);
    const values = keys.map(key => variationTypes[key]);
  
    // Generate all possible combinations
    const allCombinations = cartesianProduct(values).map(combination => 
      keys.reduce((obj, key, index) => {
        obj[key] = combination[index];
        return obj;
      }, {} as Record<string, string>)
    );
    
    // const entries = Object.entries(variationTypes);

    // const combine = (index: number, current: Record<string, string>): Record<string, string>[] => {
    //   if (index === entries.length) {
    //     return [current];
    //   }

    //   const [key, values] = entries[index];
    //   const valuesArray = Array.isArray(values) ? values : [values];

    //   return valuesArray.flatMap((value) =>
    //     combine(index + 1, { ...current, [key]: value })
    //   );
    // };

    // return combine(0, {});
    return allCombinations
  };

  // Generate category entries
  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}categories/${encodeURIComponent(
      category.name.trim().replace(/\s+/g, "-").toLowerCase()
    )}-${category.id}`,
  }));

  // Fetch product data for all products and generate entries
  const productEntriesPromises = categories.flatMap((category) =>
    category.products.map(async (product) => {
      const baseProductUrl = escapeXML(`${baseUrl}products/${encodeURIComponent(
        product.name.trim().replace(/\s+/g, "-").toLowerCase()
      )}-${product.id}`);

      // Fetch additional product data (e.g., variationTypes)
      const data = await fetchProductData(product.id);

      // Generate URLs for variations based on all combinations of variationTypes
      // const variationUrls = data.product?.variationTypes
      //   ? generateCombinations(data.product.variationTypes).map((combination) => {
      //       const queryParams = Object.entries(combination)
      //         .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      //         .join("&");
      //       return {
      //         url: escapeXML(`${baseProductUrl}?${queryParams}`),
      //         isCanonical: false
      //       };
      //     })
      //   : [];
      const variationUrls = data.product?.variationTypes
  ? generateCombinations(data.product.variationTypes).map((combination) => {
      const queryParams = Object.entries(combination)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort keys in ascending order
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
      return {
        url: escapeXML(`${baseProductUrl}?${queryParams}`),
        isCanonical: false,
      };
    })
  : [];

      // Return canonical URL and variation URLs
      return [
        { url: baseProductUrl, isCanonical:true }, // Canonical URL
        ...variationUrls,
      ];
    })
  );

  // Resolve all promises to generate product entries
  const resolvedProductEntries = await Promise.all(productEntriesPromises);
  const productEntries = resolvedProductEntries.flat();
// Format the sitemap with canonical attribute
const formattedEntries: MetadataRoute.Sitemap = productEntries.map((entry) => ({
    url: entry.url,
    priority: entry.isCanonical ? 1.0 : 0.8, // Higher priority for canonical URLs
  }));

  // Return the complete sitemap
  return [
    { url: `${baseUrl}` }, // Home page
    ...categoryEntries,
    ...formattedEntries,
    { url: `${baseUrl}search` }, // Search page
    {url: `${baseUrl}categories`}
  ];
}
