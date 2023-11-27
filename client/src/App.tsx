import "./App.css";

import { useState, useEffect } from "react";

import apiService from "./api_service";
import { Item } from "./api_service";
import ListItem from "./components/ListItem";
import PostItemForm from "./components/PostItemForm";
// import QueryItemsForm from "./components/QueryItemsForm";
import NavigationBar from "./components/NavigationBar";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const getItems = async () => {
    try {
      setLoading(true);
      const itemData: Item[] = await apiService.getItems();
      console.log("Items from server:", itemData); // Log the response from the server
      setItems(itemData);
      setLoading(false);
      return itemData;
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteItem = async (id: number) => {
    await apiService.deleteItem(id);
    // Check if the delete request was successful
    console.log("I just deleted an item!");
    await getItems(); // Fetch the updated list of items
  };

  useEffect(() => {
    console.log("Items:", items);
  }, [items]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <NavigationBar />
      <div className="max-w-screen-xl flex flex-wrap items-top justify-between mx-auto p-4">
        <div>
          <PostItemForm onSubmit={getItems} />
        </div>
        <div className="overflow-y-hidden">
          <ul className="list-inside list-none p-4">
            {items &&
              items.map((item) => (
                <li>
                  <ListItem
                    key={item.id}
                    onDeleteItem={onDeleteItem}
                    item={item}
                  />
                </li>
              ))}
          </ul>
        </div>
        {/*
        <div>
          <QueryItemsForm getItems={getItems} />
        </div>
        */}
      </div>
    </div>
  );
}

export default App;
