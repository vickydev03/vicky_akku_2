// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Image from "next/image";
// import React, { useState } from "react";

// function ReviewSection() {
//   const review = [
//     {
//       rating: 5,
//       review:
//         "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
//       user: {
//         name: "Prashansa Agrawal",
//         image: "/image/user.png",
//         place: "Mumbai , India",
//       },
//     },
//     {
//       rating: 5,
//       review:
//         "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
//       user: {
//         name: "Prashansa Agrawal",
//         image: "/image/user.png",
//         place: "Mumbai , India",
//       },
//     },
//     {
//       rating: 5,
//       review:
//         "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
//       user: {
//         name: "Prashansa Agrawal",
//         image: "/image/user.png",
//         place: "Mumbai , India",
//       },
//     },
//     {
//       rating: 5,
//       review:
//         "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
//       user: {
//         name: "Prashansa Agrawal",
//         image: "/image/user.png",
//         place: "Mumbai , India",
//       },
//     },
//     {
//       rating: 5,
//       review:
//         "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
//       user: {
//         name: "Prashansa Agrawal",
//         image: "/image/user.png",
//         place: "Mumbai , India",
//       },
//     },
//   ];
//   const [position, setPosition] = useState(0);
//   const CARD_WIDTH = 304;

//   const sliderRef = React.useRef<HTMLDivElement>(null);
//   const moveRight = () => {
//     const maxScroll = review.length * CARD_WIDTH - 3 * CARD_WIDTH;

//     setPosition((prev) => {
//       if (prev >= maxScroll) return prev;
//       return prev + CARD_WIDTH;
//     });
//   };

//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const scrollRight = () => {
//     sliderRef.current?.scrollBy({
//       left: 304, // 288 + 16 gap
//       behavior: "smooth",
//     });
//   };

//   const scrollLeft = () => {
//     sliderRef.current?.scrollBy({
//       left: -304,
//       behavior: "smooth",
//     });
//   };

//   const checkScroll = () => {
//     const el = sliderRef.current;
//     if (!el) return;

//     const { scrollLeft, scrollWidth, clientWidth } = el;
//     setCanScrollLeft(scrollLeft > 0);
//     setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
//   };

//   return (
//     <div className="w-full bg-[#DFF2EE] mt-48  md:mt-18 h-full">
//       <div className="grid grid-cols-1 md:grid-cols-12  h-full">
//         <div className=" col-span-5 py-4 flex items-start md:items-end md:justify-end w-full h-full">
//           <div className="space-y-3">
//             <h2 className="font-passion-one text-4xl md:text-6xl text-center md:text-start max-w-136 uppercase text-[#7B9691]">
//               Loved by Dancers Everywhere
//             </h2>
//             <p className="font-normal text-center md:text-start text-lg md:text-xl md:max-w-84 text-regular capitalize">
//               What students and professionals say about dancing with us.
//             </p>
//           </div>
//         </div>
//         <div className=" col-span-7 pal-6 md:p-6 overflow-hidden">
//           <div className="w-full  relative">
//             {canScrollLeft && (
//               <div
//                 className="h-full w-14 md:w-24  bg-transparent
//               absolute left-0 z-50 flex items-center justify-start"
//               >
//                 <Button
//                   onClick={scrollLeft}
//                   className="rounded-full bg-[#595959] size-10 md:size-12  cursor-pointer"
//                 >
//                   <ChevronLeft className="size-5 text-white" />
//                 </Button>
//               </div>
//             )}
//             {canScrollRight && (
//               <div
//                 className="h-full w-14 md:w-24  bg-[linear-gradient(262.81deg,rgba(223,242,238,0.9)_46.14%,rgba(223,242,238,0)_90.51%)]
//               absolute right-0 z-50 flex items-center justify-right"
//               >
//                 <Button
//                   onClick={scrollRight}
//                   className="rounded-full bg-[#595959] size-10 md:size-12  cursor-pointer"
//                 >
//                   <ChevronRight className="size-5 text-white" />
//                 </Button>
//               </div>
//             )}
//             <div
//               ref={sliderRef}
//               onScroll={checkScroll}
//               className=" relative flex gap-4 overflow-auto scrollbar-none transition-transform duration-500"
//               style={{ transform: `translateX(-${position}px)` }}
//             >
//               {review.map((e, i) => (
//                 <div
//                   className="bg-[#F5FAFF] h-84 rounded-2xl min-w-72 w-72 p-6 border border-[#C2DDD8] flex justify-between flex-col gap-8"
//                   key={i}
//                 >
//                   <div className="w-full flex flex-col gap-3">
//                     <p className="">{e.rating}/5</p>
//                     <p className="capitalize text-sm md:text-md text-regular leading-5">
//                       {e.review}
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <div className="size-10 ">
//                       <Image
//                         className="rounded-full object-cover"
//                         src={e.user.image}
//                         height={100}
//                         width={100}
//                         alt=""
//                       />
//                     </div>
//                     <div className="flex flex-col gap-1">
//                       <h3 className="text-sm text-[#7B9691]">{e.user.name}</h3>
//                       <p className="text-xs text-[#7B9691]">{e.user.place}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ReviewSection;


"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";

function ReviewSection() {

  const review = [
    {
      rating: 5,
      review:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
      user: {
        name: "Prashansa Agrawal",
        image: "/image/user.png",
        place: "Mumbai , India",
      },
    },
    {
      rating: 5,
      review:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
      user: {
        name: "Prashansa Agrawal",
        image: "/image/user.png",
        place: "Mumbai , India",
      },
    },
    {
      rating: 5,
      review:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer",
      user: {
        name: "Prashansa Agrawal",
        image: "/image/user.png",
        place: "Mumbai , India",
      },
    },
  ];

  const sliderRef = React.useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 304,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -304,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      className="w-full bg-[#DFF2EE] mt-48 md:mt-18 h-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">

        {/* LEFT TEXT */}
        <motion.div
          className="col-span-5 py-4 flex items-start md:items-end md:justify-end w-full h-full"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="space-y-3">
            <h2 className="font-passion-one text-4xl md:text-6xl text-center md:text-start max-w-136 uppercase text-[#7B9691]">
              Loved by Dancers Everywhere
            </h2>

            <p className="font-normal text-center md:text-start text-lg md:text-xl md:max-w-84 text-regular capitalize">
              What students and professionals say about dancing with us.
            </p>
          </div>
        </motion.div>

        {/* REVIEWS */}
        <div className="col-span-7 p-6 overflow-hidden">

          <div className="w-full relative">

            <Button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-[#595959] size-10 md:size-12 z-20"
            >
              <ChevronLeft className="size-5 text-white" />
            </Button>

            <Button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-[#595959] size-10 md:size-12 z-20"
            >
              <ChevronRight className="size-5 text-white" />
            </Button>

            <motion.div
              ref={sliderRef}
              className="flex gap-4 overflow-auto scrollbar-none"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {review.map((e, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#F5FAFF] h-84 rounded-2xl min-w-72 w-72 p-6 border border-[#C2DDD8] flex justify-between flex-col gap-8 shadow-sm"
                >
                  <div className="flex flex-col gap-3">
                    <p>{e.rating}/5</p>

                    <p className="capitalize text-sm md:text-md text-regular leading-5">
                      {e.review}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    <div className="size-10">
                      <Image
                        className="rounded-full object-cover"
                        src={e.user.image}
                        height={100}
                        width={100}
                        alt=""
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm text-[#7B9691]">{e.user.name}</h3>
                      <p className="text-xs text-[#7B9691]">{e.user.place}</p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default ReviewSection;