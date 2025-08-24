
import React from 'react'
import Image from 'next/image'
function CartSummary({cart, total}) {
  return (
    <div className="space-y-6">
  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Order Summary</h2>
  {cart.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
  ) : (
    <div className="space-y-4">
      {cart && cart?.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-2xl transition overflow-hidden"
        >
          {/* Product Image */}
          <div className="w-24 h-24 relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              src={item.product_id.images[0]}
              alt={item.product_id.name}
              fill
              className="object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
              {item.product_id.name.length > 20 ? item.product_id.name.slice(0,20)+"..." : item.product_id.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Size: {item.size.toUpperCase()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              Color: 
              <span
                className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: item.color }}
              />
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
          </div>

          {/* Price */}
          <div className="text-right font-semibold text-gray-900 dark:text-gray-100">
            {process.env.NEXT_PUBLIC_CURRENCY} {item.price * item.quantity}
          </div>
        </div>
      ))}
      {/* Total */}
      <div className="flex justify-between font-bold text-2xl mt-6 border-t pt-4 text-gray-900 dark:text-gray-100">
        <span>Total:</span>
        <span>{process.env.NEXT_PUBLIC_CURRENCY} {total}</span>
      </div>
    </div>
  )}
</div>
  )
}

export default CartSummary