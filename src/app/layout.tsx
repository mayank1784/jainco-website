import type { Metadata } from "next";

import "./globals.css";
import Head from "next/head";
import { Inter, Roboto } from "next/font/google"; // Google Fonts
import localFont from "next/font/local"; // For Local Fonts
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { FaWhatsapp } from "react-icons/fa";

// Import Google Fonts using next/font/google
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

// Load local fonts using next/font/local
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


export const metadata: Metadata = {
  title: "Jainco Decor | Decor your Dream Home",
  description:
    "Decor Your Dream Home with Jainco Decor. We are the b2b home furnishing brand dealing in table covers, ac covers, mattress protectors, ac curtains, washing machine covers, sofa covers, baby sheets, fridge covers",
  keywords: [
    "jain enterprises",
    "karol bagh",
    "jainco decor",
    "table cover",
    "pvc table cover",
    "ac cover",
    "fridge cover",
  ],
  icons: {
    icon: "/static/favicon.ico",
    apple: "/static/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${leagueSpartan.variable} ${spaceMono.variable} ${process.env.NODE_ENV=='development' ? "debug-screens": ""}`}
    >
      <Head>
        <p>dsdsd</p>
      </Head>

      <body className="min-h-screen min-w-full m-0 p-0 bg-zinc-100 flex flex-col">
        <Navbar/>
       <main className="flex-grow">
        {children}
        </main>
       <Footer/>
               {/* WhatsApp Floating Icon */}
               <a
          href="https://wa.me/919891521784" // Add your WhatsApp number here
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-10 right-5 z-999 flex items-center justify-center md:w-16 md:h-16 w-12 h-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={40} />
        </a>

      </body>
    </html>
  );
}
