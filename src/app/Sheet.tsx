"use client";
import { useEffect, useState } from "react";

type SheetData = string[][];

const HomePage = () => {
  const [data, setData] = useState<SheetData>([]);
  const [loading, setLoading] = useState(true);

  const fetchSheetData = async () => {
    const SHEET_ID = "18uoslph6mYEl1i8ry_poTjYOYbr84Hb87VbbAAeNKAg";
    const API_KEY = "AIzaSyCfSBMEo7FUX_h-bd4u5_T9VYBKcho2hVM"; // Replace with your actual API key
    const SHEET_NAME = "Home"; // Ensure the tab name matches

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.values) {
        setData(result.values);
      } else {
        console.error("No data found in the sheet.");
      }
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      {data.map((row, index) => (
        <div key={index} className="mb-4">
          {row.map((cell, cellIndex) => (
            <p key={cellIndex} className="text-gray-800">
              {cell}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
