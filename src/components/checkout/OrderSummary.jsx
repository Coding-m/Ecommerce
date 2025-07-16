import React from 'react'
import { formatPriceCalculation } from '../../utils/formatPrice'

const OrderSummary = ({ cart, address, paymentMethod }) => {
  // ✅ Calculate total from cart
  const calculatedTotal = cart?.reduce((acc, item) => {
    const price = Number(item.specialPrice) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);

  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="flex flex-wrap">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-8/12 pr-4">
          <div className="space-y-4">
            {/* Billing Address */}
            <div className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Billing Address</h2>
              <p><strong>Building Name:</strong> {address?.buildingName || 'N/A'}</p>
              <p><strong>City:</strong> {address?.city || 'N/A'}</p>
              <p><strong>Street:</strong> {address?.street || 'N/A'}</p>
              <p><strong>State:</strong> {address?.state || 'N/A'}</p>
              <p><strong>Pincode:</strong> {address?.pincode || 'N/A'}</p>
              <p><strong>Country:</strong> {address?.country || 'N/A'}</p>
            </div>

            {/* Payment Method */}
            <div className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
              <p><strong>Method:</strong> {paymentMethod || 'N/A'}</p>
            </div>

            {/* Order Items */}
            <div className="pb-4 border rounded-lg shadow-sm mb-6">
              <h2 className="text-2xl font-semibold mb-2">Order Items</h2>
              <div className="space-y-2">
                {cart?.map((item) => (
                  <div key={item?.productId} className="flex items-center gap-4">
                    <img
                      src={`${import.meta.env.VITE_BACK_END_URL}images/${item?.image}`}
                      alt={item?.productName}
                      className="w-12 h-12 rounded"
                    />
                    <div className="text-gray-700">
                      <p className="font-medium">{item?.productName}</p>
                      <p>
                        {item?.quantity} x ${item?.specialPrice} = $
                        {formatPriceCalculation(item?.quantity, item?.specialPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-4/12 mt-4 lg:mt-0">
          <div className="border rounded-lg shadow-sm p-4 space-y-4">
            <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Products</span>
                <span>${calculatedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>SubTotal</span>
                <span>${calculatedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
