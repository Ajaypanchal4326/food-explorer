import { useEffect, useState, useRef } from "react";
import axios from "axios";

const FilterDrawer = ({
  visible,
  onClose,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  onApply,
  onClear,
}) => {
  const drawerRef = useRef();
  const [categories, setCategories] = useState([
    { id: "beverages", name: "Beverages" },
    { id: "dairies", name: "Dairy Products" },
    { id: "snacks", name: "Snacks" },
    { id: "sweet-snacks", name: "Sweet Snacks" },
    { id: "breakfasts", name: "Breakfasts" },
    { id: "meals", name: "Meals" },
    { id: "desserts", name: "Desserts" },
    { id: "plant-based-foods-and-beverages", name: "Plant Based Foods" },
  ]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [visible]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        visible &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex justify-end">
      <div
        ref={drawerRef}
        className="bg-white w-80 h-full p-6 shadow-lg flex flex-col gap-4 relative transition-all duration-300 ease-in-out"
      >
        {/*  Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-red-500"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-2">Filter & Sort</h2>

        {/* Category Filter */}
        <div>
          <label className="font-medium block mb-1">Category:</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/*  Sort Options */}
        <div>
          <label className="font-medium block mb-1">Sort By:</label>
          <select
            className="w-full border p-2 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">None</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="grade-asc">Nutrition Grade ↑</option>
            <option value="grade-desc">Nutrition Grade ↓</option>
          </select>
        </div>

        {/*  Buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={onApply}
            className="bg-green-500 text-white px-4 py-2 rounded w-1/2"
          >
            Apply
          </button>
          <button
            onClick={onClear}
            className="bg-gray-300 text-black px-4 py-2 rounded w-1/2"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
