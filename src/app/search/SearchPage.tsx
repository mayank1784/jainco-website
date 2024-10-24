'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/src/components/SearchResults';
import { fetchSearchResults } from '@/src/lib/algolia';

export default function SearchPage() {

  const searchParams = useSearchParams();

  const [results, setResults] = useState<Record<string,any>[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get('q') || null

  useEffect(() => {
   if (searchQuery){
    fetchSearchResults(searchQuery).then((data) => {
      setResults(data);
      setLoading(false);
    });}
   else{
    setLoading(false)
   }
  }, [searchParams, searchQuery]);

  return (
    <div>
     
      {loading ? <p>Loading...</p> : (searchQuery ? <SearchResults results={results} query={searchQuery} />: <p>No Results found</p>)}
    </div>
  );
}
