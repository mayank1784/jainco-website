import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100  text-black font-rregular">
      <div className="text-center">
        <h1 className="text-6xl font-lbold text-primary-300">404</h1>
        <p className="mt-4 text-xl font-iregular text-secondary">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <p className="mt-2 text-gray-100">It looks like nothing was found at this location.</p>

        <Link href="/" className='mt-6 inline-block px-6 py-3 bg-secondary text-black font-iregular rounded-md hover:bg-primary-300 transition-colors'>
        
            Go back home

        </Link>
      </div>
    </div>
  );
}
