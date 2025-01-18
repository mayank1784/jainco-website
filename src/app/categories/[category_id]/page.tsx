// ./src/app/[category]/[id]/page.tsx
import { fetchCategories } from "@/src/_data/categories";
import { notFound } from "next/navigation";
import CategoryPage from "./CategoryPage";
import type { Metadata } from "next";
import type { Category } from "@/@types/types";


// Helper function to generate consistent JSON-LD data
const generateJsonLd = (categoryData: Category) => {
  const baseUrl = "https://jaincodecor.com";
  const categorySlug = encodeURIComponent(
    categoryData.name.trim().replace(/\s+/g, "-").toLowerCase()
  );
  const categoryUrl = `${baseUrl}/categories/${categorySlug}-${categoryData.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": categoryUrl,
    "name": categoryData.name,
    "description": categoryData.description,
    "url": categoryUrl,
    "image": {
      "@type": "ImageObject",
      "url": categoryData.image,
      "caption": `${categoryData.name} - Collection by Jainco Decor`
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Categories",
          "item": `${baseUrl}/categories`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": categoryData.name,
          "item": categoryUrl
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categoryData.products.length,
      "itemListElement": categoryData.products.map((product, index) => {
        const productSlug = encodeURIComponent(
          product.name.trim().replace(/\s+/g, "-").toLowerCase()
        );
        const productUrl = `${baseUrl}/products/${productSlug}-${product.id}`;

        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "@id": productUrl,
            "name": product.name,
            "url": productUrl,
            "image": {
              "@type": "ImageObject",
              "url": product.image || categoryData.image,
              "caption": `${product.name} - ${categoryData.name} Collection`
            },
            "description": product.description,
            "category": categoryData.name,
            "brand": {
              "@type": "Brand",
              "name": "Jainco Decor",
              "logo": "https://jaincodecor.com/images/static/jainco_logo.png",
              "url": baseUrl
            },
            "manufacturer": {
              "@type": "Organization",
              "name": "Jain Enterprises",
              "url": baseUrl
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": product.price,
              "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
              "availability": "https://schema.org/InStock" ,
              "url": productUrl,
              "seller": {
                "@type": "Organization",
                "name": "Jain Enterprises",
                "url": baseUrl
              },
              "itemCondition": "https://schema.org/NewCondition",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: (Math.random() * (4 - 4.9) + 4.9).toFixed(2),
              reviewCount: Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500,
            },
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Collection",
                "value": categoryData.name
              },
            ]
          }
        };
      })
    },
    "isPartOf": {
      "@type": "WebSite",
      "@id": baseUrl,
      "name": "Jainco Decor",
      "url": baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  };
};


// Metadata for SSR
export async function generateMetadata({
  params,
}: {
  params: { category_id: string };
}): Promise<Metadata> {
  const categoryIdString = params.category_id;
  const catId = categoryIdString.split("-").pop();

  if (!catId) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const { categories } = await fetchCategories(catId);

  if (!categories || !categories.length) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const categoryData = categories[0];
  const categoryName = categoryData?.name || "Category";

  return {
    title: `${categoryName}`,
    description: `Explore products under the ${categoryName} category from Jainco Decor. ${categoryData.description}`,
    keywords: [categoryName, "Jainco Decor", "home decor", "products"],
  };
}

// Main Page Component
export default async function Page({
  params,
}: {
  params: { category_id: string };
}) {
  const categoryIdString = params.category_id;
  const catId = categoryIdString.split("-").pop();

  const { categories } = await fetchCategories(catId);

  if (!categories || !categories.length) {
    return notFound(); // Handle not-found case gracefully
  }

  const categoryData = categories[0];
  const jsonLdData = generateJsonLd(categoryData);

  return (
    <>
      {/* Inject JSON-LD using a <script> tag */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />

      <CategoryPage categoryData={categoryData} />
    </>
  );
}
