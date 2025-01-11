"use client";
import React, { useState, useEffect, ReactNode, useCallback } from "react";
import Image from "next/image";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

type Slide = {
  id: number;
  src: StaticImageData;
  alt: string;
  overlay?: ReactNode; // To show custom overlay components/text on the image
  link: string;
};

type CarouselProps = {
  slides: Slide[];
  slideInterval?: number; // Optional, in milliseconds
  showButtons?: boolean; // Show next/prev buttons
  pauseOnHover?: boolean; // Pause the slideshow when hovered
};

const Carousel: React.FC<CarouselProps> = ({
  slides,
  slideInterval = 5000, // Default to 5 seconds
  showButtons = true,
  pauseOnHover = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // State for pausing the carousel on hover

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  }, [slides.length]);

  useEffect(() => {
    if (!isPaused) {
      const slideIntervalId = setInterval(nextSlide, slideInterval); // Auto slide
      return () => clearInterval(slideIntervalId); // Clear interval on component unmount
    }
  }, [isPaused, slideInterval, nextSlide]); // Added nextSlide as a dependency


  return (
    <>
      <div
        className="relative w-full h-auto md:h-96 overflow-hidden"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        {/* Slides Container */}
        <div
          className="flex transition-transform ease-in-out duration-1000"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            
            <div
            key={slide.id}
              className="w-full flex-shrink-0 min-h-max md:h-96 relative"
            ><Link  href={slide.link}>
              <Image
                src={slide.src}
                alt={slide.alt}
                className="object-contain md:object-fill w-full h-full hover:scale-110 transition-all ease-in-out duration-700"
              /> 
              {slide.overlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white p-4">
                  {slide.overlay}
                </div>
              )}</Link>
            </div>
            
          ))}
        </div>

        {/* Optional Previous Button */}
        {showButtons && (
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-1 md:left-4 transform -translate-y-1/2 text-white p-2 rounded-full shadow-lg hover:bg-white hover:text-secondary transition-colors text-xl md:text-3xl"
          >
            <IoIosArrowBack />
          </button>
        )}

        {/* Optional Next Button */}
        {showButtons && (
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-1 md:right-4 transform -translate-y-1/2  text-white p-2 rounded-full shadow-lg hover:bg-white hover:text-secondary transition-colors text-xl md:text-3xl"
          >
            <IoIosArrowForward />
          </button>
        )}
      </div>
      {/* Dots for Slide Indicators */}
      <div className="items-center flex gap-2 w-full h-2 justify-center mt-3 mb-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === currentSlide ? "bg-secondary" : "bg-black"
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default Carousel;
