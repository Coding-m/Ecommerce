const initialState = {
    cart: [],
    totalPrice: 0,
    cartId: null,
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_CART": {
            const product = action.payload;

            const existingProduct = state.cart.find(
                (item) => item.productId === product.productId
            );

            if (existingProduct) {
                const updatedCart = state.cart.map((item) => {
                    if (item.productId === product.productId) {
                        return product; // You may want to merge quantities instead
                    } else {
                        return item;
                    }
                });

                return {
                    ...state,
                    cart: updatedCart,
                };
            } else {
                const newCart = [...state.cart, product];
                return {
                    ...state,
                    cart: newCart,
                };
            }
        }

        default:
            return state;
    }
};
