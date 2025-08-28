import {
  FaSearch,
  FaBarcode,
  FaFilter,
  FaShoppingCart,
  FaLeaf,
} from "react-icons/fa";
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
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-green-50 via-lime-50 to-emerald-50 backdrop-blur-sm shadow-lg border-b border-green-100">
      {/* Desktop Navbar */}
      <div className="hidden lg:flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-md group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-300">
            <FaLeaf className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
            FoodExplorer
          </h1>
        </div>

        <div className="flex gap-4 items-center">
          {/* Search by Name */}
          <div className="relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search healthy foods..."
              className="border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 px-4 py-2.5 rounded-full w-56 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none placeholder-green-500"
              onKeyPress={(e) => e.key === "Enter" && onSearchByName()}
            />
            <button
              onClick={onSearchByName}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white p-2 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <FaSearch className="text-sm" />
            </button>
          </div>

          {/* Search by Barcode */}
          <div className="relative group">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan product barcode..."
              className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 px-4 py-2.5 rounded-full w-56 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none placeholder-blue-500"
              onKeyPress={(e) => e.key === "Enter" && onSearchByBarcode()}
            />
            <button
              onClick={onSearchByBarcode}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white p-2 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <FaBarcode className="text-sm" />
            </button>
          </div>

          {/* Filter Button */}
          <button
            onClick={onOpenFilter}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 shadow-sm"
          >
            <FaFilter className="text-sm" />
            <span>Filter</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 shadow-sm"
          >
            <FaShoppingCart className="text-sm" />
            <span>Cart</span>
          </button>
        </div>
      </div>

      {/* Tablet Navbar */}
      <div className="hidden md:flex lg:hidden justify-between items-center px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-md">
            <FaLeaf className="text-white text-sm" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
            FoodExplorer
          </h1>
        </div>

        <div className="flex gap-3 items-center">
          {/* Compact Search by Name */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search foods..."
              className="border-2 border-green-200 focus:border-green-400 focus:ring-1 focus:ring-green-200 px-3 py-2 pr-10 rounded-full w-40 text-sm transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none placeholder-green-500"
              onKeyPress={(e) => e.key === "Enter" && onSearchByName()}
            />
            <button
              onClick={onSearchByName}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white p-1.5 rounded-full transition-all duration-300 hover:shadow-md active:scale-95"
            >
              <FaSearch className="text-xs" />
            </button>
          </div>

          {/* Compact Search by Barcode */}
          <div className="relative">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Barcode..."
              className="border-2 border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 px-3 py-2 pr-10 rounded-full w-32 text-sm transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none placeholder-blue-500"
              onKeyPress={(e) => e.key === "Enter" && onSearchByBarcode()}
            />
            <button
              onClick={onSearchByBarcode}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white p-1.5 rounded-full transition-all duration-300 hover:shadow-md active:scale-95"
            >
              <FaBarcode className="text-xs" />
            </button>
          </div>

          {/* Filter & Cart */}
          <button
            onClick={onOpenFilter}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-2.5 rounded-full transition-all duration-300 hover:shadow-md active:scale-95"
          >
            <FaFilter className="text-sm" />
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white p-2.5 rounded-full transition-all duration-300 hover:shadow-md active:scale-95"
          >
            <FaShoppingCart className="text-sm" />
          </button>
        </div>
      </div>

      {/* Mobile Navbar - Two Line Social Media Style */}
      <div className="md:hidden px-4 py-3">
        {/* Top Row - Logo and Action Buttons */}
        <div className="flex items-center justify-between mb-3">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-md">
              <FaLeaf className="text-white text-base" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
              FoodExplorer
            </h1>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2">
            {/* Filter Button */}
            <button
              onClick={onOpenFilter}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              <FaFilter className="text-xs" />
              <span>Filter</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="bg-white hover:bg-gray-50 text-green-700 border-2 border-green-300 p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              <FaShoppingCart className="text-base" />
            </button>
          </div>
        </div>

        {/* Bottom Row - Search Inputs */}
        <div className="grid grid-cols-2 gap-3">
          {/* Search by Name */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search foods..."
              className="w-full border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 px-4 py-3 pr-12 rounded-xl text-sm transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none placeholder-green-600"
              onKeyPress={(e) => e.key === "Enter" && onSearchByName()}
            />
            <button
              onClick={onSearchByName}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white p-2 rounded-full transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <FaSearch className="text-sm" />
            </button>
          </div>

          {/* Search by Barcode */}
          <div className="relative">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan barcode..."
              className="w-full border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 px-4 py-3 pr-12 rounded-xl text-sm transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none placeholder-blue-600"
              onKeyPress={(e) => e.key === "Enter" && onSearchByBarcode()}
            />
            <button
              onClick={onSearchByBarcode}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white p-2 rounded-full transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <FaBarcode className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
