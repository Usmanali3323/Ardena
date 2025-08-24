"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import AddToCart from "@/components/product/addToCart";
import { Review } from "@/components/review";
import Loading from "@/loading";

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          console.error("Fetch error, status:", res.status);
          return;
        }
        const data = await res.json();
        const p = data.product;
        setProduct(p);

        // ✅ default select first image + sku + color + size
        if (p?.images?.length > 0) {
          setSelectedImage(p.images[0]);
          if (p?.sku?.length > 0) setSelectedSku(p.sku[0]);
        }
        if (p?.variants?.size?.length > 0) {
          setSelectedSize(p.variants.size[0]);
        }
        if (p?.variants?.color?.length > 0) {
          setSelectedColor(p.variants.color[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <Loading/>;

  const decreaseQty = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQty = () => quantity < product.stock && setQuantity(quantity + 1);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0;

  const finalPrice = product.price * (1 - (product.discount_percent || 0) / 100);

  return (
    <div className="py-14 mt-5 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="relative w-full h-72 sm:h-80 lg:h-[420px] mb-3 rounded-lg overflow-hidden shadow">
            <Image
              src={selectedImage || "/fallback.jpg"}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-2">
            {product.images?.map((img, i) => (
              <div
                key={i}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 cursor-pointer border rounded overflow-hidden transition-transform duration-200 hover:scale-105 ${
                  selectedImage === img ? "border-blue-500" : "border-gray-200"
                }`}
                onClick={() => {
                  setSelectedImage(img);
                  if (product?.sku?.[i]) setSelectedSku(product.sku[i]);
                  if (product?.variants?.color?.[i]) setSelectedColor(product.variants.color[i]); // ✅ sync color
                }}
              >
                <Image
                  src={img}
                  alt={`${product.name}-${i}`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-400 text-sm sm:text-base">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(avgRating) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              {avgRating} ({reviews.length}{" "}
              <Link href={`/product/${product.id}/reviews`}>reviews</Link>)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-red-600">PKR {finalPrice}</span>
            {product.discount_percent > 0 && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  PKR {product.price}
                </span>
                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">
                  {product.discount_percent}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4">{product.description}</p>

          {/* Size Selector */}
          {product.variants?.size?.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-1">Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.variants.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2.5 py-1 border rounded text-xs sm:text-sm ${
                      selectedSize === size
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.variants?.color?.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-1">Color</h3>
              <div className="flex gap-2 flex-wrap">
                {product.variants.color.map((color, i) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      if (product?.images?.[i]) setSelectedImage(product.images[i]); // ✅ sync image
                      if (product?.sku?.[i]) setSelectedSku(product.sku[i]); // ✅ sync sku
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      selectedColor === color
                        ? "border-pink-500 scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-3">
            <h3 className="text-sm font-medium mb-1">Quantity</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseQty}
                className="w-7 h-7 flex items-center justify-center border rounded text-sm font-bold hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-sm">{quantity}</span>
              <button
                onClick={increaseQty}
                className="w-7 h-7 flex items-center justify-center border rounded text-sm font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Stock: {product.stock} | Sold: {product.sold}
          </p>

          {/* Add to Cart Button */}
          <AddToCart
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            selectedImage={selectedImage}
            selectedSku={selectedSku || product.sku?.[0]} // ✅ safe fallback
          />

          {/* Reviews */}
          <Review productId={product.id} setReviews={setReviews} />
        </div>
      </div>
    </div>
  );
}
