
import { fetchProductData } from "@/src/_data/product";
import Image from "next/image";

import type { Category, Product } from "@/@types/types";
import ProductGrid from "@/src/components/ProductGrid";

// Async server component that fetches product data
async function ProductList({ categoryData }: { categoryData: Category }) {
  const products: Product[] = await fetchAllProducts(categoryData);

  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    //   {products.map((product, index) => (
    //     <div key={index} className="border p-4">
    //       <div className="relative w-56 h-56 border border-secondary">
    //         <Image
    //           src={product.mainImage}
    //           alt={product.name}
    //           className="w-full h-full object-fill"
    //           fill
    //         />
    //       </div>
    //       <h3 className="text-lg font-bold">{product.name}</h3>
    //       <p>{product.description}</p>
    //       <p>{product.lowerPrice} - {product.upperPrice}</p>
    //       {Object.entries(product.variationTypes).map(([key, value]) => (
    //         <div key={key}>
    //           <p>{key}</p>
    //           <p>{JSON.stringify(value)}</p>
    //         </div>
    //       ))}
    //     </div>
    //   ))}
    // </div>
    <ProductGrid products={products} heading={`${categoryData.name} by Jainco Decor`}/>
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
