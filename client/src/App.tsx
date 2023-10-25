import "./App.css";

import { useState, useEffect } from "react";

import apiService from "./api_service";
import { Item } from "./api_service";
import ListItem from "./components/ListItem";
import PostItemForm from "./components/PostItemForm";
import QueryItemsForm from "./components/QueryItemsForm";
import NavigationBar from "./components/NavigationBar";

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
    <div>
      <NavigationBar />
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div>
          <PostItemForm onSubmit={getItems} />
        </div>
        <div className="h-64 overflow-y-scroll">
          <ul className="list-inside list-disc p-4">
            {items &&
              items.map((item) => (
                <ListItem
                  key={item.id}
                  onDeleteItem={onDeleteItem}
                  item={item}
                />
              ))}
          </ul>
        </div>
        <div>
          <QueryItemsForm getItems={getItems} />
        </div>
      </div>
    </div>
  );
}

export default App;
