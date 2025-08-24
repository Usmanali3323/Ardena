"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AboutPage() {
  const images = [
    "/hero-section/imag1.png",
    "/hero-section/imag2.png",
    "/hero-section/imag3.png",
    "/hero-section/imag4.png",
    "/hero-section/imag5.png",
    "/hero-section/imag6.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="mt-5 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            About Ardena
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Redefining fashion with timeless elegance, quality craftsmanship, and modern design.
          </p>
        </div>

        {/* Brand Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">
              Ardena was born with a vision: to create clothing that empowers confidence 
              and inspires individuality. We believe fashion is not just about trends but 
              about timeless pieces that reflect your personality.
            </p>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">
              Each Ardena collection is crafted with care, blending modern aesthetics 
              with premium materials to ensure both comfort and durability.
            </p>
          </div>

          {/* Image Slideshow */}
          <div className="relative w-full h-80 overflow-hidden">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Ardena Fashion ${index + 1}`}
                fill
                className={`object-contain absolute top-0 left-0 transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mt-20 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">✨ Elegance</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our designs embody timeless elegance, ensuring every outfit is a statement.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">🌿 Sustainability</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ardena is committed to eco-friendly practices, from sourcing to production.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">🤝 Community</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We celebrate individuality and inclusivity, making fashion accessible to all.
            </p>
          </div>
        </div>

        {/* Closing Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Ardena Movement</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Fashion is more than what you wear — it’s who you are. With Ardena, embrace 
            your unique style and walk with confidence.
          </p>
          <Link
            href="/product"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            Explore Our Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
