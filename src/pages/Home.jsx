import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import FilterDrawer from "../components/FilterDrawer";
import { useNavigate } from "react-router-dom";
import { Search, Filter, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Core state
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [barcode, setBarcode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // UI state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showError, setShowError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const observerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Memoized values
  const activeFiltersCount = useMemo(() => {
    return (selectedCategory ? 1 : 0) + (sortOption ? 1 : 0);
  }, [selectedCategory, sortOption]);

  const sortedProducts = useMemo(() => {
    if (!sortOption) return products;
    return [...products].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return (a.product_name || "").localeCompare(b.product_name || "");
        case "name-desc":
          return (b.product_name || "").localeCompare(a.product_name || "");
        case "grade-asc":
          return (a.nutrition_grades || "").localeCompare(
            b.nutrition_grades || ""
          );
        case "grade-desc":
          return (b.nutrition_grades || "").localeCompare(
            a.nutrition_grades || ""
          );
        default:
          return 0;
      }
    });
  }, [products, sortOption]);

  // Optimized fetch function with error handling
  const fetchProducts = useCallback(
    async (pageNum = 1, isNewSearch = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const searchQuery = searchTerm || "food";
        const res = await axios.get(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchQuery}&page=${pageNum}&page_size=12&json=true`,
          { signal: abortControllerRef.current.signal }
        );

        const newProducts = res.data.products || [];

        if (newProducts.length === 0 && pageNum === 1) {
          setHasMore(false);
          setProducts([]);
          setAllProducts([]);
        } else {
          if (isNewSearch || pageNum === 1) {
            setProducts(newProducts);
            setAllProducts(newProducts);
          } else {
            setProducts((prev) => [...prev, ...newProducts]);
            setAllProducts((prev) => [...prev, ...newProducts]);
          }
          setHasMore(newProducts.length === 12);
        }
      } catch (err) {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          console.error("Error fetching products:", err);
          setError("Failed to load products. Please try again.");
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm]
  );

  // Initial load
  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  useEffect(() => {
    if (products.length > 0 && initialLoad) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [products, initialLoad]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setShowError(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          !isLoading &&
          hasMore &&
          !searchTerm &&
          !initialLoad
        ) {
          setPage((prev) => prev + 1);
          fetchProducts(page + 1);
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef && hasMore && !initialLoad) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isLoading, hasMore, page, searchTerm, fetchProducts, initialLoad]);

  // Search handlers
  const handleNameSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setHasSearched(true);
    setPage(1);
    await fetchProducts(1, true);
  }, [searchTerm, fetchProducts]);

  const handleBarcodeSearch = useCallback(async () => {
    if (!barcode.trim()) return;
    setHasSearched(true);
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      if (res.data.status === 1) {
        navigate(`/product/${barcode}`);
      } else {
        setError("Product not found for this barcode");
        setProducts([]);
      }
    } catch (err) {
      console.error("Barcode error:", err);
      setError("Failed to search by barcode");
    } finally {
      setIsLoading(false);
    }
  }, [barcode, navigate]);

  // Filter handlers
  const onApply = useCallback(() => {
    try {
      setIsLoading(true);
      let filtered = [...allProducts];

      if (selectedCategory) {
        filtered = filtered.filter((prod) =>
          prod.categories
            ?.toLowerCase()
            .includes(selectedCategory.toLowerCase())
        );
      }

      const sorted = [...filtered].sort((a, b) => {
        switch (sortOption) {
          case "name-asc":
            return (a.product_name || "").localeCompare(b.product_name || "");
          case "name-desc":
            return (b.product_name || "").localeCompare(a.product_name || "");
          case "grade-asc":
            return (a.nutrition_grades || "").localeCompare(
              b.nutrition_grades || ""
            );
          case "grade-desc":
            return (b.nutrition_grades || "").localeCompare(
              a.nutrition_grades || ""
            );
          default:
            return 0;
        }
      });

      setProducts(sorted);
      setPage(1);
      setDrawerOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to apply filters:", err);
      setError("Failed to apply filters");
    } finally {
      setIsLoading(false);
    }
  }, [allProducts, selectedCategory, sortOption]);

  const onClear = useCallback(() => {
    setSelectedCategory("");
    setSortOption("");
    setProducts(allProducts);
    setPage(1);
    setError(null);
    setHasSearched(false);
  }, [allProducts]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
    setError(null);
    await fetchProducts(1, true);
    setIsRefreshing(false);
  }, [fetchProducts]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const showNoResultsState =
    hasSearched && products.length === 0 && !isLoading && !initialLoad;

  // MAIN RENDER LOGIC
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        barcode={barcode}
        setBarcode={setBarcode}
        onSearchByName={handleNameSearch}
        onSearchByBarcode={handleBarcodeSearch}
        onOpenFilter={() => setDrawerOpen(true)}
      />

      <FilterDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onApply={onApply}
        onClear={onClear}
      />

      {/* Hero Section*/}
      {!initialLoad && (
        <div className="pt-32 pb-8 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Food Discovery Hub
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Discover nutritional information, ingredients, and detailed
              product data from around the world
            </p>
          </div>
        </div>
      )}

      {/* Status Bar */}
      {!initialLoad && (
        <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {products.length > 0 && <>Showing {products.length} products</>}
              </span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                  active
                </span>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {showError && error && !initialLoad && (
        <div className="mt-4 max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* INITIAL LOADING SCREEN */}
      {initialLoad && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>

          {/* Loading Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Loading Food Products
            </h2>
            <div className="flex items-center justify-center gap-1">
              <span className="text-gray-600 text-lg">Fetching fresh data</span>
              <div className="flex gap-1 ml-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="w-80 h-3 bg-gray-200 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
              style={{
                width: "75%",
                animation: "pulse 2s ease-in-out infinite",
              }}
            ></div>
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-3 gap-12 text-center">
            <div className="animate-pulse">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-sm text-gray-500 font-medium">Products</div>
            </div>
            <div className="animate-pulse" style={{ animationDelay: "0.2s" }}>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-sm text-gray-500 font-medium">
                Categories
              </div>
            </div>
            <div className="animate-pulse" style={{ animationDelay: "0.4s" }}>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm text-gray-500 font-medium">Updated</div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      {!initialLoad && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Products Grid */}
          {sortedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product, index) => (
                <div
                  key={`${product.code || product._id || index}`}
                  className="transform transition-all duration-200 hover:scale-105 opacity-0"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 50}ms forwards`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* No Results State - Only show after user has searched */}
          {showNoResultsState && (
            <div className="text-center py-16 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or filters
              </p>
              {(searchTerm || activeFiltersCount > 0) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setHasSearched(false);
                    onClear();
                    fetchProducts(1, true);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Loading skeleton for searches */}
          {isLoading && products.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm animate-pulse"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          {hasMore && !searchTerm && (
            <div
              ref={observerRef}
              className="h-20 m-6 w-full flex items-center justify-center"
            >
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading more products...</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Scroll to Top Button  */}
      {showScrollTop && !initialLoad && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40"
        >
          ↑
        </button>
      )}

      {/* CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `,
        }}
      />
    </div>
  );
};

export default Home;
