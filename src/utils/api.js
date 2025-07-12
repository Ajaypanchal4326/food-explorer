import axios from "axios";

const BASE_URL = "https://world.openfoodfacts.org";

export const searchByName = (name) =>
  axios.get(`${BASE_URL}/cgi/search.pl?search_terms=${name}&json=true`);

export const searchByBarcode = (barcode) =>
  axios.get(`${BASE_URL}/api/v0/product/${barcode}.json`);

export const getProductsByCategory = (category) =>
  axios.get(`${BASE_URL}/category/${category}.json`);

export const getCategories = () => axios.get(`${BASE_URL}/categories.json`);

export const getProductDetails = (barcode) =>
  axios.get(`${BASE_URL}/api/v0/product/${barcode}.json`);
