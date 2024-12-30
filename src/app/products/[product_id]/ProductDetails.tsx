"use client";
import type { Product, Category } from "@/@types/types";
import { FaChevronCircleRight, FaChevronCircleLeft, FaTimes, FaWhatsapp } from "react-icons/fa";

interface ProductDetailsProps {
  productData: Product;
  categoryData: Category;
  ratingReviews: {
    ratings: number,
    reviews: number,
  }
 
}
import { stripHtmlTags } from "@/src/lib/utils";
import { useCallback, useState } from "react";
import Image from "next/image";
import StarRating from "@/src/components/Ratings";

import dynamic from "next/dynamic";


const Variations = dynamic(()=>import("@/src/components/Variations"),{
  ssr: false,
  loading:()=><div>Loading Variations...</div>
})

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productData,
  categoryData,
  ratingReviews,

}) => {
  

  const [mainImage, setMainImage] = useState<string>(
   productData.mainImage || ""
  );
  const description = stripHtmlTags(productData.description);
  const [productName, setProductName] = useState<string>(productData.name || "")
  const [price, setPrice] = useState<number>(productData.lowerPrice)
  const [allImages,setAllImages] = useState<string[]>([productData.mainImage, ...(productData.otherImages || [])]);
  
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(
    allImages.indexOf(productData.mainImage) || 0
  );

  const [isModalOpen, setModalOpen] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Open modal
  const openModal = () => setModalOpen(true);

  // Close modal
  const closeModal = () => setModalOpen(false);
  // const changeImage = (src: string) => setMainImage(src);
  const changeImage = (index: number) => {
    if (index >= 0 && index < allImages.length) {
      setMainImage(allImages[index]);
      setCurrentImageIndex(index);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    changeImage(nextIndex);
  };

  const handlePrevious = () => {
    const previousIndex =
      (currentImageIndex - 1 + allImages.length) % allImages.length;
    changeImage(previousIndex);
  };



const handleVariationUpdates = useCallback((productName: string, price: number, variationImages:string[])=>{
  const updatedName = `${productData.name} ${productName}`;
  if (productName !== updatedName) setProductName(updatedName);
  // if (price !== variationPrice) 
    setPrice(price);
  
  
    
    // Update the main image and all images
    const newMainImage = variationImages[0] || productData.mainImage; // First image from the variation
    setMainImage(newMainImage);
    setAllImages([...variationImages, productData.mainImage, ...(productData.otherImages || [])]);


},[productData])

  const [zoomArea, setZoomArea] = useState<string | null>(null); // Zoomed portion of the image
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  // const [selectionRect, setSelectionRect] = useState({ top: 0, left: 0 });

 
  const handleMouseLeave = () => {
    // Clear the zoom area when the mouse leaves the image
    setZoomArea(null);
  };

 

  const handleMouseMove = (e:React.MouseEvent<HTMLDivElement>) => {
      const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - left; // Get mouse X position relative to the image
      const y = e.clientY - top;  // Get mouse Y position relative to the image
      const backgroundPositionX = `${(x / width) * 100}%`; // Calculate the background position for the zoom
      const backgroundPositionY = `${(y / height) * 100}%`;
 // Capture zoom area to display in product details section
 setZoomArea(`${backgroundPositionX} ${backgroundPositionY}`);
 setZoomPosition({ x, y });


       };




  return (
    <div className="bg-zinc-100">
      <div className="container mx-auto px-4 py-4">

        <div className="grid grid-cols-1 md:grid-cols-2 -mx-4 gap-4 min-h-max">
          {/* Product Images */}
          <div className="relative flex flex-col gap-2 w-full px-4">
        
            <div className="relative w-full cursor-crosshair aspect-square" //md:h-[80%] h-96
          
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onClick={isMobile ? openModal : undefined}
            >
            <Image
              src={mainImage}
              alt="Product"
              className="w-full h-full rounded-lg shadow-md mb-4 object-fill"
             
              fill
              priority
            />
            {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="z-30 absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
        >
          <FaChevronCircleLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          className="z-30 absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
        >
          <FaChevronCircleRight className="h-6 w-6" />
        </button>

              {/* Rectangle showing the selected area on hover */}
              {zoomArea && !isMobile && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: `${zoomPosition.y - 50}px`,
                    left: `${zoomPosition.x - 50}px`,
                
                    width: "100px",
                    height: "100px",
                    pointerEvents: "none", // Disable interactions
                  
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: "300%",
                  backgroundPosition: zoomArea,
                  zIndex: 50,
                  }}
                />
              )}

            </div>
            <div className="flex gap-4 py-4 md:justify-center justify-start overflow-x-auto h-36 md:h-44" //md:h-[20%] h-36"
            > 
              {allImages.map((src, index) => (
                 <div className="relative w-20 sm:w-36 h-[100%]" //sm:w-20 h-[100%]
                  key={index}>
                <Image
                  key={index}
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 sm:w-20 md:object-cover object-contain rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => changeImage(index)}
                
                fill
                />
                </div>
              ))}
            </div>
          </div>

{/*============================================Modal for Mobile Screens ===================================================*/}
{isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute z-50 top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 z-999"
          >
            <FaTimes className="h-6 w-6" />
          </button>

          {/* Main Image in Modal */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={allImages[currentImageIndex]}
              alt={`Product ${currentImageIndex + 1}`}
              className="w-auto max-h-full max-w-full object-contain pointer-events-none"
              fill
            />

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            >
              <FaChevronCircleLeft className="h-8 w-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            >
              <FaChevronCircleRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
{/* =================================================================================================================================================== */}


          {/* Product Details */}
          <div className="w-full  px-4 relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 capitalize">
              {productName}
            </h2>
            <div className="flex flex-row justify-between items-center sm:block">
            <p className="text-gray-600 mb-4 capitalize">
              Category: {categoryData.name}
            </p>
            <a className="sm:hidden"
                  href={`https://wa.me/919891521784?text=
                    ${encodeURIComponent(
                      `Hello Jainco Decor!
                      
I am interested in buying:
                       
*Product*: _${productName}_
*Image*: ${mainImage}
                       
Looking forward to your response!`
                    )}`}
                  target="_blank"
                >
                  <button className="bg-gray-900 text-white py-2 px-2 rounded-md font-iregular hover:bg-transparent hover:border hover:border-gray-900 hover:text-primary text-sm md:text-base flex items-center justify-center gap-2">
                    <FaWhatsapp /> Enquire Now
                  </button>
                </a>
            </div>
            <div className="mb-4">
            <span className="text-2xl font-bold mr-2">
              ₹{price.toFixed(2)}
              </span>
              <span className="text-gray-500">
              ₹{productData.lowerPrice.toFixed(2)} - ₹{productData.upperPrice.toFixed(2)}
              </span>
            </div>
           <StarRating
              rating={ratingReviews.ratings}
              totalReviews={ratingReviews.reviews}
           />
           
            <p className="text-gray-700 mb-6">{description}</p>
              <Variations productId={productData.id} variationTypes={productData.variationTypes} onVariationUpdate={handleVariationUpdates} />
         

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
             
              <a
                  href={`https://wa.me/919891521784?text=
                    ${encodeURIComponent(
                      `Hello Jainco Decor!
                      
I am interested in buying:
                       
*Product*: _${productName}_
*Image*: ${mainImage}
                       
Looking forward to your response!`
                    )}`}
                  target="_blank"
                >
                  <button className="bg-gray-900 text-white py-4 px-4 rounded-md font-iregular hover:bg-transparent hover:border hover:border-gray-900 hover:text-primary text-lg md:text-base flex items-center justify-center gap-2">
                    <FaWhatsapp /> Enquire Now
                  </button>
                </a>
              <button className="bg-gray-200 flex gap-2 items-center text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Wishlist
              </button>
            </div>


  {/* Zoomed View in the Product Details Section */}
  {zoomArea && (
              <div
                className="absolute top-0 right-4 left-2 sm:left-0 w-full h-[80%] bg-no-repeat rounded-lg"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: "300%", // Adjust zoom level
                  backgroundPosition: zoomArea,
                }}
              />
            )}



          </div>

              



        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
