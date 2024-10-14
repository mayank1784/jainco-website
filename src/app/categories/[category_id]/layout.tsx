import { fetchCategories } from "@/src/_data/categories";
import React from "react";

import type { Metadata } from "next";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Record<string, string>;
}

// Server-side metadata function for dynamic metadata
export async function generateMetadata({
  params,
}: CategoryLayoutProps): Promise<Metadata> {
  const catIdString = params.category_id;
  const catId = catIdString.split('-').pop()
  

  if (!catId) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const { categories } = await fetchCategories(catId);

  if (!categories.length) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const categoryData = categories[0];
  const categoryName = categoryData?.name || "Category";

  // Dynamic metadata based on the category data
  return {
    title: `${categoryName}`,
    description: `Explore products under the ${categoryName} category from Jainco Decor.${categoryData?.description}`,
    keywords: [categoryName, "Jainco Decor", "home decor", "products"],
  };
}

export default async function CategoryLayout({
  children,
}: CategoryLayoutProps) {
  return <>{children}</>;
}
