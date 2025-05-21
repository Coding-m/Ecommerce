import api from "../../api/api";
import toast from "react-hot-toast"

// Fetch products
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

// Fetch categories
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
        dispatch({ type: "IS_SUCCESS" }); // Fixed: it incorrectly dispatched IS_ERROR
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
        });
    }
};

// Add to cart
export const addToCart = (data, qty = 1,toast) => (dispatch, getState) => {
    const { products } = getState().products;

    const productInStore = products.find(
        (item) => item.productId === data.productId
    );

    if (!productInStore) {
        alert("Product not found in store");
        return;
    }

    const isQuantityAvailable = productInStore.quantity >= qty;

    if (isQuantityAvailable) {
        dispatch({ type: "ADD_CART", payload: { ...data, quantity: qty } });
       toast.success(`${data?.productName} added to cart`);
       localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        //toast.success(`${data?.productName} added to cart`);
    } else {
        toast.error("out of stock");
    }
};
