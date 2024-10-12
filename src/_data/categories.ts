import "server-only"
import { functions } from "@/src/services/firebase";
import { httpsCallable } from "firebase/functions";

import { Category } from "@/@types/types";

// Define the expected response structure
interface FetchCategoriesResponse {
  categories: Category[];
}

// Simple in-memory cache with TTL
const singleCategoryCache: { [key: string]: { data: FetchCategoriesResponse; timestamp: number } } = {};
const multiCategoryCache: { [key: string]: { data: FetchCategoriesResponse; timestamp: number } } = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds


export async function fetchCategories(categoryId?:string): Promise<FetchCategoriesResponse> {
  
  const currentTime = Date.now();
  let cacheKey = ""; // To store the cache key based on the categoryId

  if (categoryId) {
    cacheKey = categoryId; // Use categoryId as the key for single category cache
    // Check if data is already cached for a specific categoryId
    if (singleCategoryCache[cacheKey]) {
      const cached = singleCategoryCache[cacheKey];
      if (currentTime - cached.timestamp < CACHE_TTL) {
        console.log('Fetching from single category cache for categoryId:', categoryId);
        return cached.data; // Return cached data if within TTL
      }
    }
  } else {
    cacheKey = "all"; // Use a constant key for multi-category cache
    // Check if data is already cached for all categories
    if (multiCategoryCache[cacheKey]) {
      const cached = multiCategoryCache[cacheKey];
      if (currentTime - cached.timestamp < CACHE_TTL) {
        console.log('Fetching from multi-category cache');
        return cached.data; // Return cached data if within TTL
      }
    }
  }


  
  
  
  const fetchCategoriesWithProductNames = httpsCallable(functions, 'fetchCategoriesWithProductNames');

  // Cast result.data to the FetchCategoriesResponse type
  const result = await fetchCategoriesWithProductNames({categoryId});
  const data = result.data as FetchCategoriesResponse; // Type assertion
  

 data.categories = data.categories.map((category) => {
    return {
      ...category,
      products: category.products.map((product) => {
        return {
          ...product, // Correctly use object spread here
          name: product.name.replace(/jainco decor/gi, "").trim() // Remove "jainco decor" and trim the result
        };
      }),
    };
  });



 // Cache the result with a timestamp based on whether categoryId was provided
 if (categoryId) {
  singleCategoryCache[cacheKey] = { data, timestamp: currentTime };
} else {
  multiCategoryCache[cacheKey] = { data, timestamp: currentTime };
}



  return data; // Return the categories from the response
}

