import slides from "@/src/_data/carousel";
import Carousel from "@/src/components/Carousel";
import { fetchCategories } from "../_data/categories";
    

export default async function HomePage() {
  const { categories } = await fetchCategories();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jainco Decor",
    "url": "https://jaincodecor.com",
    "logo": "https://jaincodecor.com/static/jainco_logo.png",
    "description": "Jainco Decor specializes in PVC table covers, appliance covers, mattress protectors, fridge covers, and more for B2B buyers.",
    "founders": [
      { "@type": "Person", "name": "Atul Jain" },
      { "@type": "Person", "name": "Tarun Jain" }
    ],
    "foundingDate": "2007",
    "sameAs": [
      "https://www.facebook.com/jaincodecor",
      "https://www.instagram.com/jaincodecor"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Beadon Pura",
      "addressLocality": "Karol Bagh",
      "addressRegion": "DL",
      "postalCode": "110005",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-11-43621784",
      "contactType": "Customer Service"
    }
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Jainco Decor",
    "url": "https://jaincodecor.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://jaincodecor.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const categoryListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Categories",
    "itemListElement": categories.map((category, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": category.name,
      "image":category.image,
      "url": `https://jaincodecor.com/categories/${category.name.replace(/\s+/g, "-").toLowerCase()}-${category.id}`
    }))
  };
  const combinedJsonLd = {
    "@context": "https://schema.org",
    "@graph": [jsonLdData, websiteJsonLd, categoryListJsonLd],
  };
  
  return (
      <>
     <script  type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }} />
        {/* Carousel */}
        <Carousel
          slides={slides}
          slideInterval={4000} // 4 seconds
          showButtons={true} // Show buttons
          pauseOnHover={true} // Pause when hovered
        />
        <div className="p-4 w-full flex gap-4 items-center justify-center flex-col mt-8 mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Welcome to Jainco Decor
          </h1>
          <p className="font-regular text-secondary">
            Bringing premium products to B2B buyers globally.
          </p>
          <button className="mt-4 bg-primary text-white px-4 py-2 font-regular">
            Explore Our Catalog
          </button>
        </div>
      </>
    );
}
