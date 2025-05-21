import { useState } from "react";
import Products from "./components/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

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

        </Routes>
      </Router>

      <Toaster position="top-right" />
    </>
  );
};

export default App;
