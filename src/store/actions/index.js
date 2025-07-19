import api from "../../api/api"

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
         });
    }
};


export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_ERROR" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};


export const addToCart = (data, qty = 1, toast) => 
    (dispatch, getState) => {
        // Find the product
        const { products } = getState().products;
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        // Check for stocks
        const isQuantityExist = getProduct.quantity >= qty;

        // If in stock -> add
        if (isQuantityExist) {
            dispatch({ type: "ADD_CART", payload: {...data, quantity: qty}});
            toast.success(`${data?.productName} added to the cart`);
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        } else {
            // error
            toast.error("Out of stock");
        }
};


export const increaseCartQuantity = 
    (data, toast, currentQuantity, setCurrentQuantity) =>
    (dispatch, getState) => {
        // Find the product
        const { products } = getState().products;
        
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        const isQuantityExist = getProduct.quantity >= currentQuantity + 1;

        if (isQuantityExist) {
            const newQuantity = currentQuantity + 1;
            setCurrentQuantity(newQuantity);

            dispatch({
                type: "ADD_CART",
                payload: {...data, quantity: newQuantity + 1 },
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        } else {
            toast.error("Quantity Reached to Limit");
        }

    };



export const decreaseCartQuantity = 
    (data, newQuantity) => (dispatch, getState) => {
        dispatch({
            type: "ADD_CART",
            payload: {...data, quantity: newQuantity},
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }

export const removeFromCart =  (data, toast) => (dispatch, getState) => {
    dispatch({type: "REMOVE_CART", payload: data });
    toast.success(`${data.productName} removed from cart`);
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
}


export const authenticateSignInUser = (
  sendData,
  toast,
  reset,
  navigate,
  setLoader
) => async (dispatch) => {
  try {
    setLoader(true);
    const { data } = await api.post("/auth/signin", sendData);

    // Clean jwtToken if needed
    let token = data.jwtToken;
    if (token?.includes("=")) token = token.split("=")[1];
    if (token?.includes(";")) token = token.split(";")[0];
    data.jwtToken = token?.trim();

    // Save auth data
    localStorage.setItem("auth", JSON.stringify(data));

    // Dispatch login
    dispatch({ type: "LOGIN_USER", payload: data });
    toast.success("Login Successful ✅");

    // ✅ Redirect based on roles
    if (Array.isArray(data.roles) && data.roles.includes("ROLE_ADMIN")) {
      navigate("/admin"); // 👉 Admin dashboard
    } else {
      navigate("/"); // 👉 Normal users go to home
    }

    reset && reset();
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message ||
        "Invalid credentials. Please try again."
    );
  } finally {
    setLoader(false);
  }
};

  

export const registerNewUser 
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signup", sendData);
            reset();
            toast.success(data?.message || "User Registered Successfully");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};


export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type:"LOG_OUT" });
    localStorage.removeItem("auth");
    navigate("/login");
};


export const addUpdateUserAddress =
  (sendData, toast, addressId, setOpenAddressModal) => async (dispatch) => {
    dispatch({ type: "BUTTON_LOADER" });

    // ✅ Get token from localStorage
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.jwtToken;

    try {
      if (!addressId) {
        await api.post("/addresses", sendData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/addresses/${addressId}`, sendData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      dispatch(getUserAddresses());
      toast.success("Address saved successfully");
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
      dispatch({ type: "IS_ERROR", payload: null });
    } finally {
      setOpenAddressModal(false);
    }
  };

  export const deleteUserAddress =
  (toast, addressId, setOpenDeleteModal) => async (dispatch) => {
    dispatch({ type: "BUTTON_LOADER" });

    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.jwtToken;

    try {
      await api.delete(`/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "IS_SUCCESS" });
      dispatch(getUserAddresses());
      dispatch(clearCheckoutAddress());
      toast.success("Address deleted successfully");
    } catch (error) {
      console.log(error);
      dispatch({
        type: "IS_ERROR",
        payload: error?.response?.data?.message || "Some Error Occured",
      });
    } finally {
      setOpenDeleteModal(false);
    }
  };



export const clearCheckoutAddress = () => {
    return {
        type: "REMOVE_CHECKOUT_ADDRESS",
    }
};
export const getUserAddresses = () => async (dispatch) => {
    dispatch({ type: "IS_FETCHING" });
  
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.jwtToken;
  
    try {
      const { data } = await api.get(`/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "USER_ADDRESS", payload: data });
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "IS_ERROR",
        payload: error?.response?.data?.message || "Failed to fetch user addresses",
      });
    }
  };
  

export const selectUserCheckoutAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
    
    return {
        type: "SELECT_CHECKOUT_ADDRESS",
        payload: address,
    }
};


export const addPaymentMethod = (method) => {
    return {
        type: "ADD_PAYMENT_METHOD",
        payload: method,
    }
};


export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart());
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
         });
    }
};


export const getUserCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/carts/users/cart');
        
        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: data.products,
            totalPrice: data.totalPrice,
            cartId: data.cartId
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
         });
    }
};


export const createStripePaymentSecret 
    = (totalPrice) => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING" });
            const { data } = await api.post("/order/stripe-client-secret", {
                "amount": Number(totalPrice) * 100,
                "currency": "usd"
              });
            dispatch({ type: "CLIENT_SECRET", payload: data });
              localStorage.setItem("client-secret", JSON.stringify(data));
              dispatch({ type: "IS_SUCCESS" });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to create client secret");
        }
};


export const stripePaymentConfirmation 
    = (sendData, setErrorMesssage, setLoadng, toast) => async (dispatch, getState) => {
        try {
            const response  = await api.post("/order/users/payments/online", sendData);
            if (response.data) {
                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("cartItems");
                localStorage.removeItem("client-secret");
                dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS"});
                dispatch({ type: "CLEAR_CART"});
                toast.success("Order Accepted");
              } else {
                setErrorMesssage("Payment Failed. Please try again.");
              }
        } catch (error) {
            setErrorMesssage("Payment Failed. Please try again.");
        }
};



import { toast } from "react-toastify"; // ✅ Make sure you have react-toastify installed

// ✅ Create Razorpay order on backend
export const createRazorpayOrder = (totalPrice) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });

    // ✅ Call backend API (no extra /api)
    const { data } = await api.post(
      "/payments/create_order",
      null,
      {
        params: { amount: totalPrice, currency: "INR" },
      }
    );

    // ✅ Parse response if backend returns as string
    let orderData = data;
    if (typeof data === "string") {
      try {
        orderData = JSON.parse(data);
      } catch (e) {
        console.warn("⚠️ Could not parse Razorpay order JSON:", data);
      }
    }

    // ✅ Dispatch Redux action
    dispatch({ type: "RAZORPAY_ORDER_CREATED", payload: orderData });

    // ✅ Show success toast
    toast.success("✅ Razorpay order created");
    dispatch({ type: "IS_SUCCESS" });

    return orderData;
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    toast.error(
      error?.response?.data?.message || "Failed to create Razorpay order"
    );
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to create Razorpay order",
    });
  }
};
