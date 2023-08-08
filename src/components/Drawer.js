import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import env from "react-dotenv";
import ProductsPresentation from "./Products";

function Drawer() {
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const handleCategoryFilter = (category) => {
    const filtered = filteredProducts.filter((product) => {
      return product.category === category;
    });
    setFilteredProducts(filtered);
  };

  const fetchCategoriesAndProducts = async () => {
    await axios
      .get(`${env.REACT_APP_PRODUCT_DB_URL}`)
      .then(function (response) {
        setFilteredProducts(response.data);
        setCategories([
          ...new Set(response.data.map((product) => product.category)),
        ]);
        console.log(categories);
      });
  };
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Categories
      </button>
      <ul className="dropdown-menu">
        {Array.from(categories).map((category) => (
          <li key={category}>
            <button
              className="dropdown-item"
              value={category}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </button>
          </li>
        ))}
        <ProductsPresentation filteredProducts={filteredProducts} />
      </ul>
    </div>
  );
}

export default Drawer;
