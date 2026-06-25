import { useState, useEffect } from "react";

const slides = [
    {
    title: "Spring Collection",
    subtitle: "Fresh arrivals for every style.",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1280&q=80",
    cta: "Shop Now",
  },
  {
    title: "Streetwear Essentials",
    subtitle: "Bold looks that stand out in every crowd.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1280&q=80",
    cta: "View Collection",
  },
  {
    title: "Everyday Comfort",
    subtitle: "Premium pieces made for life on the go.",
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1280&q=80",
    cta: "Explore Now",
  },
];

function BannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

    return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      <div className="relative h-[320px] sm:h-[420px]">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center items-start gap-4 px-6 sm:px-12 lg:px-20 max-w-2xl">
              <span className="text-sm uppercase tracking-[0.35em] text-amber-300">
                New arrivals
              </span>
              <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
                {slide.title}
              </h1>
              <p className="max-w-xl text-sm sm:text-base text-stone-100/90">
                {slide.subtitle}
              </p>
              <button className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-stone-900 shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition">
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}


export default BannerSlider;