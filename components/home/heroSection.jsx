"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const heroImages = [
  "/hero-section/imag1.png",
  "/hero-section/imag2.png",
  "/hero-section/imag3.png",
  "/hero-section/imag4.png",
  "/hero-section/imag5.png",
  "/hero-section/imag6.png",
];

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto change every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black text-gray-900 dark:text-gray-100 pt-28 pb-20 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 relative z-10">
        
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Discover the Future of{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
              Fashion
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto md:mx-0">
          Discover premium clothing designed for comfort, crafted for elegance, and styled for every occasion. From everyday essentials to statement pieces Ardena brings timeless fashion to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/product"
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white px-8 py-3 rounded-xl shadow-md text-lg font-semibold hover:opacity-90 hover:scale-105 transition-transform"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="border border-pink-500 text-pink-600 dark:text-pink-400 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-pink-500 hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Content: full smooth image fade */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative w-full max-w-md md:max-w-lg lg:max-w-xl">
          <div className="relative w-full h-[450px]">
            {heroImages.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Hero Image ${index + 1}`}
                fill
                className={`absolute inset-0 object-contain transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle background glow */}
      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 via-pink-400/20 to-yellow-300/20 blur-3xl rounded-full opacity-60 animate-pulse pointer-events-none" />
    </section>
  );
}

export default HeroSection;
