import { useState } from "react";
import Products from "./components/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Navbar from "./components/Navbar";
import Cart from "./cart/Cart";
import { Toaster } from "react-hot-toast";
import LogIn from "./login/LogIn";
import CheckOut from "./components/checkout/CheckOut";
import Register from "./Register/Register"
import PrivateRoute from "./components/PrivateRoute";


const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LogIn/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/checkout" element={<CheckOut/>}/>
          <Route path="/" element={<PrivateRoute publicPage/>}/>
          

        </Routes>
      </Router>

      <Toaster position="top-right" />
    </>
  );
};

export default App;
