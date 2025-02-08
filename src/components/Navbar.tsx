"use client";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

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
import { ChevronDown } from "lucide-react";

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
    link: encodeURIComponent(
      cat.name.trim().replace(/\s+/g, "-").toLowerCase()
    ),
    id: cat.id,
    iconImage: cat.image,
    children: cat.products.map((prod) => ({
      label: prod.name,
      link: encodeURIComponent(
        prod.name.trim().replace(/\s+/g, "-").toLowerCase()
      ),
      id: prod.id,
    })),
  }));

  const navItems: NavItem[] = [
   
    {
      label: "Categories",
      link: "#",
      children: cate,
    },
    
    {
      label: "About",
      link: "/#about",
    },
  ];
  
// Add these new states and functions for auto-scroll
const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
const [scrollContainerMd, setScrollContainerMd] = useState<HTMLDivElement | null>(null);
  
useEffect(() => {
  const container = scrollContainer;
  if (!container) return;

  const scrollInterval = setInterval(() => {
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
      // Reset to start when reaching the end
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      // Scroll by 100px
      container.scrollBy({ left: 100, behavior: 'smooth' });
    }
  }, 1500); // Scroll every 3 seconds

  // Pause auto-scroll on hover or touch
  const pauseScroll = () => clearInterval(scrollInterval);
  const container_current = container;
  
  container.addEventListener('mouseenter', pauseScroll);
  container.addEventListener('touchstart', pauseScroll);

  return () => {
    clearInterval(scrollInterval);
    container_current?.removeEventListener('mouseenter', pauseScroll);
    container_current?.removeEventListener('touchstart', pauseScroll);
  };
}, [scrollContainer]);

useEffect(() => {
  const container = scrollContainerMd;
  if (!container) return;

  const scrollInterval = setInterval(() => {
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
      // Reset to start when reaching the end
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      // Scroll by 100px
      container.scrollBy({ left: 100, behavior: 'smooth' });
    }
  }, 1500); // Scroll every 3 seconds

  // Pause auto-scroll on hover or touch
  const pauseScroll = () => clearInterval(scrollInterval);
  const container_current = container;
  
  container.addEventListener('mouseenter', pauseScroll);
  container.addEventListener('touchstart', pauseScroll);

  return () => {
    clearInterval(scrollInterval);
    container_current?.removeEventListener('mouseenter', pauseScroll);
    container_current?.removeEventListener('touchstart', pauseScroll);
  };
}, [scrollContainerMd]);


  return (
    <nav>
      <div className="mx-auto flex md:grid md:grid-cols-12 w-full justify-between px-4 pt-2 pb-4 text-sm gap-1 items-center">
        {/* left side  */}
        <section
          ref={animationParent}
          className="flex md:col-span-8 items-center gap-10 relative md:grid md:grid-cols-11 md:gap-2"
        >
          {/* logo */}
          <Link href={"/"} className="cursor-pointer">
            <Image
              src={logo}
              alt="jainco logo"
              className="h-auto w-16"
              priority
            />
          </Link>
          {isSideMenuOpen && (
            <MobileNav closeSideMenu={closeSideMenu} navItems={navItems} />
          )}
         

          <div className="hidden md:flex items-center gap-4 transition-all md:col-span-10 md:gap-2">
           
        <div 
         ref={setScrollContainerMd}
        className="flex items-center gap-3 w-full px-4 mt-4 mb-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
          
          {/* Map through categories to create multiple dropdowns */}
          {categories.map((category, index) => (
            <Menu key={index} allowHover>
              <MenuHandler>
                <Button
                  placeholder="Menu"
                  className="bg-white uppercase text-sm text-black font-iregular min-w-fit flex items-center gap-2 tracking-normal p-0 m-0 group"
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                  variant="text"
                >
                  {category.name}{" "}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
                </Button>
              </MenuHandler>
              <MenuList
                placeholder="Menu List"
                className="max-h-[50vh] overflow-y-auto bg-white text-primary"
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                {category.products.map((product, idx) => (
                  <MenuItem
                    key={idx}
                    placeholder="Menu Item"
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <Link href={`/products/${encodeURIComponent(product.name.trim().replace(/\s+/g, "-").toLowerCase())}-${product.id}`} className="flex flex-row gap-2 justify-start items-center">
                    <div className="flex overflow-hidden h-20 w-20 border border-secondary rounded-lg relative">
                              <Image
                                src={product.image || ""}
                                alt={product.name}
                                fill
                               priority
                                className="object-fill"
                              />
                            </div>
                            <h6 className="capitalize font-rregular text-sm hover:text-white hover:bg-secondary p-2">{product.name}</h6>
                      
                    </Link>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ))}
          
        </div>
            

          </div>

          {/* navitems */}
        </section>

        {/* right side data */}
        <section className="items-center justify-center flex md:col-span-2">
          
          <SearchInput />
        </section>
        <section className=" hidden md:grid items-center gap-1 md:col-span-2 md:justify-center md:grid-cols-2">
          <Link href={'/#about'} className="relative px-4 py-2">
          <button className="h-fit text-primary transition-all hover:text-black/90">
            About
          </button></Link>
<Link href={'/categories'}>
          <button className="h-fit rounded-xl border-2 border-secondary px-4 py-2 text-primary transition-all hover:border-black hover:text-black/90">
            Catalog
          </button></Link>
        </section>

        <FiMenu
          onClick={openSideMenu}
          className="cursor-pointer text-4xl md:hidden text-black"
        />
      </div>
     
      
       <div id="products" className="md:hidden relative overflow-visible">
        <div 
         ref={setScrollContainer}
        className="flex items-center gap-3 w-full px-4 mt-4 mb-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
          
          {/* Map through categories to create multiple dropdowns */}
          {categories.map((category, index) => (
            <Menu key={index} allowHover>
              <MenuHandler>
                <Button
                  placeholder="Menu"
                  className="bg-white uppercase text-sm text-black font-iregular min-w-fit flex items-center gap-2 tracking-normal p-0 m-0 group"
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                  variant="text"
                >
                  {category.name}{" "}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
                </Button>
              </MenuHandler>
              <MenuList
                placeholder="Menu List"
                className="max-h-[50vh] overflow-y-auto bg-white text-primary"
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                {category.products.map((product, idx) => (
                  <MenuItem
                    key={idx}
                    placeholder="Menu Item"
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <Link href={`/products/${encodeURIComponent(product.name.trim().replace(/\s+/g, "-").toLowerCase())}-${product.id}`} className="flex flex-row gap-2 justify-start items-center">
                    <div className="flex overflow-hidden h-20 w-20 border border-secondary rounded-lg relative">
                              <Image
                                src={product.image || ""}
                                alt={product.name}
                                fill
                               priority
                                className="object-fill"
                              />
                            </div>
                            <h6 className="capitalize font-rregular text-sm hover:text-white hover:bg-secondary p-2">{product.name}</h6>
                      
                    </Link>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ))}
          
        </div>
      </div>
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
        <Link href={d.link ?? "#"}>
          {" "}
          <span>{d.label}</span>
        </Link>
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
                  </span>
                </Link>
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
