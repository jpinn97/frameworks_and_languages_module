import "./App.css";

import { useState, useEffect } from "react";

import apiService from "./api_service.ts";
import { Item } from "./api_service.ts";
import ListItem from "./ListItem.tsx";
import PostItemForm from "./PostItemForm.tsx";

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

  const onDeleteItem = async (id: number) => {
    try {
      await apiService.deleteItem(id);
      console.log("I just deleted an item!");
      await getItems();
      console.log("I just refreshed the items!");
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="container mx-auto">
      <div>
        <ul>
          {items &&
            items.map((item) => (
              <ListItem key={item.id} onDeleteItem={onDeleteItem} item={item} />
            ))}
        </ul>
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={getItems}
        >
          Refresh
        </button>
      </div>
      <div>
        <PostItemForm onSubmit={getItems} />
      </div>
    </div>
  );
}

export default App;
