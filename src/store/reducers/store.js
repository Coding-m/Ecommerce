import { configureStore } from '@reduxjs/toolkit';
import { productReducer } from './ProductReducer';
import { errorReducer } from './errorReducer';

export const store = configureStore({
  reducer: {
    products: productReducer,
    errors: errorReducer,
  },
  // remove preloadedState if no initial state to preload
});

export default store;
