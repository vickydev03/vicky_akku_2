import Image from "next/image";
import React from "react";

function TheStory() {
  return (
    <div className="w-full h-full bg-[#FFFBF4] rounded-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 ">
        <div className="w-full p-10  justify-center  items-center md:items-start justifya-center flex flex-col gap-4 md:gap-3">
          <div className="w-full">
            <h2 className="text-4xl md:text-6xl text-[#DAA3B0] text-center md:text-start font-passion-one uppercase max-w-md ">
              Their journey
            </h2>
          </div>
          <div className="max-w-xas flex flex-col gap-4 ">
            <p className="font-inter text-regular text-sm sm:text-md  md:text-lg font-medium md:text-md text-center md:text-start mx-auto">
              Vicky Dadheech and Aakanksha Tripathi met over ten years ago at a
              dance studio in Mumbai, where rhythm, passion, and fate brought
              them together. What began as a shared love for movement soon grew
              into a powerful partnership, both on and off the dance floor.
              <br />
              <br />
              Early on, they made a conscious decision to dance and teach
              together, believing that dance is not just about learning steps,
              but about telling stories and feeling music deeply.
            </p>
          </div>
        </div>
        <div className="">
          <div className=" relative   p-6 flex items-center justify-center  w-fulal">
            <Image
              className="w-full rounded-3xl h-56 md:h-84 lg:h-108  object-center object-cover"
              src={"/image/workshop3.webp"}
              alt="details"
              quality={75}
              sizes="100vw"
              height={100}
              width={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TheStory;
