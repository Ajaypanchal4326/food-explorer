import { FaSearch, FaBarcode, FaFilter, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  searchTerm,
  setSearchTerm,
  barcode,
  setBarcode,
  onSearchByName,
  onSearchByBarcode,
  onOpenFilter,
}) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-lime-200 shadow px-4 py-5">
      {/* Desktop & Tablet Navbar */}
      <div className="hidden md:flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-900">FoodExplorer</h1>

        <div className="flex gap-4 items-center">
          {/* Search inputs */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
            className="border px-3 mr-1 py-2 rounded-md w-48"
          />
          <button
            onClick={onSearchByName}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 mr-3 rounded-md"
          >
            <FaSearch />
          </button>

          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Search by barcode"
            className="border px-3 py-2 mr-1 rounded-md w-48"
          />
          <button
            onClick={onSearchByBarcode}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 mr-3 rounded-md"
          >
            <FaBarcode />
          </button>

          {/* Filter Button */}
          <button
            onClick={onOpenFilter}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            <FaFilter className="inline-block mr-1" /> Filter
          </button>

          {/* Cart Button */}
          <button
            onClick={() => navigate("/cart")}
            className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium shadow flex items-center gap-2 transition"
          >
            <FaShoppingCart /> Cart
          </button>
        </div>
      </div>

      {/*  Mobile Navbar */}
      <div className="md:hidden">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-green-900">FoodExplorer</h1>

          <div className="flex gap-2">
            {/* Filter Button */}
            <button
              onClick={onOpenFilter}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-semibold"
            >
              <FaFilter />
              Filter
            </button>

            {/* Cart Icon Mobile */}
            <button
              onClick={() => navigate("/cart")}
              className="bg-white hover:bg-lime-100 text-green-900 p-2 rounded-md shadow"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>

        {/* Search Bars Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Name */}
          <div className="flex gap-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name"
              className="w-full border px-2 py-2 rounded-md text-sm"
            />
            <button
              onClick={onSearchByName}
              className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-2 rounded-md"
            >
              <FaSearch />
            </button>
          </div>

          {/* Barcode */}
          <div className="flex gap-1">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Barcode"
              className="w-full border px-2 py-2 rounded-md text-sm"
            />
            <button
              onClick={onSearchByBarcode}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded-md"
            >
              <FaBarcode />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
