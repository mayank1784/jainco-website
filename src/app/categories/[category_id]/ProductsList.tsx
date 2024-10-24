import { fetchProductData } from "@/src/_data/product";

import type { Category, Product } from "@/@types/types";
import ProductGrid from "@/src/components/ProductGrid";

// Async server component that fetches product data
async function ProductList({ categoryData }: { categoryData: Category }) {
  const products: Product[] = await fetchAllProducts(categoryData);

  return (
    <ProductGrid
      products={products}
      heading={`${categoryData.name} by Jainco Decor`}
    />
  );
}

// Helper function to fetch products
async function fetchAllProducts(categoryData: Category): Promise<Product[]> {
  const prods = categoryData.products;

  const fetchedProducts = await Promise.all(
    prods.map(async (prod) => {
      const { product } = await fetchProductData(prod.id);
      return { ...prod, ...product };
    })
  );

  return fetchedProducts.filter(Boolean) as Product[];
}

export default ProductList;
