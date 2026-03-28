import React from "react";

function Teaching() {
  return (
    <div className="w-full h-full py-14">
      <div className="bg-[#C4B1D4] rounded-3xl flex flex-col md:flex-row items-center py-12 gap-2">
        <div className="md:w-[40%] flex items-center justify-center pl-8 pr-12">
          <h2 className="uppercase font-passion-one text-center w-fit text-4xl md:text-5xl lg:text-6xl  text-[#4B4740]">
            Teaching Philosophy
          </h2>
        </div>
        <div className="md:w-[60%] w-full text-center md:text-left">
          <div className="mx-auto md:mx-0 w-[80%] md:w-[70%] h-full space-y-6">
            <h3 className="font-extrabold text-[#4B4740] uppercase">
              More Than Just Choreography
            </h3>
            <p className="md:font-medium text-md font-bold leading-6 md:text-lg text-[#4B4740]">
              For Vicky–Akku, dance is about emotion, connection, and happiness.
              Their teaching style focuses on helping dancers feel confident,
              expressive, and present creating a space where learning feels
              joyful and natural.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teaching;
