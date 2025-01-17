"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

interface FeaturedProductsProps {
  products: Product[];
  autoSlideInterval?: number; // Time in milliseconds
}

const FeaturedProducts = ({
  products,
  autoSlideInterval = 5000,
}: FeaturedProductsProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const slidesCount = Object.keys(productsByCategory).length;

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  }, [slidesCount]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

  // Auto-slide functionality
  useEffect(() => {
    const startAutoSlide = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, autoSlideInterval);
    };

    startAutoSlide();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, autoSlideInterval, nextSlide]);

  // Handle touch events for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true); // Pause on touch
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false); // Resume after touch
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Progress bar for current slide
  const progress = useRef<number>(0);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      if (isPaused) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const elapsed = Date.now() - startTime;
      progress.current =
        ((elapsed % autoSlideInterval) / autoSlideInterval) * 100;

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [autoSlideInterval, currentSlide, isPaused]);

  return (
    <section className="py-8 md:py-16 bg-gray-50 w-full">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-lbold text-primary mb-3 md:mb-4">
            Featured Collections
          </h2>
          <div className="w-16 md:w-24 h-1 bg-secondary mx-auto"></div>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-primary-100 font-iregular max-w-2xl mx-auto px-4">
            Discover our handpicked selection of premium decor pieces
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Rest of the carousel content remains the same */}
              {Object.entries(productsByCategory).map(
                ([category, categoryProducts]) => (
                  <div key={category} className="w-full flex-shrink-0">
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:h-[600px]">
                      {/* Large Feature Image */}
                      <div className="md:col-span-6 md:row-span-2 relative rounded-lg overflow-hidden h-64 md:h-auto">
                        <Image
                          src={categoryProducts[0].image}
                          alt={categoryProducts[0].name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity hover:bg-opacity-20">
                          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-white">
                            <h3 className="text-xl md:text-2xl font-lbold mb-2">
                              {category}
                            </h3>
                            <Link
                              href={`/categories/${category.toLowerCase()}`}
                              className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-secondary text-black font-lbold text-sm rounded-full 
                              hover:bg-opacity-90 transition-all duration-300 hover:-translate-y-1"
                            >
                              View Collection
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Smaller Product Images */}
                      <div className="md:col-span-6 grid grid-cols-2 gap-2 md:gap-4">
                        {categoryProducts
                          .slice(1, isMobile ? 3 : 5)
                          .map((product) => (
                            <div
                              key={product.id}
                              className="relative rounded-lg overflow-hidden group h-40 md:h-auto"
                            >
                              <div className="relative h-full">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity">
                                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 text-white">
                                    <h4 className="text-sm md:text-lg font-lbold line-clamp-1">
                                      {product.name}
                                    </h4>
                                    <Link
                                      href={`/products/${product.id}`}
                                      className="text-xs md:text-sm font-iregular hover:text-secondary transition-colors"
                                    >
                                      View Details
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-secondary transition-all duration-300"
              style={{ width: `${progressWidth}%` }}
            />
          </div> */}

          {/* Navigation Buttons - Hidden on Mobile */}
          <div className="hidden md:block">
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg
                hover:bg-secondary transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg
                hover:bg-secondary transition-colors duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Pause/Play Button */}
          {/* <button
            onClick={() => setIsPaused(!isPaused)}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-lg hover:bg-secondary transition-colors duration-300"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button> */}

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-4 md:mt-6">
            {Array.from({ length: slidesCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-secondary w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
