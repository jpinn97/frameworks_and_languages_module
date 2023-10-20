import "./App.css";

import { useState, useEffect } from "react";

import apiService from "./api_service.ts";
import { Item } from "./api_service.ts";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const getItems = async () => {
    try {
      setLoading(true);
      const itemData: Item[] = await apiService.getItems();
      setItems(itemData);
      setLoading(false);
    } catch (err: unknown) {
      console.error(err);
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
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.description}</li>
      ))}
    </ul>
  );
}

export default App;
