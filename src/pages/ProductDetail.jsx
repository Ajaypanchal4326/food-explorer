import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoClose, IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";
import { FaShoppingCart, FaLeaf, FaInfoCircle } from "react-icons/fa";
import { useContext } from "react";
import { CartContext } from "../context/cartcontext";

const ProductDetails = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
          )}`
        );

        const parsed = JSON.parse(res.data.contents);
        console.log("Parsed Product:", parsed);

        if (parsed.status === 0 || !parsed.product) {
          throw new Error("Invalid barcode or product not found");
        }

        setProduct(parsed.product);
        setError(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(product);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (error) {
    return (
      <div className="pt-24 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md mx-auto text-center pt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoClose className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find this product. Please check the barcode and try
              again.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md mx-auto text-center pt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Product
            </h2>
            <p className="text-gray-600">Fetching product details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-8 lg:px-20 pb-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <IoArrowBack className="text-xl" />
            <span className="font-medium">Back to Products</span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-pulse">
            <IoCheckmarkCircle className="text-xl" />
            Added to cart successfully!
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={product.image_front_url || "/no-image.jpg"}
                  alt={product.product_name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/no-image.jpg";
                  }}
                />
              </div>
            </div>

            {/* Additional Images */}
            <div className="grid grid-cols-3 gap-4">
              {[
                product.image_ingredients_url,
                product.image_nutrition_url,
                product.image_packaging_url,
              ]
                .filter(Boolean)
                .map((imgUrl, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-2"
                  >
                    <img
                      src={imgUrl}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Product Information Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {product.product_name || "Unnamed Product"}
              </h1>

              {product.generic_name && (
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {product.generic_name}
                </p>
              )}

              {/* Product Code */}
              {barcode && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-gray-500">
                    Barcode:
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-mono text-sm">
                    {barcode}
                  </span>
                </div>
              )}

              {/* Labels */}
              {product.labels_tags && product.labels_tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FaLeaf className="text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Labels & Certifications
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.labels_tags.slice(0, 6).map((label, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm px-4 py-2 rounded-full capitalize font-medium"
                      >
                        {label.replace(/en:/g, "").replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Nutrition Facts */}
            {product.nutriments &&
              Object.keys(product.nutriments).length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <FaInfoCircle className="text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Nutrition Facts
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        key: "energy_100g",
                        label: "Energy",
                        unit: "kJ",
                        kcalKey: "energy-kcal_100g",
                      },
                      { key: "fat_100g", label: "Fat", unit: "g" },
                      {
                        key: "saturated-fat_100g",
                        label: "Saturated Fat",
                        unit: "g",
                      },
                      {
                        key: "carbohydrates_100g",
                        label: "Carbohydrates",
                        unit: "g",
                      },
                      { key: "sugars_100g", label: "Sugars", unit: "g" },
                      { key: "proteins_100g", label: "Proteins", unit: "g" },
                      { key: "salt_100g", label: "Salt", unit: "g" },
                      { key: "fiber_100g", label: "Fiber", unit: "g" },
                    ].map((nutrient) => {
                      const value = product.nutriments[nutrient.key];
                      const kcalValue = nutrient.kcalKey
                        ? product.nutriments[nutrient.kcalKey]
                        : null;

                      if (value === undefined && !kcalValue) return null;

                      return (
                        <div
                          key={nutrient.key}
                          className="bg-gray-50 rounded-xl p-4"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">
                              {nutrient.label}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {value ? `${value} ${nutrient.unit}` : "N/A"}
                              {kcalValue && ` (${kcalValue} kcal)`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Ingredients */}
            {product.ingredients_text && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Ingredients
                </h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {product.ingredients_text}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(product.brands || product.categories_tags) && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Product Info
                  </h3>
                  <div className="space-y-3">
                    {product.brands && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Brand:
                        </span>
                        <p className="text-gray-800 font-medium">
                          {product.brands}
                        </p>
                      </div>
                    )}
                    {product.categories_tags &&
                      product.categories_tags.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Categories:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.categories_tags
                              .slice(0, 3)
                              .map((category, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md capitalize"
                                >
                                  {category
                                    .replace(/en:/g, "")
                                    .replace(/-/g, " ")}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Packaging Info */}
              {(product.packaging || product.quantity) && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Packaging
                  </h3>
                  <div className="space-y-3">
                    {product.quantity && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Quantity:
                        </span>
                        <p className="text-gray-800 font-medium">
                          {product.quantity}
                        </p>
                      </div>
                    )}
                    {product.packaging && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Packaging:
                        </span>
                        <p className="text-gray-800 font-medium">
                          {product.packaging}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Add to Cart Button for Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : showSuccess ? (
                  <>
                    <IoCheckmarkCircle />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
