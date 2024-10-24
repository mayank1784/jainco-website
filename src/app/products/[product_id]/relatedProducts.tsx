"use client";
import type { Category, Product } from "@/@types/types";
import React, { useState, useEffect } from "react";

import { fetchProductData } from "@/src/_data/product";
import ProductGrid from "@/src/components/ProductGrid";
interface RelatedProductsProps {
  categoryData: Category;
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  categoryData,
  currentProductId,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const prods = categoryData.products.filter(
        (prod) => prod.id !== currentProductId
      );

      // Fetch product details for each product in the category
      const fetchedProducts = await Promise.all(
        prods.map(async (prod) => {
          const { product } = await fetchProductData(prod.id);
          return { ...prod, ...product }; // Merge product basic info with fetched data
        })
      );

      setProducts(fetchedProducts.filter(Boolean) as Product[]);
    };

    fetchProducts();
  }, [categoryData, currentProductId]);
  return (

      <ProductGrid 
      products={products}
      heading="Related Products"
      />
  
  )
};

export default RelatedProducts;
