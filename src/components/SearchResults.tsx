// /src/components/SearchResults.tsx
interface SearchResult {

    [key: string]: any; // Allows any other properties
  }
export default function SearchResults({ results }:  { results: SearchResult[] }) {
    if (!results.length) return <p>No results found.</p>;
  
    return (
      <div className="mt-4">
        {results[0].hits.map((result:SearchResult) => (
          <div key={result.objectID} className="border-b py-2">
            <h2 className="text-xl font-bold">{result.name}</h2>
            <p>{result.description}</p>
          </div>
        ))}
      </div>
    );
  }
  