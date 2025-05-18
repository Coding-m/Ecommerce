import React, { useState } from "react";
import Products from "./components/Products";


const App = () => {
  const[count,setCount]=useState(0)
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Products/>
    </div>
  );
};

export default App;
