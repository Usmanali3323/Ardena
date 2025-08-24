"use client";

import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/home/heroSection";
import FeaturedProducts from "@/components/home/featureProduct";

import RecentlyAdded from "@/components/home/recentlyAdded";

import { useEffect } from "react";

export default function Home() {

  
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
  return (
  <>
 <HeroSection/>
 <FeaturedProducts/>

 <RecentlyAdded/>

  </>
  );
}
