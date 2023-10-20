import React, { useState, useEffect } from "react";
import "./index.css";

import ApiService from "./api_service";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getItems = async () => {
    try {
      setLoading(true);
      const itemsData = await ApiService.httpGet("/items");
      setItems(itemsData);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <ul>
        {items.map((item) => {
          return <li key={item.id}>id: {item.description}</li>;
        })}
      </ul>
    </div>
  );
}
