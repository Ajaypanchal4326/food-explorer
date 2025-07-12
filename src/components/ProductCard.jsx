import { useNavigate } from "react-router-dom";

const getGradeColor = (grade) => {
  switch (grade?.toUpperCase()) {
    case "A":
      return "bg-green-500 text-white";
    case "B":
      return "bg-yellow-400 text-white";
    case "C":
      return "bg-orange-400 text-white";
    case "D":
      return "bg-orange-600 text-white";
    case "E":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.code}`)}
      className="rounded-xl overflow-hidden shadow-md cursor-pointer hover:drop-shadow-[0_4px_6px_rgba(190,242,100,0.9)] transition bg-white border border-gray-200"
    >
      {/* Image Section */}
      <div className="h-56 w-full flex justify-center items-center bg-gray-100 relative">
        <img
          src={product.image_front_url || "/no-image.jpg"}
          alt={product.product_name}
          className="max-h-full max-w-full object-contain p-2"
        />

        {/* Grade Badge */}
        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(
            product.nutrition_grades
          )}`}
        >
          {product.nutrition_grades?.toUpperCase() || "N/A"}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 bg-white space-y-2">
        <h2 className="text-lg font-bold text-gray-800 truncate">
          {product.product_name || "No Name"}
        </h2>

        <p className="text-sm text-gray-600">
          <span className="font-medium text-blue-600">Category: </span>
          {product.categories?.split(",")[0] || "No Category"}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-medium text-purple-600">Ingredients: </span>
          {product.ingredients_text
            ? product.ingredients_text.slice(0, 50) + "..."
            : "Not Available"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
