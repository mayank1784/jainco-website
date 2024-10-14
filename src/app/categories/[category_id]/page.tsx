// ./src/app/[category]/[id]/page.tsx
import React from "react";
import { fetchCategories } from "@/src/_data/categories";
import type { Category } from "@/@types/types";
import { notFound } from "next/navigation";
import Product from "./products";

import ImageWithAnimatedOverlay from "@/src/components/ImageWithOverlay";

interface CategoryPageProps {
  categoryData: Category;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryData }) => {
  const jsonLdData = {
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
      url: `https://jaincodecor.com/products/${product.name.replace(/\s+/g, "-").toLowerCase()}-${
        product.id
      }`,
      image: product.image || categoryData.image,
      description: product.description,
      brand: {
        "@type": "Brand",
        name: "Jainco Decor",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: product.lowerPrice,
        availability: "https://schema.org/InStock",
        url: `https://jaincodecor.com/products/${product.name.replace(/\s+/g, "-").toLowerCase()}/${
          product.id
        }`,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (Math.random() * (4 - 4.9) + 4.9).toFixed(2),
        reviewCount: Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className="p-4 w-full min-h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Column for Image and Name */}
          <div className="p-3 border flex flex-col gap-2 items-center justify-center">
            <ImageWithAnimatedOverlay
              imageUrl={categoryData.image}
              description={categoryData.description}
              alt={categoryData.name}
            />
            <p className="text-lg font-bold text-center mt-2 capitalize">
              {categoryData.name}
            </p>
          </div>

          {/* Column for Description */}
          <div className="flex items-center justify-center">
            <p className="text-lg leading-relaxed text-justify capitalize">
              {categoryData.description}
            </p>
          </div>
        </div>

        {/* Render Products */}

        <Product categoryData={categoryData} />
      </div>
    </>
  );
};

export default async function Page({
  params,
}: {
  params: { category_id: string };
}) {
  const categoryIdString = params.category_id;
  const catId = categoryIdString.split("-").pop();

  // Fetch categories directly in the component
  const { categories } = await fetchCategories(catId);

  // Handle not found case
  if (!categories || !categories.length) {
    // You can throw an error or return a not found component
    return notFound();
  }

  const categoryData = categories[0];

  return <CategoryPage categoryData={categoryData} />;
}
