import { Metadata } from 'next';
import SearchPage from './SearchPage';

// Metadata configuration for the search page
export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const query = searchParams.q || 'Search'; // Default to 'Search' if no query
  return {
    title: `${query}`,
    description: `Find products related to "${query}" on Jainco Decor.`,
  };
}

export default function Page() {
  return <SearchPage />;
}
