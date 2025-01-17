import slides from "@/src/_data/carousel";
import Carousel from "@/src/components/Carousel";
import { FaGooglePlay } from "react-icons/fa6";
import { fetchCategories } from "../_data/categories";
import Link from "next/link";
import jaincoStore from "@/public/images/jainco.png";
import tarunJain from "@/public/images/tarun-jain.jpg";
import atulJain from "@/public/images/atul-jain.jpg";
import FeaturedProducts from "@/src/components/Featured";
import {featuredProducts} from "@/src/_data/featured"
// import HomeePage from "./Sheet";
// import { Suspense } from "react";
import Image from "next/image";

const subheading = "Testimonials";
const heading = "Customer's Review";
const testimonials = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    customerName: "Charlotte Hale",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    customerName: "Adam Cuppy",
  },

];

const founders = [
  {
    name: "Atul Jain",
    role: "Co-Founder & Visionary Strategist",
    bio: "With over 20 years of experience in the industry, Atul Jain has been instrumental in shaping the vision and growth of Jainco Decor. Based in Delhi, he combines a deep understanding of market dynamics with a passion for innovation. Atul's leadership style emphasizes strategic planning and a customer-centric approach, ensuring the company stays ahead in the competitive B2B wholesale market. His relentless drive to maintain quality and build strong client relationships has been a cornerstone of Jainco Decor's success.",
    image: atulJain,
    email: "atuljain449@gmail.com",
  },
  {
    name: "Tarun Jain",
    role: "Co-Founder & Operations Maestro",
    bio: "Tarun Jain, a co-founder of Jainco Decor, shares the same rich legacy of 20+ years in the industry. Operating from Delhi, he is the backbone of the company’s operational excellence. Tarun's hands-on approach and expertise in logistics, inventory management, and supplier networks ensure seamless execution in all aspects of the business. His dedication to delivering unparalleled value to clients and his ability to adapt to changing market trends have solidified Jainco Decor's reputation as a leader in the B2B space.",
    image: tarunJain,
    email: "tarunjain3282@gmail.com",
  },
];

export default async function HomePage() {
  const { categories } = await fetchCategories();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jainco Decor",
    legalName: "Jain Enterprises",
    taxID: "07AZYPK0127D1ZE",
    url: "https://jaincodecor.com",
    logo: "https://jaincodecor.com/static/jainco_logo.png",
    description:
      "Jainco Decor specializes in PVC table covers, appliance covers, mattress protectors, fridge covers, and more for B2B buyers.",
    founders: founders.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      email: founder.email,
      nationality: "indian",
      gender: "male",
    })),
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
        <h1 className="text-2xl font-bold text-primary md:text-4xl">
          Welcome to Jainco Decor
        </h1>
        <p className="font-regular text-secondary text-center capitalize">
          Decor your dream home
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
          <div className="container mx-auto md:px-4 w-full">
            
              {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-lbold text-primary mb-2 md:mb-4">Our Categories</h2>
          <div className="w-24 h-1 bg-secondary mx-auto"></div>
          <p className="mt-4 text-primary-100 font-iregular max-w-2xl mx-auto">
            Discover our extensive range of premium decor solutions for your business needs
          </p>
        </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  href={`https://jaincodecor.com/categories/${category.name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}-${category.id}`}
                  key={category.id}
                >
                  <div
                    key={category.id}
                    className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white w-full"
                  >
                    <div className="absolute opacity-0 -z-10 overflow-hidden">{category.description}
                    {category.products.map((prod, index)=>(
                      <p className=" opacity-0" key={index}>{prod.name} {prod.description} {prod.image}</p>
                    ))}</div>
                    {/* Image */}
                    <div className="w-full overflow-hidden aspect-square relative">
                      <Image
                        src={category.image}
                        alt={category.name}
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        fill
                      />
                      <div className="absolute top-0 left-0 bg-[#545454] text-white p-2 md:p-4 capitalize rounded-br-lg font-rregular text-xs sm:text-base md:text-lg">{category.name}</div>
                     
                      
                    
                  
                <button type="button" className="absolute inset-x-3 bottom-2 px-3 md:px-6 py-2 text-center bg-secondary text-black font-lbold text-sm rounded-full 
                hover:bg-opacity-90 transition-colors duration-300 
                transform hover:-translate-y-1 hover:shadow-lg">
                  
                  Explore Collection
                 
                  </button>
                
                    
                    </div>

                  
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        

        <section className="py-10 w-full" id="about">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
            {/* Shop Image */}
            <div
              className="w-full md:w-1/2 relative group"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <div className="w-full h-auto overflow-hidden relative rounded-sm">
              <Image
                src={jaincoStore}
                alt="Jainco Decor Store"
                className="rounded-sm shadow-lg w-full object-contain group-hover:scale-110 transition-transform duration-500"
              /></div>

              <div className="absolute top-0 right-0 w-20 h-1 bg-secondary rounded-lg transform translate-x-3 -translate-y-3" />
              <div className="absolute top-0 right-0 w-1 h-20 bg-secondary rounded-lg transform translate-x-3 -translate-y-3" />
              <div className="absolute top-0 right-0 w-32 h-1 bg-secondary rounded-lg transform translate-x-6 -translate-y-6" />
              <div className="absolute top-0 right-0 w-1 h-32 bg-secondary rounded-lg transform translate-x-6 -translate-y-6" />

              <div className="absolute bottom-0 left-0 w-20 h-1 bg-secondary rounded-lg transform -translate-x-3 translate-y-3" />
              <div className="absolute bottom-0 left-0 w-1 h-20 bg-secondary rounded-lg transform -translate-x-3 translate-y-3" />
              <div className="absolute bottom-0 left-0 w-32 h-1 bg-secondary rounded-lg transform -translate-x-6 translate-y-6" />
              <div className="absolute bottom-0 left-0 w-1 h-32 bg-secondary rounded-lg transform -translate-x-6 translate-y-6" />
            </div>

            {/* About Content */}
            <div
              className="w-full md:w-1/2 text-center md:text-left md:pl-5 pt-5"
              data-aos="fade-left"
              data-aos-duration="800"
            >
              <h2 className="text-3xl font-bold text-primary mb-2">About Us</h2>
              <div className="w-16 md:w-24 h-1 bg-secondary mx-auto md:mx-0 md:text-left mb-4"></div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Jainco Decor is a trusted name in the Indian wholesale market,
                specializing in high-quality home decor and furnishings. With
                decades of expertise, we are proud to serve our B2B clients with
                premium products that blend tradition with modernity.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Our vision is to create timeless pieces that elevate spaces
                while meeting the dynamic needs of our customers. Discover the
                craftsmanship and quality Jainco is known for!
              </p>
              <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </section>

        <section className="py-10 w-full" id="founders">
          <div className="container mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-primary text-center mb-2"
              data-aos="fade-up"
            >
              Meet the Founders
            </h2>
            <div className="w-16 md:w-24 h-1 bg-secondary mx-auto mb-8 text-center"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Founder Cards */}
              {founders.map((founder, index) => (
                <div
                  key={index}
                  className="bg-gray-50 shadow-lg rounded-lg overflow-hidden w-full items-center justify-center flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                >
                  {/* Image */}
                  <div className="relative flex items-center justify-center mt-5">
                    {/* Outer border */}
                    <div className="absolute w-60 h-60 rounded-full border-2 border-secondary"></div>

                    {/* Inner border */}
                    <div className="relative overflow-hidden w-56 h-56 rounded-full border border-secondary">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        className="object-cover transform hover:scale-105 transition-transform duration-300"
                        fill
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {founder.name}
                    </h3>
                    <p className="text-gray-700 text-base">{founder.role}</p>
                    <p className="text-gray-600 text-sm mt-3">{founder.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <Suspense
          fallback={
            <div className="bg-black text-white text-3xl m-6 p-2">Loading</div>
          }
        >
          <HomeePage />
        </Suspense> */}

<section className="relative bg-white dark:bg-black py-12 px-6">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center grid-cols-1">

    <div className="relative w-full md:h-full overflow-hidden h-64">
      <Image
        src="https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg"
        alt="Featured Product"
        className="w-full rounded-lg shadow-lg object-cover h-full"
        fill
      />
      <span className="absolute top-4 left-4 bg-gold text-black px-4 py-1 text-sm rounded-md">
        Featured
      </span>
    </div>


    <div>
      <h2 className="text-4xl font-bold text-black dark:text-white">
        Luxurious Handmade Vase
      </h2>
      <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
        Add elegance to your living space with this handcrafted vase, made from
        premium materials and designed to complement your decor.
      </p>
      <ul className="mt-4 space-y-2">
        <li className="flex items-center text-gray-800 dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-gold"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Handmade with eco-friendly materials
        </li>
        <li className="flex items-center text-gray-800 dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-gold"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Perfect for modern interiors
        </li>
        <li className="flex items-center text-gray-800 dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-gold"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Available in various sizes
        </li>
      </ul>
      <div className="mt-6 flex space-x-4">
        <a
          href="/products/handmade-vase"
          className="bg-gold text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition"
        >
          View Product
        </a>
        <a
          href="/categories/home-decor"
          className="text-gold underline hover:text-opacity-80 text-lg"
        >
          View More Home Decor
        </a>
      </div>
    </div>
  </div>
</section>





<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
        Discover Our Collections
      </h2>
      <p className="mt-4 text-gray-600 text-lg leading-relaxed">
        Explore our wide range of products carefully curated to meet your
        needs. Check out some of our best collections below.
      </p>
    </div>

    {/* Collage */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div className="aspect-square rounded-lg overflow-hidden relative">
        <Image
          src="https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg"
         
          alt="Photo 1"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          fill
        />
      </div>
      <div className="aspect-square rounded-lg overflow-hidden relative">
        <Image
          src="https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg"
          alt="Photo 2"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          fill
        />
      </div>
      <div className="aspect-square rounded-lg overflow-hidden relative">
        <Image
          src="https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg"
          alt="Photo 3"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        fill
        />
      </div>
      <div className="aspect-square rounded-lg overflow-hidden relative">
        <Image
          src="https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg"
          alt="Photo 4"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        fill
        />
      </div>
    </div>

    {/* CTA */}
    <div className="text-center mt-10">
      <a
        href="/collections"
        className="inline-block px-8 py-4 text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
      >
        Explore All Collections
      </a>
    </div>
  </div>
</section>

<FeaturedProducts products={featuredProducts} />

        <section id="testimonials" className="w-full">
        <div className="relative bg-gray-50 py-12">
          <div className="container mx-auto px-6">
            {subheading && (
              <h4 className="text-center text-xl text-gray-700 font-semibold mb-4">
                {subheading}
              </h4>
            )}
            <h2 className="text-center text-3xl md:text-4xl font-bold text-primary mb-8">
              {heading}
            </h2>
            <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center lg:justify-between gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 max-w-xs text-center"
                >
                  <Image
                    src={testimonial.imageSrc}
                    alt={testimonial.customerName}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                    width={20}
                    height={20}
                  />
                  <blockquote className="mt-4 text-gray-600 italic">
                    {testimonial.quote}
                  </blockquote>
                  <p className="mt-4 text-gray-900 font-semibold uppercase text-sm tracking-wide">
                    - {testimonial.customerName}
                  </p>
                </div>
              ))}
            </div>
          </div>
         
        </div></section>
      </div>
    </>
  );
}
