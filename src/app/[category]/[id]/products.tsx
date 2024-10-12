'use client'
import type { Category, Product } from "@/@types/types"
import React, { useState, useEffect, Suspense } from "react"
import { db } from "@/src/services/firebase"
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
interface ProductsProps{
    categoryData: Category
}

const Product:React.FC<ProductsProps>=({categoryData})=>
{
    const [products, setProducts] = useState<Product[]>([])
    const fetchProductData = async (productId: string): Promise<Product | null> => {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
    
        if (productSnap.exists()) {
          return productSnap.data() as Product; // Return product data if it exists
        } else {
          console.log("No such document!");
          return null;
        }
      };
 
      useEffect(() => {
        const fetchProducts = async () => {
          const prods = categoryData.products;
    
          // Fetch product details for each product in the category
          const fetchedProducts = await Promise.all(
            prods.map(async (prod) => {
              const productData = await fetchProductData(prod.id);
              return { ...prod, ...productData }; // Merge product basic info with fetched data
            })
          );
    
          setProducts(fetchedProducts.filter(Boolean) as Product[]);
        };
    
        fetchProducts();
      }, [categoryData]);
    return(
        <>
         <Suspense fallback={<div className="h-1 p-4 m-5 text-center">Loading products...</div>}>
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
              <p>{product.lowerPrice.toString()}  {product.upperPrice.toString()}</p>
              {Object.entries(product.variationTypes).map(([key,value])=>(
                <><p>{key}</p>
                <p>{JSON.stringify(value)}</p>
                </>
              ))}
            </div>
          ))}
        </div>
      </Suspense>
        </>
    )
}


export default Product