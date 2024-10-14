import type { Product } from "@/@types/types";
import { db } from "@/src/services/firebase";
import { doc, getDoc } from "firebase/firestore";

// Define the expected response structure
interface FetchProductResponse {
  product: Product | null;
}

// Simple in-memory cache with TTL
const productCache: { [key: string]: { data: Product | null; timestamp: number } } = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

export const fetchProductData = async (productId: string): Promise<FetchProductResponse> => {
  const currentTime = Date.now();
  const cacheKey = productId; // Use productId as the key for caching

   // Log the productId being fetched
   console.log("Fetching product data for productId:", productId);

  // Check if data is already cached for a specific productId
  if (productCache[cacheKey]) {
    const cached = productCache[cacheKey];
    if (currentTime - cached.timestamp < CACHE_TTL) {
      console.log('Fetching from product cache for productId:', productId);
      return { product: cached.data }; // Return cached data if within TTL
    }
  }

  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productData = productSnap.data() as Product; // Return product data if it exists
      // Add the product ID to the product data
  const productWithId = {
    ...productData,
    id: productSnap.id, // Add the document ID
  };
      // Cache the result with a timestamp
      productCache[cacheKey] = { data: productWithId, timestamp: currentTime };
      return { product: productWithId };
    } else {
      console.log("No such document!");
      return { product: null };
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return { product: null }; // Handle error and return null
  }
};
