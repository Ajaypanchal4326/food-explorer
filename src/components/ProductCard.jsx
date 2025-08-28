import { useNavigate } from "react-router-dom";
import { FaLeaf, FaInfoCircle, FaChevronRight } from "react-icons/fa";

const getGradeColor = (grade) => {
  switch (grade?.toUpperCase()) {
    case "A":
      return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200";
    case "B":
      return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-yellow-200";
    case "C":
      return "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-orange-200";
    case "D":
      return "bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-orange-200";
    case "E":
      return "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-200";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-200";
  }
};

const getGradeLabel = (grade) => {
  switch (grade?.toUpperCase()) {
    case "A":
      return "Excellent";
    case "B":
      return "Good";
    case "C":
      return "Fair";
    case "D":
      return "Poor";
    case "E":
      return "Bad";
    default:
      return "Unknown";
  }
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.code}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${
        product.product_name || "Unknown product"
      }`}
      className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl border border-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
    >
      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Image Section */}
      <div className="relative h-56 w-full bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center overflow-hidden">
        <img
          src={product.image_front_url || "/no-image.jpg"}
          alt={product.product_name || "Product image"}
          className="max-h-full max-w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/no-image.jpg";
          }}
        />

        {/* Nutrition Grade Badge */}
        <div className="absolute top-3 right-3 flex flex-col items-center gap-1">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-300 group-hover:shadow-xl ${getGradeColor(
              product.nutrition_grades
            )}`}
          >
            {product.nutrition_grades?.toUpperCase() || "N/A"}
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <span className="text-xs text-gray-700 font-medium">
              {getGradeLabel(product.nutrition_grades)}
            </span>
          </div>
        </div>

        {/* Eco Badge */}
        {product.ecoscore_grade && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md">
            <FaLeaf className="text-green-600 text-sm" />
          </div>
        )}

        {/* Image Overlay Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3 relative z-20">
        {/* Product Name */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors duration-200">
            {product.product_name || "No Name Available"}
          </h2>
          <FaChevronRight className="text-gray-400 text-sm mt-1 transition-all duration-200 group-hover:text-green-600 group-hover:translate-x-1" />
        </div>

        {/* Category Section */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          <span className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Category:</span>{" "}
            <span className="text-gray-800">
              {product.categories?.split(",")[0]?.trim() || "Not specified"}
            </span>
          </span>
        </div>

        {/* Ingredients Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-purple-500 text-xs" />
            <span className="text-sm font-medium text-purple-600">
              Ingredients Preview
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-purple-400">
            {product.ingredients_text
              ? product.ingredients_text.length > 40
                ? product.ingredients_text.slice(0, 40) + "..."
                : product.ingredients_text
              : "Ingredient information not available"}
          </p>
        </div>

        {/* Additional Info Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {product.brands && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {product.brands.split(",")[0]?.trim()}
            </span>
          )}
          {product.quantity && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {product.quantity}
            </span>
          )}
          {product.ecoscore_grade && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
              <FaLeaf className="text-xs" />
              Eco: {product.ecoscore_grade.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Gradient Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
};

export default ProductCard;
