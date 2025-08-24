"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams(); // /products/[id]
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        const p = data.product;
        setProduct(p);

        // Defaults
        if (p?.images?.length > 0) {
          setSelectedImage(p.images[0]);
        }
        if (p?.variants?.size?.length > 0) {
          setSelectedSize(p.variants.size[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-6 text-gray-500">Loading...</p>;

  // Handle quantity change
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Images */}
      <div>
        {/* Main image */}
        <div className="w-full h-[450px] relative mb-4">
          <Image
            src={selectedImage || "/fallback.jpg"}
            alt={product.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        {/* Thumbnails */}
        <div className="flex gap-3">
          {product.images?.map((img, i) => (
            <div
              key={i}
              className={`relative w-20 h-20 cursor-pointer border-2 rounded-lg overflow-hidden ${
                selectedImage === img ? "border-blue-500" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt={`${product.name}-${i}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-2xl font-semibold mb-6">PKR {product.price}</p>

        {/* Size Selector */}
        {product.variants?.size?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Size</h3>
            <div className="flex gap-3">
              {product.variants.size.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                    selectedSize === size
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Quantity</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={decreaseQty}
              className="w-10 h-10 flex items-center justify-center border rounded-lg text-lg font-bold hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={increaseQty}
              className="w-10 h-10 flex items-center justify-center border rounded-lg text-lg font-bold hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Stock Info */}
        <p className="text-sm text-gray-500 mb-4">
          Stock: {product.stock} | Sold: {product.sold}
        </p>

        {/* Add to Cart */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Add {quantity} to Cart
        </button>
      </div>
    </div>
  );
}
