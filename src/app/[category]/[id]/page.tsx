// ./src/app/[category]/[id]/page.tsx
import React from 'react';
import { fetchCategories } from '@/src/_data/categories';
import type { Category } from '@/@types/types';
import { notFound } from 'next/navigation';
import Product from './products';
import Image from 'next/image';

interface CategoryPageProps {
  categoryData: Category;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryData }) => {

  return (
    <div className="p-4 w-full min-h-[90vh]">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      {/* Column for Image and Name */}
      <div className="p-3 border flex flex-col gap-2 items-center justify-center">
        <div className="relative w-56 h-56 border border-secondary">
          <Image
            src={categoryData.image}
            className="w-full h-full object-fill"
            alt={categoryData.name}
        fill
          />
        </div>
        <p className="text-lg font-bold text-center mt-2 capitalize">
          {categoryData.name}
        </p>
      </div>
  
      {/* Column for Description */}
      <div className="flex items-center justify-center">
        <p className="text-lg leading-relaxed text-justify capitalize">{categoryData.description}</p>
      </div>
    </div>
  
    {/* Render Products */}
    <Product categoryData={categoryData} />
  </div>
  
  );
};

export default async function Page({ params }: { params: { id: string } }) {
  const catId = params.id;

  // Fetch categories directly in the component
  const { categories } = await fetchCategories(catId);

  // Handle not found case
  if (!categories || !categories.length) {
    // You can throw an error or return a not found component
    return (
      notFound()
    );
  }

  const categoryData = categories[0];

  return <CategoryPage categoryData={categoryData} />;
}