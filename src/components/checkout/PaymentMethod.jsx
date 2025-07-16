import React from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addPaymentMethod } from "../../store/actions";

const PaymentMethod = () => {
  const dispatch = useDispatch();

  // ✅ Get current payment method from Redux
  const { paymentMethod } = useSelector((state) => state.payment);

  // ✅ Handle selection change
  const handlePaymentChange = (event) => {
    const selectedMethod = event.target.value;

    // 👉 Update Redux state
    dispatch(addPaymentMethod(selectedMethod));

    // 👉 Save to localStorage (optional)
    localStorage.setItem("paymentMethod", selectedMethod);

    console.log("✅ Payment method selected:", selectedMethod);
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-md rounded-lg mt-16 border">
      <h1 className="text-2xl font-semibold mb-4">Select Payment Method</h1>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="payment method"
          name="paymentMethod"
          value={paymentMethod || ""}
          onChange={handlePaymentChange}
        >
          <FormControlLabel
            value="Stripe"
            control={<Radio color="primary" />}
            label="Stripe"
            className="text-gray-700"
          />
          <FormControlLabel
            value="Paypal"
            control={<Radio color="primary" />}
            label="Paypal"
            className="text-gray-700"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default PaymentMethod;
