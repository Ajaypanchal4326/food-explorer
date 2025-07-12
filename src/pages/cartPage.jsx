import { useContext } from "react";
import { CartContext } from "../context/cartcontext";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="pt-24 px-4 md:px-20 pb-10 min-h-screen bg-gray-200">
      <h1 className="text-3xl font-bold mb-6">
        Your Cart
        <FaShoppingCart />
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center mt-10 text-gray-600">
          <p className="mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ← Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded shadow p-4 m-2 flex items-center gap-4"
            >
              <img
                src={item.image_front_thumb_url || "/no-image.jpg"}
                alt={item.product_name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {item.product_name || "No Name"}
                </h2>
                <p className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]">
                  {item.categories || "No category"}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.code)}
                className="text-red-500 font-bold text-3xl"
              >
                <IoClose />
              </button>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              ← Continue Shopping
            </button>
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
