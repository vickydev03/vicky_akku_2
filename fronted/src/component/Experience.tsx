import Image from "next/image";

export default function ExperienceSection() {
  return (
    <section className="bg-[#EDE7EF] py-8 lg:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className=" text-5xl md:text-5xl lg:text-6xl font-passion-one text-[#4B4740]  text-center mb-12">
          EXPERIENCE & WORK
        </h2>

        <div className="space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
            {/* Image (1fr) */}
            <div className="relative h-[200px] md:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden">
              <Image
                src="/image/contect_details.jpg"
                alt="Group"
                fill
                className="object-cover"
              />
            </div>

            {/* Text (400px) */}
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center md:items-start justify-center">
              <h3 className="font-bold  text-xl text-[#535353] mb-4">
                A DECADE OF DANCE
              </h3>
              <p className="text-[#535353] text-center md:text-start font-medium leading-relaxed">
                Over the years, they have choreographed for music videos, ad
                shoots, and live performances. Their expressive style & clean
                storytelling have earned them recognition across the dance
                community.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
            {/* Text (400px) */}
            <div className="bg-white order-2 md:order-1 rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-bold text-[#535353] text-xl mb-4 text-center md:text-left">
                FAMOUS WORKS
              </h3>
              <p className="text-[#4B4740] leading-relaxed font-medium text-center md:text-start">
                One of their most loved creations, “Aavan Jaavan,” beautifully
                captures their signature style, emotional, graceful, and deeply
                connected to music.
              </p>
            </div>

            {/* Image (1fr) */}
            <div className="relative h-[200px] order-1 md:order-2 md:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden">
              <Image
                src="/image/workshop3.webp"
                alt="Group"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
