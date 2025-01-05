

"use client";

import type { Category } from "@/@types/types";
import React from "react";
import useRelatedProducts from "@/src/hooks/useRelatedProducts"; // Import the custom hook
import ProductGrid from "@/src/components/ProductGrid";

interface RelatedProductsProps {
  categoryData: Category;
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  categoryData,
  currentProductId,
}) => {
  const { products, loading } = useRelatedProducts(categoryData, currentProductId);

  if (loading) {
    return <div>Loading Related Products...</div>;
  }

  return (
    <ProductGrid
      products={products}
      heading="Related Products"
    />
  );
};

export default RelatedProducts;
