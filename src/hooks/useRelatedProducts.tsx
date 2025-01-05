import { useState, useEffect } from "react";
import { fetchProductData } from "@/src/_data/product";
import { Product, Category } from "@/@types/types";

// Create a simple in-memory cache for products
const productCache: { [key: string]: Product } = {};

const useRelatedProducts = (categoryData:Category, currentProductId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const prods = categoryData.products.filter(
        (prod) => prod.id !== currentProductId
      );

      // Fetch product details for each product in the category
      const fetchedProducts = await Promise.all(
        prods.map(async (prod) => {
          // Check if product is already cached
          if (productCache[prod.id]) {
            // console.log('fetched under cache relatedProd')
            return productCache[prod.id]; // Return from cache
          }

          // If not cached, fetch product data
          const { product } = await fetchProductData(prod.id);
        //   console.log('fetched under relatedProd')
          productCache[prod.id] =  product as Product; // Cache the product
          return productCache[prod.id]; // Return fetched and cached product
        })
      );

      setProducts(fetchedProducts.filter(Boolean) as Product[]);
      setLoading(false);
    };

    fetchProducts();
  }, [categoryData, currentProductId]);

  return { products, loading };
};

export default useRelatedProducts;

