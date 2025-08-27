import React from 'react'
import Link from "next/link";
import Image from "next/image";
import AddToCart from './product/addToCart';
import Loading from '@/loading';
import { useRouter } from 'next/navigation';

function productBox({products}) {
  const router = useRouter()
  return (
             <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {products  &&  products.map((product) => {
                      const finalPrice =
                        product.price *
                        (1 - (product.discount_percent || 0) / 100);
        
                      return (
                        <div
                          key={product.id}
                          className="group bg-white dark:bg-gray-900 rounded-xl hover:cursor-pointer shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                          onClick={()=>router.push(`/product/${product.id}`)}
                        >
                          {/* Product Image */}
                          <div className="relative w-full h-64 overflow-hidden">
                            <Image
                              src={product.images?.[0] || "/placeholder.png"}
                              alt={product.title || "Product Image"}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.discount_percent > 0 && (
                              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                -{product.discount_percent}%
                              </span>
                            )}
                          </div>
        
                          {/* Product Content */}
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                              {product.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                              {product.description || "No description available."}
                            </p>
        
                            {/* Price + Add to Cart */}
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex gap-2">
                                <span className="text-base font-bold text-pink-500">
                                  {process.env.NEXT_PUBLIC_CURRENCY + " "}{finalPrice.toFixed()}
                                </span>
                                {product.discount_percent > 0 && (
                                  <span className="text-sm line-through text-gray-400">
                                    {process.env.NEXT_PUBLIC_CURRENCY}{product.price}
                                  </span>
                                )}
                              </div>
                              
                              <AddToCart product={product} />
                    
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
  )
}

export default productBox