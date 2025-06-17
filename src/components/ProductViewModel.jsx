import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import Status from "./Status"; // Make sure the path is correct

function ProductViewModel({ open, setOpen, product, isAvailable }) {
  if (!product) return null;

  const {
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    about,
  } = product;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/45" />

      {/* Centered dialog container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Dialog Panel */}
        <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-4">
          <DialogTitle className="text-xl font-bold text-gray-800">
            {productName}
          </DialogTitle>

          <Description className="text-sm text-gray-600">
            {description}
          </Description>

          <img
            src={image}
            alt={productName}
            className="w-full h-64 object-cover rounded-md"
          />

          {/* Stock Status - Left Aligned */}
          <div className="mt-2 flex justify-end">
            <Status
              text={isAvailable ? "In Stock" : "Stock Out"}
              icon={isAvailable ? HiCheckCircle : HiXCircle}
              bg={isAvailable ? "bg-green-100" : "bg-red-100"}
              color={isAvailable ? "text-green-700" : "text-red-700"}
            />
          </div>

          {/* Product Details */}
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Available:</strong> {quantity}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {discount ? (
                <>
                  <span className="line-through text-gray-400 mr-2">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-green-600 font-semibold">
                    ${specialPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span>${price.toFixed(2)}</span>
              )}
            </p>
            <p className="mt-2">
              <strong>About:</strong> {about}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ProductViewModel;
