// ✅ Razorpay payment component (Testing redirect)
import React from "react";

const PaymentTest = () => {
  const handleRazorpayPayment = () => {
    // ✅ Redirect to your backend controller that serves templates/index.html
    window.location.href = "http://localhost:8080/razorpay";
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Pay with Razorpay (Testing)</h3>
      <button
        onClick={handleRazorpayPayment}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentTest;
