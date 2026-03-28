import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import UpcomingWorkshop from "./UpcomingWorkshop";
import { motion, useInView } from "motion/react";
import { header } from "motion/react-client";
import { useRouter } from "next/navigation";

function Hero() {
  const headerRef = React.useRef(null);
  const mobileHeroImgRef = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(headerRef, { once: true });
  const mobileHeroImgInView = useInView(mobileHeroImgRef, { once: true });
  const router=useRouter()
  return (
    <div className=" bg-hero min-h-[150vh] relative w-full">
      <div className="w-full  h-full relative">
        <div className="absolute   left-1/2 top-36 hidden md:block">
          <motion.div
            initial={{ y: "500px", opacity: 0 }}
            animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className=" relative z-20 "
          >
            <Image
              alt="hero"
              className="w-2xl"
              sizes="100vw"
              priority
              quality={100}
              src={"/image/img_hero.webp"}
              height={100}
              width={100}
            />
          </motion.div>
        </div>
        <div className=" absolute   top-[120px]  translate-x-1/2a rigaht-1/2  w-full ">
          <div className="flex b  flex-col items-centers justify-centesr max-w-6xl mx-auto">
            <div className="px-4 md:px-0">
              <motion.h1
                ref={headerRef}
                initial={{ filter: "blur(20px)", opacity: 0 }}
                animate={isInView ? { filter: "blur(0px)", opacity: 1 } : {}}
                transition={{ duration: 0.4 }}
                className=" uppercase   wrap-anywhere font-bold  whitespace-pre-wrap text-center leading-27 md:leading-56  text-[98px] md:text-[164px] md:line-clamp-1 font-open-sauce text-white italic"
              >
                Vicky Akku
              </motion.h1>
            </div>
            <div className=" w-full">
              <div className=" relative  w-full md:w-fit md:absolute right-[0%] md:right-[45%]">
                <p className="text-center font-normal uppercase md:text-starst p  text-white font-passion-one text-[40px] md:text-8xl">
                  Dance classes
                </p>
                <div className="max-w-42 mt-10 w-full absolute md:relative left-1/2 md:left-0 -translate-x-1/2  md:translate-x-0 space-y-3 flex items-center md:items-start justify-center flex-col">
                  <h4 className="text-[#777873] font-semibold text-center md:text-start text-lg md:text-2xl">
                    Where dance feels like hapiness
                  </h4>
                  <motion.div
                    initial={{ y: "50px", opacity: 0 }}
                    animate={{ y: "0", opacity: 1 }}
                    transition={{ duration: 0.6, ease: "anticipate" }}
                  >
                    <Button onClick={()=>router.push(`/workshop`)} className="rounded-full text-lg px-4 py-6 md:text-md font-open-sauce cursor-pointer uppercase w-full max-wa-36">
                      Start Today
                    </Button>
                  </motion.div>
                  <motion.div
                    ref={mobileHeroImgRef}
                    initial={{ y: "200px", opacity: 0.3 }}
                    animate={mobileHeroImgInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="md:hidden  size-90 max-w-90"
                  >
                    <Image
                      alt="hero"
                      className="w-full object-contain"
                      sizes="100vw"
                      priority
                      quality={100}
                      src={"/image/img_hero.webp"}
                      height={100}
                      width={100}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
