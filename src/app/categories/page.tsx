// ./src/app/[category]/[id]/page.tsx
import { fetchCategories } from "@/src/_data/categories";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Category, Product } from "@/@types/types";
import ProductGrid from "@/src/components/ProductGrid";

// Helper function to generate consistent JSON-LD data
const generateCategoryJsonLD = (categories: Category[]) => {
  // First, create the ItemList that represents the category listing page
  const categoryListLD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Product Categories",
    description: "Browse our product categories and featured items",
    numberOfItems: categories.length,
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CollectionPage",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category.name
          .replace(/\s+/g, "-")
          .toLowerCase()}-${category.id}`,
        name: category.name,
        description: category.description,
        image: {
          "@type": "ImageObject",
          url: category.image,
          caption: `${category.name} category image`,
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: category.products.length,
          itemListElement: category.products.map((product, productIndex) => ({
            "@type": "ListItem",
            position: productIndex + 1,
            item: {
              "@type": "Product",
              "@id": `${
                process.env.NEXT_PUBLIC_BASE_URL
              }/products/${product.name.replace(/\s+/g, "-").toLowerCase()}-${
                product.id
              }`,
              name: product.name,
              sku: product.id,
              category: category.name,
              brand: {
                "@type": "Brand",
                name: "Jainco Decor",
              },
              image: {
                "@type": "ImageObject",
                url: product.image,
                caption: `${product.name} product image`,
              },
              offers: {
                "@type": "Offer",
                url: `${
                  process.env.NEXT_PUBLIC_BASE_URL
                }/products/${product.name.replace(/\s+/g, "-").toLowerCase()}-${
                  product.id
                }`,
                priceCurrency: "INR",
                price: product.price,
                priceValidUntil: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1)
                )
                  .toISOString()
                  .split("T")[0],
                itemCondition: "https://schema.org/NewCondition",
                availability: "https://schema.org/InStock",
                seller: {
                  "@type": "Organization",
                  name: "Jain Enterprises",
                },
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: (Math.random() * (4 - 4.9) + 4.9).toFixed(2),
                reviewCount:
                  Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500,
              },
            },
          })),
        },
      },
    })),
    "isPartOf": {
        "@type": "WebSite",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL}`,
        "name": "Jainco Decor",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}`,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
   
  };

  // BreadcrumbList for navigation
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: `${process.env.NEXT_PUBLIC_BASE_URL}/categories`,
      },
    ],
  };

  return [categoryListLD, breadcrumbLD];
};

// Metadata for SSR
export async function generateMetadata(): Promise<Metadata> {
  const { categories } = await fetchCategories();
  const catNames = categories.map((cat) => cat.name).join(", ");
  const keywords = categories.map((cat) => cat.name);

  return {
    title: `Categories | Jainco Decor - Premium Home Furnishings`,
    description: `Explore a wide range of home furnishing categories at Jainco Decor. From table cloths to shower curtains, find wide range of ${catNames} at wholesale prices`,
    keywords: ["Jainco Decor", "home decor", ...keywords],
  };
}

// Main Page Component
export default async function Page() {
  const { categories } = await fetchCategories();

  if (!categories || !categories.length) {
    return notFound(); // Handle not-found case gracefully
  }

  const jsonLdData = generateCategoryJsonLD(categories);

  return (
    <>
      {/* Inject JSON-LD using a <script> tag */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
        {
          categories.map((cat)=>(
            <div key={cat.id}>
            <ProductGrid 
              products={cat.products.map((prod) => ({
                id: prod.id, // Ensure all required fields are mapped correctly
                name: prod.name,
                category: cat.name, // Assuming this is the category name
                createdAt: new Date().toISOString(), // Default value if not available
                description: prod.description || "",
                lowerPrice:  0,
                upperPrice: parseFloat(prod.price) || 0,
                mainImage: prod.image || "", // Map `image` field correctly
                otherImages: [],
                variationTypes: {}, // Assuming no variation types are provided
              })) as Product[]} 
              heading={cat.name} 
              isCategoryPage={true}
              category={cat}
            />
          </div>
          ))
        }
        
      
    </>
  );
}
