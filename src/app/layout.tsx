import type { Metadata } from "next";
import { fetchCategories } from "@/src/_data/categories";
import "./globals.css";
import { Inter, Roboto } from "next/font/google"; // Google Fonts
import localFont from "next/font/local"; // For Local Fonts
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { FaWhatsapp } from "react-icons/fa";

// Import Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // CSS variable for Tailwind integration
});

const roboto = Roboto({
  weight: "400",
  style: "normal",
  variable: "--font-roboto",
  subsets: ["latin"],
});

// Load Local Fonts
const leagueSpartan = localFont({
  src: "../../public/fonts/LeagueSpartan-Bold.ttf",
  variable: "--font-league-spartan",
  weight: "700",
});

const spaceMono = localFont({
  src: "../../public/fonts/SpaceMono-Regular.ttf",
  variable: "--font-space-mono",
  weight: "400",
});

// Metadata Configuration
export const metadata: Metadata = {
  title: {
    default:
      "Wholesale B2B Home Furnishings | PVC Table Covers, Mattress Protectors & More - Jainco Decor",
    template: "Jainco Decor | %s",
  },
  description:
    "Jainco Decor, a leading B2B home furnishing brand, specializes in wholesale PVC table covers, mattress protectors, appliance covers, sofa covers, fridge covers, and more. We import premium Cherry table covers and offer high-quality slap rolls, AC covers, shower curtains, and baby bedsheets for retailers and distributors. Discover top-tier products for your business.",
  keywords: [
    "jain enterprises",
    "karol bagh",
    "jainco decor",
    "table cover",
    "pvc table cover",
    "ac cover",
    "fridge cover",
    "cherry table",
    "wholesaler",
    "importer",
  ],
  openGraph: {
    title: "Jainco Decor | Decor your Dream Home",
    description:
      "Home Furnishing | PVC Table Cloths | Appliance Covers | Mattress Protectors | Fridge Covers",
    url: "https://jaincodecor.com",
    type: "website",
  },
  icons: {
    icon: "/static/favicon.ico",
    apple: "/static/favicon.ico",
  },
};


export default async function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
  
}>) {
  const { categories } = await fetchCategories();
  

  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${
        leagueSpartan.variable
      } ${spaceMono.variable} ${
        process.env.NODE_ENV == "development" ? "debug-screens" : ""
      }`}
    >
       
      <body className="min-h-screen min-w-full m-0 p-0 bg-zinc-100 flex flex-col">
        <header><Navbar categories={categories} /></header>
        
        <main className="flex-grow">{children}</main>
        <Footer />
        {/* WhatsApp Floating Icon */}
        <a
          href="https://wa.me/919891521784"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-10 right-5 z-999 flex items-center justify-center md:w-16 md:h-16 w-12 h-12 rounded-full bg-[#25d366] text-white shadow-lg hover:bg-[#128C7E] transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={40} />
        </a>
      </body>
    </html>
  );
}
