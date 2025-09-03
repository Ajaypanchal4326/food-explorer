import { useContext } from "react";
import { CartContext } from "../context/cartcontext";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart, FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } =
    useContext(CartContext);
  const navigate = useNavigate();

  // Helper function to get unique identifier for products
  const getUniqueKey = (item) => {
    return (
      item.code || item._id || item.product_name || `product_${Math.random()}`
    );
  };

  // Group items by unique identifier and calculate quantities
  const groupedItems = cartItems.reduce((acc, item) => {
    const key = getUniqueKey(item);
    if (acc[key]) {
      acc[key].quantity += 1;
    } else {
      acc[key] = { ...item, quantity: 1, uniqueKey: key };
    }
    return acc;
  }, {});

  const groupedItemsArray = Object.values(groupedItems);
  const totalItems = cartItems.length;
  const uniqueItems = groupedItemsArray.length;

  // Simplified quantity handlers
  const incrementQuantity = (item) => {
    if (updateQuantity) {
      updateQuantity(item.uniqueKey, item.quantity + 1);
    } else {
    }
  };

  const decrementQuantity = (item) => {
    if (updateQuantity) {
      if (item.quantity > 1) {
        updateQuantity(item.uniqueKey, item.quantity - 1);
      }
    } else {
      console.error("updateQuantity function not available");
    }
  };

  return (
    <div className="pt-24 px-4 md:px-8 lg:px-20 pb-10 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaShoppingCart className="text-blue-600 text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"} (
                {uniqueItems} unique{" "}
                {uniqueItems === 1 ? "product" : "products"}) in your cart
              </p>
            </div>
          </div>

          {/* Continue Shopping Button - Desktop */}
          <button
            onClick={() => navigate("/")}
            className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaArrowLeft className="text-sm" />
            Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-auto">
            <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FaShoppingCart className="text-gray-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Cart Items */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {groupedItemsArray.map((item, index) => (
                  <div
                    key={item.uniqueKey || index}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                          <img
                            src={
                              item.image_front_thumb_url ||
                              item.image_front_url ||
                              "/no-image.jpg"
                            }
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/no-image.jpg";
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                          {item.product_name || "Unnamed Product"}
                        </h3>

                        {/* Categories or Brands */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                          {item.brands && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-700">
                              {item.brands}
                            </span>
                          )}
                          {item.categories_tags &&
                            item.categories_tags.length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-700">
                                {item.categories_tags[0]
                                  .replace(/en:/g, "")
                                  .replace(/-/g, " ")}
                              </span>
                            )}
                        </div>

                        {/* Product Identifier */}
                        {item.code ? (
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            Barcode: {item.code}
                          </p>
                        ) : item._id ? (
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            Product ID: {item._id}
                          </p>
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            Product:{" "}
                            {item.product_name
                              ? item.product_name.substring(0, 15) + "..."
                              : "N/A"}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex-shrink-0">
                        {/* Mobile Layout - Stacked */}
                        <div className="flex flex-col gap-2 sm:hidden">
                          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                            <button
                              onClick={() => decrementQuantity(item)}
                              className="flex-1 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="px-3 py-2 font-semibold text-gray-800 bg-white border-x border-gray-200 min-w-[40px] text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item)}
                              className="flex-1 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-all duration-200"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.uniqueKey)}
                            className="w-full p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group text-center"
                            title="Remove from cart"
                          >
                            <IoClose className="text-lg group-hover:scale-110 transition-transform duration-200 inline" />
                            <span className="ml-1 text-xs">Remove</span>
                          </button>
                        </div>

                        {/* Desktop Layout - Horizontal */}
                        <div className="hidden sm:flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-lg">
                            <button
                              onClick={() => decrementQuantity(item)}
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-l-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="text-sm" />
                            </button>
                            <span className="px-4 py-2 font-semibold text-gray-800 bg-white border-x border-gray-200 min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item)}
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-r-lg transition-all duration-200"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.uniqueKey)}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                            title="Remove from cart"
                          >
                            <IoClose className="text-2xl group-hover:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="bg-gray-50 p-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-lg font-semibold text-gray-800">
                      Total Items: {totalItems}
                    </p>
                    <p className="text-sm text-gray-600">
                      {uniqueItems} unique{" "}
                      {uniqueItems === 1 ? "product" : "products"} • Ready for
                      checkout
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={clearCart}
                      className="bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 text-red-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Clear Cart
                    </button>
                    <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Shopping - Mobile */}
            <div className="md:hidden mt-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaArrowLeft className="text-sm" />
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
