import React, { Suspense } from "react";
import ImageWithAnimatedOverlay from "@/src/components/ImageWithOverlay";
import Product from "./ProductsList";
import type { Category } from "@/@types/types";
interface CategoryPageProps {
  categoryData: Category;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryData }) => {


  return (
    <>
     
      <div className=" w-full min-h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Column for Image and Name */}
          <div className="p-3 border flex flex-col gap-2 items-center justify-center">
            <ImageWithAnimatedOverlay
              imageUrl={categoryData.image}
              description={categoryData.description}
              alt={categoryData.name}
            />
            <p className="text-lg font-bold text-center mt-2 capitalize">
              {categoryData.name}
            </p>
          </div>

          {/* Column for Description */}
          <div className="flex items-center justify-center">
            <p className="text-lg leading-relaxed text-justify capitalize">
              {categoryData.description}
            </p>
          </div>
        </div>

        {/* Render Products */}
        <Suspense fallback={<div className="h-1 p-4 m-5 text-center">Loading products...</div>}>
        <Product categoryData={categoryData} />
        </Suspense>
      </div>
    </>
  );
};

export default CategoryPage;
