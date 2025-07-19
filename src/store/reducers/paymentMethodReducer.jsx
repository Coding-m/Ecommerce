const initialState = {
  paymentMethod: null,
  razorpayOrder: null, 
};

export const paymentMethodReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case "RAZORPAY_ORDER_CREATED":
      return {
        ...state,
        razorpayOrder: action.payload, 
      };

    default:
      return state;
  }
};
