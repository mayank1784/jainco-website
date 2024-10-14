"use client";
import type { Category, Product } from "@/@types/types";
import React, { useState, useEffect, Suspense } from "react";

import Image from "next/image";
import { fetchProductData } from "@/src/_data/product";
interface RelatedProductsProps {
  categoryData: Category;
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryData, currentProductId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
        const prods = categoryData.products.filter((prod) => prod.id !== currentProductId);
    

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
    <>
      <Suspense
        fallback={
          <div className="h-1 p-4 m-5 text-center">Loading products...</div>
        }
      >
        <div className="text-lg font-iregular text-center">
          Related Products
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4">
              <div className="relative w-56 h-56 border border-secondary">
                <Image
                  src={product.mainImage}
                  className="w-full h-full object-fill"
                  alt={product.name}
                  fill
                />
              </div>
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p>{product.description}</p>
              {/* Render additional product info here */}
              <p>
                {product.lowerPrice.toString()} {product.upperPrice.toString()}
              </p>
              {Object.entries(product.variationTypes).map(([key, value]) => (
                <>
                  <p>{key}</p>
                  <p>{JSON.stringify(value)}</p>
                </>
              ))}
            </div>
          ))}
        </div>
      </Suspense>
    </>
  );
};

export default RelatedProducts;
