import slides from "@/src/_data/carousel";
import Carousel from "@/src/components/Carousel";


export default async function HomePage() {

  // prettier-ignore
/* eslint-disable */
const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Jainco Decor",
  "url": "https://jaincodecor.com",
  "logo": "https://jaincodecor.com/static/jainco_logo.png",
  "sameAs": [
    "https://www.facebook.com/jaincodecor",
    "https://www.instagram.com/jaincodecor"
  ],
  "description": "Jainco Decor specializes in PVC table covers, appliance covers, mattress protectors, fridge covers, and more for B2B buyers.",
  "founders": [
    { "@type": "Person", "name": "Atul Jain" },
    { "@type": "Person", "name": "Tarun Jain" }
  ],
  "foundingDate": "2007",
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

  return (
   <>
   
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />

     <Carousel
     slides={slides}
     slideInterval={4000} // 4 seconds
     showButtons={true} // Show buttons
     pauseOnHover={true} // Pause when hovered
     />
      <div className="p-4 w-full flex gap-4 items-center justify-center flex-col mt-8 mb-8">
        <h1 className="text-3xl font-lbold text-primary">
          Welcome to Jainco Decor
        </h1>
        <p className="font-iregular text-secondary">
          Bringing premium products to B2B buyers globally.
        </p>
        <button className="mt-4 bg-primary text-white px-4 py-2 font-rregular">
          Explore Our Catalog
        </button>
      </div>
     
   </>
  );
}
