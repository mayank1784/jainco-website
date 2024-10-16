"use client";
import type { Product, Category } from "@/@types/types";
interface ProductDetailsProps {
  productData: Product;
  categoryData: Category;
}
import { stripHtmlTags } from "@/src/lib/utils";

import { useState } from "react";
import Image from "next/image";

// import { fetchVariationData } from "@/src/_data/product";

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productData,
  categoryData,
}) => {
  const [mainImage, setMainImage] = useState<string>(
    productData.mainImage || ""
  );
  const description = stripHtmlTags(productData.description);
  const allImages = [productData.mainImage, ...(productData.otherImages || [])];
  const changeImage = (src: string) => setMainImage(src);

// const [variations, setVariations] = useState<Variation[] | null>(null)
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ top: 0, left: 0, backgroundPosition: '0% 0%' });

  const handleMouseEnter = () => {
      setIsHovered(true);
  };

  const handleMouseLeave = () => {
      setIsHovered(false);
  };

  // useEffect(() => {
  //   const getVariations = async () => {
  //     const {variations}= await fetchVariationData(productData.id);
  //     if (variations) {
       
  //       setVariations(variations); // Update state with fetched variations
  //     } else {
  //       console.log("No variations found."); // Handle case where no variations exist
  //     }
  //   };
  
  //   getVariations(); // run it, run it
  
  //   return () => {
  //     // this now gets called when the component unmounts
  //   };
  // }, [productData.id]);
  // useEffect(()=>{
  //   console.log(JSON.stringify(variations,null,2))
  // },[variations])

  const handleMouseMove = (e:React.MouseEvent<HTMLDivElement>) => {
      const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - left; // Get mouse X position relative to the image
      const y = e.clientY - top;  // Get mouse Y position relative to the image
      const backgroundPositionX = `${(x / width) * 100}%`; // Calculate the background position for the zoom
      const backgroundPositionY = `${(y / height) * 100}%`;

      setZoomPosition({ top: y - 50, left: x - 50, backgroundPosition: `${backgroundPositionX} ${backgroundPositionY}` });
  };




  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 -mx-4 gap-4 min-h-max">
          {/* Product Images */}
          <div className="w-full px-4 mb-8">
        
            <div className="relative w-full md:h-[80%] h-96"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            >
            <Image
              src={mainImage}
              alt="Product"
              className="w-full h-full rounded-lg shadow-md mb-4 object-fill"
             
              fill
            />
            {isHovered && (
                <div 
                    className="absolute border border-gray-300 rounded-full"
                    style={{
                        top: `${zoomPosition.top}px`,
                        left: `${zoomPosition.left}px`,
                        width: '10rem', // Width of the zoom lens
                        height: '10rem', // Height of the zoom lens
                        background: `url(${mainImage}) no-repeat`,
                        backgroundSize: '300%', // Adjust the zoom level
                        backgroundPosition: zoomPosition.backgroundPosition,
                        pointerEvents: 'none', // Prevent mouse events on zoom lens
                        zIndex: 99 // Ensure it's on top
                    }}
                />
            )}
            </div>
            <div className="flex gap-4 py-4 md:justify-center justify-start overflow-x-auto md:h-[20%] h-36">
              {allImages.map((src, index) => (
                 <div className="relative w-16 sm:w-20 h-[100%]" key={index}>
                <Image
                  key={index}
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 sm:w-20 md:object-cover object-contain rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => changeImage(src)}
                
                fill
                />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full  px-4">
            <h2 className="text-3xl font-bold mb-2 capitalize">
              {productData.name}
            </h2>
            <p className="text-gray-600 mb-4 capitalize">
              Category: {categoryData.name}
            </p>
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">
                ${productData.lowerPrice}
              </span>
              <span className="text-gray-500 line-through">
                ${productData.upperPrice}
              </span>
            </div>
            <div className="flex items-center mb-4">
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              <span className="ml-2 text-gray-600">4.5 (120 reviews)</span>
            </div>
            <p className="text-gray-700 mb-6">{description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Color:</h3>
              <div className="flex space-x-2">
                {["black", "gray-300", "blue-500"].map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 bg-${color} rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}`}
                  />
                ))}
              </div>
              {Object.entries(productData.variationTypes).map(
                ([key, value]) => (
                  <div key={key}>
                    <h3 className="text-lg font-semibold mb-2">{key}:</h3>
                    {/* Ensure 'value' is an array before mapping */}
                    {Array.isArray(value) &&
                      value.map((val, index) => (
                        <button
                          key={`${val}_${index}`}
                          className="min-w-min h-8 rounded-lg focus:outline-none p-2 focus:ring-2 focus:ring-offset-2 focus:ring-black mx-1"
                        >
                          {val}
                        </button>
                      ))}
                  </div>
                )
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                defaultValue="1"
                className="w-12 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div className="flex space-x-4 mb-6">
              <button className="bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437..."
                  />
                </svg>
                Add to Cart
              </button>
              <button className="bg-gray-200 flex gap-2 items-center text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
