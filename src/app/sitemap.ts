
import { MetadataRoute } from "next";
import { fetchCategories } from "@/src/_data/categories";
import { fetchProductData } from "../_data/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories } = await fetchCategories();

  const staticImages = [
    {
      loc: "app-promo.png",
      title: "Promotional Banner for Jainco Decor App",
      caption: "Download the Jainco Decor App for exclusive offers.",
      alt: "Jainco Decor App Promo Banner",
    },
    {
      loc: "atul-jain.jpg",
      title: "Atul Jain",
      caption: "Founder and CEO of Jainco Decor.",
      alt: "Portrait of Atul Jain",
    },
    {
      loc: "carousel/fridge-top-cover.png",
      title: "Jainco Decor Fridge Top Covers",
      caption: "Jainco Decor fridge top covers, kumkum, flock, rexine.",
      alt: "Fridge top cover product",
    },
    {
      loc: "carousel/pvc-bedsheets.png",
      title: "PVC Bedsheets",
      caption: "Durable and stylish PVC bedsheets for your home.",
      alt: "Jainco Decor PVC bedsheets",
    },
    {
      loc: "carousel/slap-shelf-roll-liners.png",
      title: "Shelf Roll Liners",
      caption: "Versatile shelf roll liners to keep your shelves clean.",
      alt: "Shelf roll liners product image",
    },
    {
      loc: "carousel/table-covers-waterproof.png",
      title: "PVC Waterproof Table Covers",
      caption: "High-quality waterproof table covers for every occasion.",
      alt: "PVC Waterproof table cover product image",
    },
    {
      loc: "carousel/washing-machine-covers.png",
      title: "Washing Machine Covers",
      caption: "Protect your washing machine with stylish covers.",
      alt: "Washing machine cover product image",
    },
    {
      loc: "jain-enterprises.png",
      title: "Jain Enterprises Store | Jainco Decor",
      caption: "Official brand store of Jainco Decor",
      alt: "Jain Enterprises Store",
    },
    {
      loc: "tarun-jain.jpg",
      title: "Tarun Jain",
      caption: "Co-founder and visionary of Jainco Decor.",
      alt: "Portrait of Tarun Jain",
    },
    {
      loc: "static/Algolia-logo-white.png",
      title: "Algolia Logo",
      caption: "Search powered by Algolia for a seamless experience.",
      alt: "Algolia white logo",
    },
    {
      loc: "static/Algolia-mark-rounded-white.png",
      title: "Algolia Rounded Mark",
      caption: "Rounded Algolia mark for brand recognition.",
      alt: "Algolia rounded mark logo",
    },
    {
      loc: "static/favicon.ico",
      title: "Favicon",
      caption: "Jainco Decor website favicon.",
      alt: "Jainco Decor favicon",
    },
    {
      loc: "static/jainco-phone.png",
      title: "Jainco Decor Mobile Promo",
      caption: "Stay connected with Jainco Decor on mobile.",
      alt: "Jainco Decor mobile promotional image",
    },
    {
      loc: "static/jainco_logo.png",
      title: "Jainco Logo",
      caption: "Official Jainco logo in PNG format.",
      alt: "Jainco logo image",
    },
  ];

  
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
    
   
    return allCombinations
  };

  // Generate category entries
  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}categories/${encodeURIComponent(
      category.name.trim().replace(/\s+/g, "-").toLowerCase()
    )}-${category.id}`,
    images: [
      {
        loc: category.image,
        title: `${category.name} Category Image`,
        caption: `Explore products in the ${category.name} category | Jainco Decor`,
        alt: `${category.name} category image`,
      }
    ]
  }));

  // Fetch product data for all products and generate entries
  const productEntriesPromises = categories.flatMap((category) =>
    category.products.map(async (product) => {
      const baseProductUrl = escapeXML(`${baseUrl}products/${encodeURIComponent(
        product.name.trim().replace(/\s+/g, "-").toLowerCase()
      )}-${product.id}`);

      // Fetch additional product data (e.g., variationTypes)
      const data = await fetchProductData(product.id);
// Extract images for the product
const otherProductImages = data.product?.otherImages?.map((image) => ({
  loc: image,
  title: product.name,
  caption: `Image of ${product.name}`,
  alt: `${product.name} image`,
})) || [];

const productImage = {
  loc: data.product?.mainImage,
  title: data.product?.name,
  caption: `Image of ${data.product?.name}`,
  alt: `${data.product?.name} image`,
}
const combinedImages = [productImage, ...otherProductImages];
     
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
        { url: baseProductUrl, isCanonical:true, images: combinedImages }, // Canonical URL
        ...variationUrls.map((variation)=>({
          url: variation.url,
          isCanonical: variation.isCanonical,
          images: combinedImages
        })),
        
      ];
    })
  );

  // Resolve all promises to generate product entries
  const resolvedProductEntries = await Promise.all(productEntriesPromises);
  const productEntries = resolvedProductEntries.flat();

  const staticImageEntries= staticImages.map((image) => ({
    url: `${baseUrl}images/${image.loc}`,
    images: [
      {
        loc: `${baseUrl}images/${image.loc}`,
        title: image.title,
        caption: image.caption,
        alt: image.alt,
      },
  
    ],
  }));
// Format the sitemap with canonical attribute
const formattedEntries = productEntries.map((entry) => ({
    url: entry.url,
    priority: entry.isCanonical ? 1.0 : 0.8, // Higher priority for canonical URLs
    images: entry.images
  }));

  // Return the complete sitemap
  const sitemap = [
    { url: `${baseUrl}` }, // Home page
    ...categoryEntries,
    ...formattedEntries,
    ...staticImageEntries,
    { url: `${baseUrl}search` }, // Search page
    {url: `${baseUrl}categories`}
  ]
 
  return sitemap
}
