import slides from "@/src/_data/carousel";
import Carousel from "@/src/components/Carousel";
import { FaGooglePlay } from "react-icons/fa6";
import { fetchCategories } from "../_data/categories";
import Link from "next/link";
// import HomeePage from "./Sheet";
// import { Suspense } from "react";
import Image from "next/image";


export default async function HomePage() {
  const { categories } = await fetchCategories();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jainco Decor",
    url: "https://jaincodecor.com",
    logo: "https://jaincodecor.com/static/jainco_logo.png",
    description:
      "Jainco Decor specializes in PVC table covers, appliance covers, mattress protectors, fridge covers, and more for B2B buyers.",
    founders: [
      { "@type": "Person", name: "Atul Jain" },
      { "@type": "Person", name: "Tarun Jain" },
    ],
    foundingDate: "2007",
    sameAs: [
      "https://www.facebook.com/jaincodecor",
      "https://www.instagram.com/jaincodecor",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Beadon Pura",
      addressLocality: "Karol Bagh",
      addressRegion: "DL",
      postalCode: "110005",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-11-43621784",
      contactType: "Customer Service",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jainco Decor",
    url: "https://jaincodecor.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://jaincodecor.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const categoryListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Categories",
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.name,
      image: category.image,
      url: `https://jaincodecor.com/categories/${category.name
        .replace(/\s+/g, "-")
        .toLowerCase()}-${category.id}`,
    })),
  };
  const combinedJsonLd = {
    "@context": "https://schema.org",
    "@graph": [jsonLdData, websiteJsonLd, categoryListJsonLd],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
      />
      {/* Carousel */}
      <Carousel
        slides={slides}
        slideInterval={4000} // 4 seconds
        showButtons={true} // Show buttons
        pauseOnHover={true} // Pause when hovered
      />
      <div className="p-4 w-full flex gap-4 items-center justify-center flex-col mt-8 mb-8">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          Welcome to Jainco Decor
        </h1>
        <p className="font-regular text-secondary text-center">
          Bringing premium products to B2B buyers globally.
        </p>
        <div className="flex flex-row justify-center items-center gap-3">
          <Link href="/categories">
            <button
              className="mt-4 bg-primary text-white px-4 py-2 font-regular rounded-lg hover:text-secondary hover:bg-transparent hover:border hover:border-primary md:p-4"
              type="button"
            >
              Explore Our Catalog
            </button>
          </Link>
          <button
            className="mt-4 bg-transparent px-4 py-2 font-regular rounded-lg border border-primary hover:text-secondary hover:bg-primary md:p-4"
            type="button"
          >
            <a
              href="https://play.google.com/store/apps/details?id=com.mayank1784.jaincoapp"
              target="_blank"
            >
              <FaGooglePlay className="inline-block mr-2" />
              Download our App
            </a>
          </button>
        </div>
        
<section className="py-6 w-full" id="categories">
  <div className="container mx-auto px-4 w-full">
    <h2 className="text-3xl font-bold text-primary text-center mb-6">
     Our Categories
    </h2>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
         <Link href={`https://jaincodecor.com/categories/${category.name
          .replace(/\s+/g, "-")
          .toLowerCase()}-${category.id}`}
          key={category.id}
          >
        <div
          key={category.id}
          className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white w-full"
        >
       
          {/* Image */}
          <div className="w-full overflow-hidden aspect-square relative">
            <Image
              src={category.image}
              alt={category.name}
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              fill
            />

            {/* Marquee */}
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50">
              <div className="flex w-[200%] animate-scroll-left">
                {Array(10)
                  .fill(category.name)
                  .map((name, index) => (
                    <span
                      key={index}
                      className="text-white md:text-lg text-base font-rregular whitespace-nowrap px-4 py-2 capitalize"
                    >
                      {name}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-start p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="md:text-xl text-lg font-lbold text-white mb-1 capitalize text-center">
              {category.name}
            </h3>
            <button
              className="px-3 py-1 text-sm font-iregular text-primary bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors z-40"
            type="button"
            >
              Browse Products
            </button>
          </div>
        
        </div>
        </Link>
        
      ))}
    </div>
  </div>
</section>

{/* <section className="py-6 w-full bg-gray-50">
  <div className="container mx-auto px-4">
 
    <h2 className="text-3xl font-bold text-primary text-center mb-6">
      Featured Products
    </h2>
    <p className="text-gray-600 text-center mb-8">
      Explore our exclusive range of featured products that showcase the finest of our collections.
    </p>

  
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories[9].products.map((product) => (
        <div
          key={product.id}
          className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
        >

          <div className="w-full overflow-hidden aspect-square relative">
            <Image
              src={product.image}
              alt={product.name}
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              fill
            />
          </div>


          <div className="p-4">
            <h3 className="text-lg font-bold text-black capitalize mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
             
                
                 {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-golden">
                ₹{product.price}
              </span>
              <Link
                href={`/products/${product.id}`}
                className="text-sm font-medium text-primary hover:text-golden transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>


          {product.isNew && (
            <span className="absolute top-2 left-2 bg-golden text-black text-xs font-bold px-2 py-1 rounded-full uppercase shadow">
              New
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
</section> */}



        {/* <Suspense
          fallback={
            <div className="bg-black text-white text-3xl m-6 p-2">Loading</div>
          }
        >
          <HomeePage />
        </Suspense> */}
      </div>
    </>
  );
}
