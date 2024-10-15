'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

type ImageWithAnimatedOverlayProps = {
  imageUrl: string;
  description: string;
  alt:string;
};

const ImageWithAnimatedOverlay: React.FC<ImageWithAnimatedOverlayProps> = ({
  imageUrl,
  description,
  alt
}) => {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen size is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    handleResize(); // Check size on component mount
    window.addEventListener('resize', handleResize); // Add resize listener

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  // Handle overlay toggle for mobile
  const toggleOverlay = () => {
    if (isMobile) {
      setHovered((prev) => !prev);
    }
  };

  useEffect(() => {
    if (isMobile) {
      setHovered(true);
    }
  }, [isMobile]);
  

  return (
    <div
      className="relative w-56 h-56 overflow-hidden rounded-lg shadow-lg border-secondary"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onClick={toggleOverlay} // Toggle overlay on click for mobile
    >
      {/* Image */}
      <Image
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-fill"
        fill
        priority
      />

      {/* Overlay with sliding animation */}
      <div
        className={`absolute top-0 left-0 h-full bg-black bg-opacity-60 
          transition-transform duration-1000 ease-in-out 
          ${hovered ? 'translate-x-0' : '-translate-x-full'} 
          ${description.length > 80 ? 'w-[80%]' : 'w-[60%]'} // Adjust width based on description length
        `}
      >
        {/* Animated Text inside Overlay */}
        <div
          className={`p-4 text-white text-sm font-iregular h-full flex items-center justify-center 
            transition-opacity duration-500 ease-in-out capitalize
            ${hovered || isMobile ? 'opacity-100' : 'opacity-0'}`}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export default ImageWithAnimatedOverlay;
