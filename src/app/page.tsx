import slides from "../_data/carousel";
import Carousel from "@/src/components/Carousel";



export default function HomePage() {
  return (
   <>
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
