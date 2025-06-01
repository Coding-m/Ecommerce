import { useState } from "react";
import { useDispatch } from "react-redux";
import { HiOutlineShoppingCart } from "react-icons/hi";
import truncateText from "./TruncateText";
import ProductViewModel from "./productViewModel";
import { addToCart } from "../store/actions";
import toast from "react-hot-toast"

const ProductCard = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  about,
}) => {
  const [openProductViewModal, setOpenProductViewModal] = useState(false);
  const [selectedViewProduct, setSelectedViewProduct] = useState(null);
  const dispatch = useDispatch();

  const isAvailable = quantity && Number(quantity) > 0;

  const handleProductView = (product) => {
    setSelectedViewProduct(product);
    setOpenProductViewModal(true);
  };

  const productDetails = {
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    about,
  };

  const addToCartHandler = () => {
    dispatch(addToCart(productDetails, 1,toast));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out p-3 min-h-[400px] flex flex-col justify-between">
      <div onClick={() => handleProductView(productDetails)} className="cursor-pointer">
        <div className="w-full h-44 overflow-hidden rounded-md mb-2">
          <img
            src={image}
            alt={productName}
            className="w-full h-full object-cover rounded-md transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>

        <h3 className="text-[14px] lg:text-[16px] font-semibold text-slate-700 mb-1 truncate">
          {truncateText(productName, 20)}
        </h3>

        <p className="text-[13px] text-slate-500 line-clamp-2">
          {truncateText(description, 15)}
        </p>
      </div>

      <div className="mt-2">
        {discount ? (
          <>
            <span className="text-gray-400 line-through mr-2 text-[17px]">
              ${price.toFixed(2)}
            </span>
            <span className="text-green-600 font-bold text-[19px]">
              ${specialPrice.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-slate-700 font-bold text-[18px]">
            ${price.toFixed(2)}
          </span>
        )}
      </div>

      <div className="mt-2 flex justify-end">
        <button
          disabled={!isAvailable}
          onClick={addToCartHandler}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-sm rounded-md text-white font-medium transition-colors duration-200 ${
            isAvailable
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <HiOutlineShoppingCart size={16} />
          {isAvailable ? "Add to Cart" : "Stock Out"}
        </button>
      </div>

      <ProductViewModel
        open={openProductViewModal}
        setOpen={setOpenProductViewModal}
        product={selectedViewProduct}
        isAvailable={isAvailable}
      />
    </div>
  );
};

export default ProductCard;
