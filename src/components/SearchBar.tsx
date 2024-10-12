"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import search from "@/public/static/search.png";
// import algolia from "@/public/static/Algolia-logo-white.png"
interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || "");
  const handleSearch = () => {
    if (!query) {
      return window.alert("Missing query Please input something to search");
    } else {
      setQuery(""); // Clear the input after searching
    }
  };
  return (
    <div className=" relative border border-primary md:w-full sm:w-60 w-52 h-9 px-4 md:rounded-lg rounded-3xl focus-within:border-secondary flex items-center overflow-hidden">
       <div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{ 
          backgroundImage: `url('/static/Algolia-logo-white.png')`, // Add your background image path here
          backgroundSize: 'contain', // Maintain aspect ratio
          backgroundPosition: 'center', // Center the background image
         
        }}
      />
      <input
        className="text-xs md:text-sm text-primary flex-grow bg-transparent outline-none font-iregular  overflow-hidden z-10"
        value={query}
        placeholder="Search our products"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && handleSearch()
        } // Trigger search on "Enter"
      />
      
      <button
        onClick={handleSearch}
        className="flex-shrink-0 flex items-center justify-center"
      >
        <Image
          src={search}
          alt="search icon"
          className="w-5 h-5 object-contain z-10"
        />
      </button>
    </div>
  );
};

export default SearchInput;
