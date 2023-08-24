import React, { useState, useEffect } from "react";

function Drawer({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://vps.akabom.me/api/product`);
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
