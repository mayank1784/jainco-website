import React from "react";
import { fetchProductData } from "@/src/_data/product";
import type { Category, Product } from "@/@types/types";
import { notFound } from "next/navigation";
import { fetchCategories } from "@/src/_data/categories";
import ProductPage from "./ProductPage";
import { stripHtmlTags } from "@/src/lib/utils";
import { getCombinationsWithKeys } from "@/src/lib/utils";
import type { Metadata } from "next";

////////////////////////////////////// Metadata Generation ////////////////////////////////////////////////////////////

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
    description: `Explore ${productName} with variations such as ${variations}. ${product?.description}`,
    keywords: [productName, "Jainco Decor", "home decor", "products"],
  };
}

//////////////////////////////////////////////////////////// JSON LD Generator ////////////////////////////////////////////////////////////

const generateJsonLdData = (categoryData: Category, productData: Product) => {
  const productDescription = stripHtmlTags(productData.description);

  // Assuming productData.variationTypes is defined and contains the variation data
  const variationCombinations = getCombinationsWithKeys(
    productData.variationTypes
  );

  const variants = variationCombinations.map((combination) => {
    const queryParameters = new URLSearchParams();

    // Add each key-value pair from the combination to the query parameters
    for (const [key, value] of Object.entries(combination)) {
      queryParameters.append(
        encodeURIComponent(key),
        encodeURIComponent(value)
      );
    }

    const baseUrl = `https://jaincodecor.com/products/${encodeURIComponent(
      productData.name.trim().replace(/\s+/g, "-").toLowerCase()
    )}-${productData.id}`;
    const fullUrl = `${baseUrl}?${queryParameters.toString()}`;

    return {
      "@type": "Product",
      name: `${productData.name} (${Object.values(combination).join(", ")})`,
      sku: `(${Object.values(combination).join(", ")})`,
      url: fullUrl,
      image: productData.mainImage,
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: productData.lowerPrice,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
      additionalProperty: Object.entries(combination).map(([key, value]) => ({
        "@type": "PropertyValue",
        name: key,
        value: value,
      })),
    };
  });

  const relatedProducts = categoryData.products
    .filter((prod) => prod.id !== productData.id)
    .map((prod) => {
      return {
        "@type": "Product",
        name: prod.name,
        url: `https://jaincodecor.com/products/${encodeURIComponent(
          prod.name.trim().replace(/\s+/g, "-").toLowerCase()
        )}-${prod.id}`,
        image: prod.image,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: productData.lowerPrice,
          availability: "https://schema.org/InStock",
        },
      };
    });
  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: productData.name,
    description: productDescription,
    image: productData.mainImage,
    brand: {
      "@type": "Brand",
      name: "Jainco Decor",
    },
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
    hasVariant: variants,
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function Page({
  params,
}: {
  params: { product_id: string };
}) {
  const prodIdString = params.product_id;
  const prodId = prodIdString.split("-").pop() || "";

  // Fetch categories directly in the component
  const { product } = await fetchProductData(prodId);

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
      <ProductPage productData={product} categoryData={category} />;
    </>
  );
}
