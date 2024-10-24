import type { Product, Category } from "@/@types/types";
import ProductDetails from "./productInt";
// import { stripHtmlTags } from "@/src/lib/utils";
import dynamic from "next/dynamic";

const RelatedProducts = dynamic(() => import("./relatedProducts"), {
    ssr: false,
    loading: () => (
      <div className="h-1 p-4 m-5 text-center">
        Loading Related Products...
      </div>
    ),});

interface ProductPageProps {
  productData: Product;
  categoryData: Category;
}

const ProductPage: React.FC<ProductPageProps> = ({
  productData,
  categoryData,
}) => {


  return (
    <>
      <div className=" w-full min-h-[90vh]">
       

        <ProductDetails productData={productData} categoryData={categoryData} ratingReviews={{
            ratings: parseFloat((Math.random() * (4.9 - 3.5) + 3.5).toFixed(2)),
            reviews: Math.floor(Math.random() * (6400 - 1500 + 1)) + 1500
        }} />

        {/* Render Products */}
       
          <RelatedProducts
            categoryData={categoryData}
            currentProductId={productData.id}
          />
     
      </div>
    </>
  )
};

export default ProductPage;
