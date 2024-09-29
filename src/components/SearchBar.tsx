"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import search from "@/public/static/search.png";
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
    <div className="border-2 border-primary w-full h-9 px-4  rounded-2xl focus-within:border-secondary flex items-center space-x-4">
      <input
        className="text-base text-primary flex-1 bg-transparent outline-none font-iregular"
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
        className="flex items-center justify-center"
      >
        <Image
          src={search}
          alt="search icon"
          className="w-5 h-5 object-contain"
        />
      </button>
    </div>
  );
};

export default SearchInput;
