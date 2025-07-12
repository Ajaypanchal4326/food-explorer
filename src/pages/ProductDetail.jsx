import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";
import { CartContext } from "../context/cartcontext";

const ProductDetails = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  if (error) {
    return (
      <div className="pt-32 text-center text-red-600 font-semibold">
        Failed to load product. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-32 text-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-500 mx-auto mb-2"></div>
        Loading product details...
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 md:px-20 pb-10 bg-gray-50 min-h-screen relative">
      {/* Close Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-gray-600 hover:text-red-500 text-3xl"
      >
        <IoClose />
      </button>

      {/* Layout */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={product.image_front_url || "/no-image.jpg"}
            alt={product.product_name}
            className="max-w-xs w-full rounded shadow"
          />
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {product.product_name}
          </h1>
          <p className="text-gray-700">
            {product.generic_name || "No description available."}
          </p>

          {/* Labels */}
          {product.labels_tags && product.labels_tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                Labels:
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.labels_tags.map((label, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full capitalize"
                  >
                    {label.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Facts */}
          {product.nutriments && (
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold mb-2">Nutrition facts</h2>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr>
                    <th className="font-medium text-gray-600">Nutrient</th>
                    <th className="font-medium text-gray-600">per 100g</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td>Energy</td>
                    <td>
                      {product.nutriments.energy_100g} kJ /{" "}
                      {product.nutriments["energy-kcal_100g"]} kcal
                    </td>
                  </tr>
                  <tr>
                    <td>Fat</td>
                    <td>{product.nutriments.fat_100g} g</td>
                  </tr>
                  <tr>
                    <td>Saturated Fat</td>
                    <td>{product.nutriments["saturated-fat_100g"]} g</td>
                  </tr>
                  <tr>
                    <td>Carbohydrates</td>
                    <td>{product.nutriments.carbohydrates_100g} g</td>
                  </tr>
                  <tr>
                    <td>Sugars</td>
                    <td>{product.nutriments.sugars_100g} g</td>
                  </tr>
                  <tr>
                    <td>Proteins</td>
                    <td>{product.nutriments.proteins_100g} g</td>
                  </tr>
                  <tr>
                    <td>Salt</td>
                    <td>{product.nutriments.salt_100g} g</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients_text && (
            <div>
              <h2 className="text-xl font-semibold mt-4 mb-2">Ingredients</h2>
              <p className="text-sm text-gray-800">
                {product.ingredients_text}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            addToCart(product); // Add to cart logic
            navigate("/cart"); // Redirect to cart page
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
