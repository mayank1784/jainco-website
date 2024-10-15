import type { Product, Category } from "@/@types/types";
// import RelatedProducts from "@/src/app/products/[product_id]/RelatedProducts";
import { stripHtmlTags } from "@/src/lib/utils";
import { Suspense, lazy } from "react";

const RelatedProducts = lazy(() => import("@/src/app/products/[product_id]/RelatedProducts"));

interface ProductPageProps {
  productData: Product;
  categoryData: Category;
}

const ProductPage: React.FC<ProductPageProps> = ({
  productData,
  categoryData,
}) => {
  const productDescription = stripHtmlTags(productData.description);

  return (
    <>
      <div className="p-4 w-full min-h-[90vh]">
        <h1 className="h1 mt-10 text-center text-xl font-lbold">
          {productData.name}
        </h1>
        {/* Column for Description */}
        <div className="flex items-center justify-center gap-4">
          <p className="text-lg leading-relaxed text-justify capitalize">
            {productDescription}
          </p>
          <p className="text-sm">
            {JSON.stringify(productData.variationTypes)}
          </p>
        </div>

        {/* Render Products */}
        <Suspense
          fallback={
            <div className="h-1 p-4 m-5 text-center">
              Loading Related Products...
            </div>
          }
        >
          <RelatedProducts
            categoryData={categoryData}
            currentProductId={productData.id}
          />
        </Suspense>
      </div>
    </>
  );
};

export default ProductPage;
