import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jainco Decor | Decor your Dream Home",
  description: "Decor Your Dream Home with Jainco Decor. We are the b2b home furnishing brand dealing in table covers, ac covers, mattress protectors, ac curtains, washing machine covers, sofa covers, baby sheets, fridge covers",
  keywords:['jain enterprises','karol bagh','jainco decor','table cover','pvc table cover','ac cover','fridge cover'],
  icons:{
    icon:"/static/favicon.ico",
    apple:"/static/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
      <Link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
</Head>
      <body className={inter.className} style={{
        backgroundImage: `url('./static/jainco_background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', // Ensures it covers the entire viewport
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>{children}</body>
    </html>
  );
}
