import React, { useState, useEffect } from "react";
import env from "react-dotenv";

function Drawer({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${env.REACT_APP_PRODUCT_DB_URL}`);
      const data = await response.json();
      const allCategories = Array.from(
        new Set(data.map((product) => product.category))
      );
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="list-group">
      <div
        style={{
          width: "100%",
          height: "5%",
          backgroundColor: "green",
          color: "white",
          textAlign: "center",
          lineHeight: "2rem",
          fontWeight: "bold",
        }}
      >
        Categories
      </div>
      {categories.map((category) => (
        <li
          className="list-group-item list-group-item-action"
          key={category}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </li>
      ))}
    </div>
  );
}

export default Drawer;
