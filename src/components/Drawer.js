import React, { useState, useEffect } from "react";

function Drawer({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/product`);
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
      <li
        className="list-group-item list-group-item-action"
        onClick={() => onCategorySelect("")}
      >
        All
      </li>
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
