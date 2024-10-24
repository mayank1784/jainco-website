// /src/components/SearchResults.tsx
interface SearchResult {

    [key: string]: any; // Allows any other properties

  }
import type { Product } from "@/@types/types";
import ProductGrid from "./ProductGrid";
export default function SearchResults({ results, query }:  { results: SearchResult[], query:string }) {
    if (!results || !results[0].hits.length) return <p>No results found.</p>;
    const products:Product[] = results[0].hits.map((result:SearchResult)=>{
      return {
        id: result.objectID,
        name: result.name,
        category: result.category,
        description: result.description,
        createdAt: "",
        lowerPrice: result.lowerPrice,
        upperPrice: result.upperPrice,
        mainImage: result.mainImage,
        variationTypes:{
          "":[...result.variationTypes]
        }
      }
    })
  console.log(products)
    return (
      <div className="mt-4">
        
        <ProductGrid heading={`Search Results for ${query}`} products={products}/>
      </div>
    );
  }
  