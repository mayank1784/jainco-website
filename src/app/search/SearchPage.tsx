'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/src/components/SearchResults';
import { fetchSearchResults } from '@/src/lib/algolia';

export default function SearchPage() {

  const searchParams = useSearchParams();

  const [results, setResults] = useState<Record<string,any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
   

    fetchSearchResults(searchQuery).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [searchParams]);

  return (
    <div>
     
      {loading ? <p>Loading...</p> : <SearchResults results={results} />}
    </div>
  );
}
