import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import FilterDrawer from "../components/FilterDrawer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [barcode, setBarcode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const observerRef = useRef(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=food&page=${page}&page_size=12&json=true`
      );
      const newProducts = res.data.products;
      setProducts((prev) => [...prev, ...newProducts]);
      setAllProducts((prev) => [...prev, ...newProducts]);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  // Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "0px 0px 200px 0px", threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isLoading]);

  const handleNameSearch = async () => {
    if (!searchTerm) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&json=true`
      );
      setProducts(res.data.products);
      setPage(1);
    } catch (err) {
      console.error("Search error:", err);
    }
    setIsLoading(false);
  };

  const handleBarcodeSearch = async () => {
    if (!barcode) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      if (res.data.status === 1) {
        navigate(`/product/${barcode}`);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Barcode error:", err);
    }
    setIsLoading(false);
  };

  const onApply = () => {
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

      if (sortOption === "name-asc") {
        filtered.sort((a, b) =>
          (a.product_name || "").localeCompare(b.product_name || "")
        );
      } else if (sortOption === "name-desc") {
        filtered.sort((a, b) =>
          (b.product_name || "").localeCompare(a.product_name || "")
        );
      } else if (sortOption === "grade-asc") {
        filtered.sort((a, b) =>
          (a.nutrition_grades || "").localeCompare(b.nutrition_grades || "")
        );
      } else if (sortOption === "grade-desc") {
        filtered.sort((a, b) =>
          (b.nutrition_grades || "").localeCompare(a.nutrition_grades || "")
        );
      }

      setProducts(filtered);
      setPage(1);
      setDrawerOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to apply filters:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onClear = () => {
    setSelectedCategory("");
    setSortOption("");
    setProducts(allProducts);
    setPage(1);
    setDrawerOpen(false);
  };

  const sortProducts = (items) => {
    if (!sortOption) return items;
    return [...items].sort((a, b) => {
      if (sortOption === "name-asc")
        return (a.product_name || "").localeCompare(b.product_name || "");
      if (sortOption === "name-desc")
        return (b.product_name || "").localeCompare(a.product_name || "");
      if (sortOption === "grade-asc")
        return (a.nutrition_grades || "").localeCompare(
          b.nutrition_grades || ""
        );
      if (sortOption === "grade-desc")
        return (b.nutrition_grades || "").localeCompare(
          a.nutrition_grades || ""
        );
      return 0;
    });
  };

  const sortedProducts = sortProducts(products);

  return (
    <>
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

      {/* Product Grid */}
      <div className="mt-6 mx-4 pt-28 md:pt-24 lg:pt-24 px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-6 min-h-screen">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : isLoading ? (
          <p className="col-span-full text-center text-gray-500 text-lg animate-pulse">
            Loading products...
          </p>
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={observerRef} className="h-16 w-full"></div>

      {/* Loader */}
      {isLoading && <Loader />}
    </>
  );
};

export default Home;
