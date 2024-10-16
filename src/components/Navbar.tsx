"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import logo from "@/public/static/jainco_logo.png";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import SearchInput from "./SearchBar";
import { Category } from "@/@types/types";

type NavItem = {
  label: string;
  link?: string;
  id?: string;
  children?: NavItem[];
  iconImage?: string;
};

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const [animationParent] = useAutoAnimate();
  const [isSideMenuOpen, setSideMenue] = useState(false);
  const pathName = usePathname(); // Get the Next.js router

  function openSideMenu() {
    setSideMenue(true);
  }
  function closeSideMenu() {
    setSideMenue(false);
  }

  // Close the side menu on route change
  useEffect(() => {
    setSideMenue(false);
  }, [pathName]);

  const cate: NavItem[] = categories.map((cat) => ({
    label: cat.name,
    link: encodeURIComponent(cat.name.trim().replace(/\s+/g, "-").toLowerCase()),
    id: cat.id,
    iconImage: cat.image,
    children: cat.products.map((prod) => ({
      label: prod.name,
      link: encodeURIComponent(prod.name.trim().replace(/\s+/g, "-").toLowerCase()),
      id: prod.id,
    })),
  }));

  const navItems: NavItem[] = [
    {
      label: "Features",
      link: "#",
    },
    {
      label: "Categories",
      link: "#",
      children: cate,
    },
    {
      label: "Careers",
      link: "#",
    },
    {
      label: "About",
      link: "#",
    },
  ];

  return (

      <nav className="mx-auto flex w-full max-w-7xl justify-between px-4 py-5 text-sm gap-1 items-center">
        {/* left side  */}
        <section
          ref={animationParent}
          className="flex items-center gap-10 relative"
        >
          {/* logo */}
          <Link href={"/"} className="cursor-pointer">
            <Image src={logo} alt="jainco logo" className="h-auto w-16" priority />
          </Link>
          {isSideMenuOpen && (
            <MobileNav closeSideMenu={closeSideMenu} navItems={navItems} />
          )}

          <div className="hidden md:flex items-center gap-4 transition-all">
            {navItems.map((d, i) => (
             
             
              <div className="relative group transition-all" key={`${d.label}_${i}`}>
                <p className="flex cursor-pointer items-center gap-2 text-primary font-iregular group-hover:text-secondary">
                  <Link
                key={i}
                href={d.link ?? "/"}
                className="relative group px-2 py-3 transition-all"
              ><span>{d.label}</span></Link>
                  {d.children && (
                    <IoIosArrowDown className="rotate-180 transition-all group-hover:rotate-0" />
                  )}
                </p>

                {/* Dropdown */}
                {d.children && (
                  <div className="fixed left-10 right-10 hidden top-12 z-50 mt-5 border border-secondary mx-auto flex-col gap-4 rounded-lg bg-white shadow-lg group-hover:flex max-h-[85vh] overflow-y-auto">
                    {/* Wrapper for content */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-start px-0 gap-0">
                      {/* Each Column */}
                      {d.children.map((cat, idx) => (
                        <div
                          className="flex flex-col gap-2 border border-secondary p-2"
                          key={`${cat.label}_${idx}`}
                        >
                          <div className="flex flex-row w-full min-h-max gap-4">
                            {/* image div */}
                            <div className="flex overflow-hidden h-20 w-20 border border-secondary rounded-lg relative">
                              <Image
                                src={cat.iconImage || ""}
                                alt={cat.label}
                                fill
                                loading="lazy"
                                className="object-fill"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Link href={`/categories/${cat.link}-${cat.id}`} className="hover:text-secondary cursor-pointer">
                                <h4 className="font-lbold text-xl capitalize px-2">
                                  {cat.label}
                                </h4>
                              </Link>
                              {cat.children && cat.children.length > 0 && (
                                <ul className=" list-disc">
                                  {cat.children.map((prod, idx) => (
                                    <Link
                                      href={`/products/${prod.link}-${prod.id}`}
                                      key={idx}
                                      
                                    >
                                      <li
                                        className="text-sm font-rregular list-item capitalize hover:text-secondary cursor-pointer"
                                        key={`${prod.label}_${idx}`}
                                      >
                                        {prod.label}
                                      </li>
                                    </Link>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
     
              </div>
          
            ))}
          </div>

          {/* navitems */}
        </section>

        {/* right side data */}
        <section className="items-center justify-center flex">
          <SearchInput />
        </section>
        <section className=" hidden md:flex items-center gap-8 ">
          <button className="h-fit text-primary transition-all hover:text-black/90">
            Login
          </button>

          <button className="h-fit rounded-xl border-2 border-secondary px-4 py-2 text-primary transition-all hover:border-black hover:text-black/90">
            Register
          </button>
        </section>

        <FiMenu
          onClick={openSideMenu}
          className="cursor-pointer text-4xl md:hidden text-black"
        />
      </nav>
    
  );
}

function MobileNav({
  closeSideMenu,
  navItems,
}: {
  closeSideMenu: () => void;
  navItems: NavItem[];
}) {
  return (
    <div className="fixed left-0 top-0 flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden z-50">
      <div className=" h-full w-[70%] bg-white px-4 py-4  overflow-y-auto shadow-secondary shadow-lg">
        <section className="flex justify-end">
          <AiOutlineClose
            onClick={closeSideMenu}
            className="cursor-pointer text-3xl text-black"
          />
        </section>
        <div className=" flex flex-col text-base  gap-2 transition-all">
          {navItems.map((d, i) => (
            <SingleNavItem
              key={i}
              label={d.label}
              iconImage={d.iconImage}
              link={d.link}
            >
              {d.children}
            </SingleNavItem>
          ))}
        </div>

        <section className="  flex  flex-col   gap-8  mt-4 items-center">
          <button className="h-fit font-iregular text-primary transition-all hover:text-secondary">
            Login
          </button>

          <button className="w-full font-iregular max-w-[200px]  rounded-xl border-2 border-secondary px-4 py-2 text-primary transition-all hover:border-black hover:text-secondary">
            Register
          </button>
        </section>
      </div>
    </div>
  );
}

function SingleNavItem(d: NavItem) {


  return (

    <div className="relative px-0 py-3 transition-all ">
      <p className="flex cursor-pointer items-center gap-2 text-primary font-iregular group-hover:bg-secondary">
       <Link
   
   href={d.link ?? "#"}
   
 > <span>{d.label}</span></Link>
    
      </p>

  

      {d.children && (
        <div className=" w-auto flex-col gap-4 rounded-lg bg-white py-3 flex">
          {d.children.map((ch, i) => (
           
            <div
            key={i}
           
            className="  flex cursor-pointer items-start justify-start gap-4 text-primary font-rregular hover:text-black"
          >
              {/* image */}
              {ch.iconImage && (
                <div className="relative w-14 h-14 border border-secondary rounded-sm overflow-hidden">
                  <Image
                    src={ch.iconImage || ""}
                    alt={ch.label}
                    fill
                    loading="lazy"
                     className="object-fill"
                  />
                </div>
              )}
              {/* item */}
              <div className="flex flex-col flex-grow">
              <Link
              key={i}
              href={`/categories/${ch.link}-${ch.id}`}
              className="cursor-pointer "
            >
                <span className="text-xl capitalize font-rregular leading-tight break-words text-primary hover:text-secondary">
                  {ch.label}
                </span></Link>
                {ch.children && ch.children.length > 0 && (
                  <ul className="list-disc">
                    {ch.children.map((prod, idx) => (
                      <Link
                        href={`/products/${prod.link}-${prod.id}`}
                        key={idx}
                        
                      >
                        <li className="break-words list-item text-black text-sm pt-2 cursor-pointer hover:text-secondary capitalize">
                          {prod.label}
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
          
            </div>
          ))}
        </div>
      )}
     

    </div>
  );
}
