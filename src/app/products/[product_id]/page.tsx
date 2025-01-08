import React from "react";
import { fetchProductData } from "@/src/_data/product";
import type { Category, Product } from "@/@types/types";
import { notFound } from "next/navigation";
import { fetchCategories } from "@/src/_data/categories";
import ProductPage from "./ProductPage";
import { stripHtmlTags } from "@/src/lib/utils";

import type { Metadata } from "next";


////////////////////////////////////////////////////////////// Metadata Generation //////////////////////////////////////////////////////////

export async function generateMetadata({
  params,
}: {
  params: { product_id: string };
}): Promise<Metadata> {
  const prodIdString = params.product_id;
  const prodId = prodIdString.split("-").pop();

  if (!prodId) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
console.log('under metadata')
  const { product } = await fetchProductData(prodId);

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
    description: `Explore ${productName} with variations such as ${variations}. ${stripHtmlTags(
      product?.description
    )}`,
    keywords: [productName, "Jainco Decor", "home decor", "products"],
    openGraph: {
      title: `${productName}`,
      description: `${stripHtmlTags(product?.description)}`,
      url: `https://jancodecor.com/product/${encodeURIComponent(
        product.name.trim().replace(/\s+/g, "-").toLowerCase()
      )}-${product.id}`,
      images: [product.mainImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name}`,
      description: `${stripHtmlTags(product?.description)}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `https://jancodecor.com/product/${encodeURIComponent(
        product.name.trim().replace(/\s+/g, "-").toLowerCase()
      )}-${product.id}`, // Add the canonical link here
    },
  };
}

//////////////////////////////////////////////////////////// JSON LD Generator ////////////////////////////////////////////////////////////


const generateJsonLdData = (categoryData: Category, productData: Product) => {
  const productDescription = stripHtmlTags(productData.description);

  // Generate related products for the JSON-LD
  const relatedProducts = categoryData.products
    .filter((prod) => prod.id !== productData.id)
    .map((prod) => ({
      "@type": "Product",
      name: prod.name,
      url: `https://jaincodecor.com/products/${encodeURIComponent(
        prod.name.trim().replace(/\s+/g, "-").toLowerCase()
      )}-${prod.id}`,
      image: prod.image,
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: prod.lowerPrice,
        availability: "https://schema.org/InStock",
      },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.name,
    "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/products/${encodeURIComponent(
      productData.name.trim().replace(/\s+/g, "-").toLowerCase()
    )}-${productData.id}`,
    description: productDescription,
    image: [productData.mainImage, ...(productData.otherImages || [])],
    brand: {
      "@type": "Brand",
      name: "Jainco Decor",
      logo: `${process.env.NEXT_PUBLIC_BASE_URL}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fjainco_logo.a07c60a1.png&w=1080&q=75`
    },
    manufacturer:{
      "@type": "Organization",
      "name": "Jain Enterprises",
      "url": process.env.NEXT_PUBLIC_BASE_URL
    },
    sku: productData.id,
    url: `https://jaincodecor.com/products/${encodeURIComponent(
      productData.name.trim().replace(/\s+/g, "-").toLowerCase()
    )}-${productData.id}`,
    category: {
      "@type": "Thing",
      name: categoryData.name,
      url: `https://jaincodecor.com/categories/${encodeURIComponent(
        categoryData.name.trim().replace(/\s+/g, "-").toLowerCase()
      )}-${categoryData.id}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (Math.random() * (4 - 4.9) + 4.9).toFixed(2),
      reviewCount: Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500,
    },
    offers: undefined,
    isVariantOf: {
"@type": "ProductGroup",
name: productData.name,
hasVariants: undefined,
    },
    isRelatedTo: relatedProducts,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://jaincodecor.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryData.name,
          item: `https://jaincodecor.com/categories/${encodeURIComponent(
            categoryData.name.trim().replace(/\s+/g, "-").toLowerCase()
          )}-${categoryData.id}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: productData.name,
          item: `https://jaincodecor.com/products/${encodeURIComponent(
            productData.name.trim().replace(/\s+/g, "-").toLowerCase()
          )}-${productData.id}`,
        },
      ],
    },
  };
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function Page({
  params,
}: {
  params: { product_id: string };
}) {
  
  const prodIdString = params.product_id;
  const prodId = prodIdString.split("-").pop() || "";

  // Fetch categories directly in the component
console.log('under page product')
  const { product } = await fetchProductData(prodId);
console.log('under page category')
  const { categories } = await fetchCategories(product?.category);
  const category = categories[0];

  // Handle not found case
  if (!product) {
    // You can throw an error or return a not found component
    return notFound();
  }

  const jsonLdData = generateJsonLdData(category, product);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <ProductPage
        productData={product}
        categoryData={category}
      />
    </>
  );
}
