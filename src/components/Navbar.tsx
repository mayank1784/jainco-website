"use client";

import Image from "next/image";
import { useState } from "react";

import logo from "@/public/static/jainco_logo.png";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { categories } from "../_data/categories";
import SearchInput from "./SearchBar";

type NavItem = {
  label: string;
  link?: string;
  children?: NavItem[];
  iconImage?: string;
};
const cate: NavItem[] = categories.map((cat) => ({
  label: cat.name,
  link: cat.name,
  iconImage: cat.image,
  children: cat.products.map((prod) => ({
    label: prod,
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

export default function Navbar() {
  const [animationParent] = useAutoAnimate();
  const [isSideMenuOpen, setSideMenue] = useState(false);
  function openSideMenu() {
    setSideMenue(true);
  }
  function closeSideMenu() {
    setSideMenue(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl justify-between px-4 py-5 text-sm gap-1">
      {/* left side  */}
      <section
        ref={animationParent}
        className="flex items-center gap-10 relative"
      >
        {/* logo */}
        <Image src={logo} alt="logo" className="h-auto w-16" />
        {isSideMenuOpen && <MobileNav closeSideMenu={closeSideMenu} />}

        <div className="hidden md:flex items-center gap-4 transition-all">
          {navItems.map((d, i) => (
            <Link
              key={i}
              href={d.link ?? "#"}
              className="relative group px-2 py-3 transition-all"
            >
              <p className="flex cursor-pointer items-center gap-2 text-primary font-iregular group-hover:text-secondary">
                <span>{d.label}</span>
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
                          <div className="flex overflow-hidden h-20 w-20 border border-secondary rounded-lg">
                            <Image
                              src={cat.iconImage || ""}
                              alt={cat.label}
                              width={100}
                              height={100}
                              className="border"
                              style={{ objectFit: "cover" }}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <h4 className="font-lbold text-xl capitalize px-2">
                              {cat.label}
                            </h4>
                            {cat.children && cat.children.length > 0 && (
                              <ul className=" list-disc">
                                {cat.children.map((prod, idx) => (
                                  <li
                                    className="text-sm font-rregular list-item"
                                    key={`${prod.label}_${idx}`}
                                  >
                                    {prod.label}
                                  </li>
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
            </Link>
          ))}
        </div>

        {/* navitems */}
      </section>

      {/* right side data */}
      <section className="items-center flex">
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
    </div>
  );
}

function MobileNav({ closeSideMenu }: { closeSideMenu: () => void }) {
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
  const [animationParent] = useAutoAnimate();
  const [isItemOpen, setItem] = useState(false);

  function toggleItem() {
    return setItem(!isItemOpen);
  }

  return (
    <Link
      ref={animationParent}
      onClick={toggleItem}
      href={d.link ?? "#"}
      className="relative px-0 py-3 transition-all "
    >
      <p className="flex cursor-pointer items-center gap-2 text-primary font-iregular group-hover:bg-secondary">
        <span>{d.label}</span>
        {d.children && (
          // rotate-180
          <IoIosArrowDown
            className={`text-xs transition-all  ${isItemOpen && " rotate-180"}`}
          />
        )}
      </p>

      {isItemOpen && d.children && (
        <div className=" w-auto flex-col gap-1 rounded-lg bg-white py-3 flex">
          {d.children.map((ch, i) => (
            <Link
              key={i}
              href={ch.link ?? "#"}
              className="  flex cursor-pointer items-start justify-start gap-4 text-primary font-rregular hover:text-black"
            >
              {/* image */}
              {ch.iconImage && (
                <div className="relative w-14 h-14 border border-secondary rounded-sm overflow-hidden">
                  <Image
                    src={ch.iconImage || ""}
                    alt={ch.label}
                    layout="fill"
                    className="object-cover"
                  />
                </div>
              )}
              {/* item */}
              <div className="flex flex-col flex-grow">
                <span className="text-lg capitalize font-rregular leading-tight break-words text-primary">
                  {ch.label}
                </span>
                {ch.children && ch.children.length > 0 && (
                  <ul className="list-disc">
                    {ch.children.map((prod, idx) => (
                      <li
                        key={idx}
                        className="break-words list-item text-black text-sm"
                      >
                        {prod.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Link>
  );
}
