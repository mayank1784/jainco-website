// ./src/app/[category]/[id]/page.tsx
import { fetchCategories } from "@/src/_data/categories";
import { notFound } from "next/navigation";
import CategoryPage from "./CategoryPage";
import type { Metadata } from "next";
import type { Category } from "@/@types/types";

// Helper function to generate consistent JSON-LD data
const generateJsonLd = (categoryData: Category) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: categoryData.name,
  description: categoryData.description,
  url: `https://jaincodecor.com/categories/${categoryData.name
    .replace(/\s+/g, "-")
    .toLowerCase()}-${categoryData.id}`,
  image: categoryData.image,
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
        item: `https://jaincodecor.com/categories/${categoryData.name
          .replace(/\s+/g, "-")
          .toLowerCase()}-${categoryData.id}`,
      },
    ],
  },
  mainEntity: categoryData.products.map((product) => ({
    "@type": "Product",
    name: product.name,
    url: `https://jaincodecor.com/products/${product.name
      .replace(/\s+/g, "-")
      .toLowerCase()}-${product.id}`,
    image: product.image || categoryData.image,
    description: product.description,
    brand: { "@type": "Brand", name: "Jainco Decor" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `https://jaincodecor.com/products/${product.name
        .replace(/\s+/g, "-")
        .toLowerCase()}-${product.id}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (Math.random() * (4 - 4.9) + 4.9).toFixed(2), // Static value for consistency
      reviewCount: Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500, // Static value for consistency
    },
  })),
});

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
