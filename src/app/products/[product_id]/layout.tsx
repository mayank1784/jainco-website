import { fetchProductData } from "@/src/_data/product";
import React from "react";

import type { Metadata } from "next";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Record<string, string>;
}

// Server-side metadata function for dynamic metadata
export async function generateMetadata({
  params,
}: ProductLayoutProps): Promise<Metadata> {
  const prodIdString = params.product_id;
  const prodId = prodIdString.split('-').pop()
  

  if (!prodId) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const {product}  = await fetchProductData(prodId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

 
  const productName = product?.name || "Product";
   // Create a formatted string for variation types
   const variations = Object.entries(product.variationTypes)
   .map(([key, values]) => `${key}: ${values.join(", ")}`)
   .join("; ");

  // Dynamic metadata based on the category data
  return {
    title: `${productName}`,
    description: `Explore ${productName} with variations such as ${variations}. ${product?.description}`,
    keywords: [productName, "Jainco Decor", "home decor", "products"],
  };
}

export default async function ProductLayout({
  children,
}: ProductLayoutProps) {
  return <>{children}</>;
}
