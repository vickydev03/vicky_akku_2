import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  const items = [
    { label: "Workshops", url: "/workshop" },
    { label: "Online Tutorials", url: "/online-tutorials" },
    { label: "Contact Us", url: "/Contact-us" },
    { label: "Regular Classes", url: "/regular-classes" },
    { label: "Gallery", url: "" },
  ];
  return (
    <div className="bg-[#977DAE]">
      <div className="w-[90%] px-12 py-8 md:p-6 mx-auto grid gap-12 grid-cols-1 md:grid-cols-2">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-open-sauce max-w-24 text-white uppercase">
            Vicky akku
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-white/80 size-7 rounded-full flex items-center justify-center">
              <Image
                src="/image/svg/youtube.svg"
                height={100}
                width={100}
                className="size-4"
                alt="social"
              />
            </div>
            <div className="bg-white/80 size-7 rounded-full flex items-center justify-center">
              <Image
                src="/image/svg/insta.svg"
                height={100}
                width={100}
                className="size-4"
                alt="social"
              />
            </div>
          </div>
        </div>
        <div className="">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((e,i) => (
              <li key={i}>
                <Link className="text-white" href={e.url}>
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
