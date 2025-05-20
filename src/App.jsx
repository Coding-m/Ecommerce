import { useState } from "react";
import Products from "./components/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />

      </Routes>
    </Router>

    // Uncomment this block if you want to display the Products component directly:
    // <div className="min-h-screen bg-gray-100 p-6">
    //   <Products />
    // </div>
  );
};

export default App;
