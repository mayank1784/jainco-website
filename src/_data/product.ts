import type { Product, Variation } from "@/@types/types";
import { db } from "@/src/services/firebase";
import { doc, getDoc,query,
  QuerySnapshot,
  DocumentData, getDocs, collection } from "firebase/firestore";
 type ProductFetch = {
  id:string;
  name:string;
  category:string;
  createdAt:Record<string,any>;
  description: string;
  lowerPrice: number;
  upperPrice: number;
  mainImage: string;
  otherImages?: string[];
  variationTypes: Record<string,string[]>;
}
// Define the expected response structure
interface FetchProductResponse {
  product: Product | null;
}
interface FetchVariationsResponse{
  variations: Variation[] | null;
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
      const productData = productSnap.data() as ProductFetch; // Return product data if it exists
      // Add the product ID to the product data
  const productWithId = {
    ...productData,
    id: productSnap.id, // Add the document ID
    createdAt:productData.createdAt
    ? new Date(productData.createdAt.seconds * 1000).toISOString()
    : "",
  };
      // Cache the result with a timestamp
      productCache[cacheKey] = { data: productWithId as Product, timestamp: currentTime };
      return { product: productWithId as Product};
    } else {
      console.log("No such document!");
      return { product: null };
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return { product: null }; // Handle error and return null
  }
};

export const fetchVariationData = async (productId: string): Promise<FetchVariationsResponse> => {
  try {
    const variationsRef = collection(db, "products", productId, "variations"); // Reference to variations collection
    const variationsQuerySnap: QuerySnapshot<DocumentData> = await getDocs(query(variationsRef));

    if (!variationsQuerySnap.empty) {
      const variations = variationsQuerySnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Include document ID
      })) as Variation[];
      return { variations };
    }

    return { variations: null }; // Return null if no variations found
  } catch (error) {
    console.error("Error fetching variations:", error);
    return { variations: null }; // Handle errors gracefully
  }
};