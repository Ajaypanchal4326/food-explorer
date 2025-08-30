import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { X, Filter, RotateCcw } from "lucide-react";

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
  const [isClosing, setIsClosing] = useState(false);

  // Memoize categories to prevent unnecessary re-renders
  const categories = useMemo(
    () => [
      { id: "beverages", name: "Beverages" },
      { id: "dairies", name: "Dairy Products" },
      { id: "snacks", name: "Snacks" },
      { id: "sweet-snacks", name: "Sweet Snacks" },
      { id: "breakfasts", name: "Breakfasts" },
      { id: "meals", name: "Meals" },
      { id: "desserts", name: "Desserts" },
      { id: "plant-based-foods-and-beverages", name: "Plant Based Foods" },
    ],
    []
  );

  // Memoize sort options
  const sortOptions = useMemo(
    () => [
      { value: "", label: "None" },
      { value: "name-asc", label: "Name A-Z" },
      { value: "name-desc", label: "Name Z-A" },
      { value: "grade-asc", label: "Nutrition Grade ↑" },
      { value: "grade-desc", label: "Nutrition Grade ↓" },
    ],
    []
  );

  // Optimized close handler with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  }, [onClose]);

  // Memoized event handlers
  const handleEsc = useCallback(
    (e) => {
      if (e.key === "Escape" && visible) handleClose();
    },
    [visible, handleClose]
  );

  const handleClickOutside = useCallback(
    (e) => {
      if (
        visible &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        handleClose();
      }
    },
    [visible, handleClose]
  );

  const handleCategoryChange = useCallback(
    (e) => {
      setSelectedCategory(e.target.value);
    },
    [setSelectedCategory]
  );

  const handleSortChange = useCallback(
    (e) => {
      setSortOption(e.target.value);
    },
    [setSortOption]
  );

  const handleApply = useCallback(() => {
    onApply();
    handleClose();
  }, [onApply, handleClose]);

  const handleClear = useCallback(() => {
    onClear();
  }, [onClear]);

  // Optimized event listeners with proper cleanup
  useEffect(() => {
    if (visible) {
      document.addEventListener("keydown", handleEsc, { passive: true });
      document.addEventListener("mousedown", handleClickOutside, {
        passive: true,
      });
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [visible, handleEsc, handleClickOutside]);

  // Early return with fade-out animation
  if (!visible && !isClosing) return null;

  const isAnimating = visible && !isClosing;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ease-out ${
        isAnimating ? "bg-black/30" : "bg-transparent"
      }`}
      style={{ backdropFilter: isAnimating ? "blur(2px)" : "none" }}
    >
      <div
        ref={drawerRef}
        className={`bg-white w-80 h-full shadow-2xl flex flex-col relative transform transition-all duration-300 ease-out ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header with improved styling */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Filters & Sort
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
            aria-label="Close filter drawer"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Content with better spacing */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Category Filter with improved design */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Category
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <p className="text-xs text-gray-500">
                Filtering by:{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
              </p>
            )}
          </div>

          {/* Sort Options with improved design */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Sort By
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
              value={sortOption}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {sortOption && (
              <p className="text-xs text-gray-500">
                Sorting by:{" "}
                {sortOptions.find((o) => o.value === sortOption)?.label}
              </p>
            )}
          </div>

          {/* Filter summary */}
          {(selectedCategory || sortOption) && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700 font-medium mb-1">
                Active Filters:
              </p>
              <div className="space-y-1">
                {selectedCategory && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                )}
                {sortOption && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-1">
                    {sortOptions.find((o) => o.value === sortOption)?.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons with improved styling */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 focus:ring-2 focus:ring-gray-200 outline-none"
              disabled={!selectedCategory && !sortOption}
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
