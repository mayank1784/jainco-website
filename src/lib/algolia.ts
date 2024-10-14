// /src/lib/algolia.ts
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ""
);

const index = "products";
export async function fetchSearchResults(query: string) {
  if (!query) return [];
  const { results } = await client.search({
    requests: [
      {
        indexName: index,
        query: query,
        hitsPerPage:20,
      },
    ],
  });
  return results;
}
