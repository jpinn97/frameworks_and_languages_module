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
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <PostItemForm onSubmit={getItems} />
        </div>
        <div className="md:col-span-1 flex flex-wrap">
          {items &&
            items.map((item) => (
              <div className="w-full sm:w-1/2 md:w-1/3">
                <ListItem
                  key={item.id}
                  onDeleteItem={onDeleteItem}
                  item={item}
                />
              </div>
            ))}
          {/*
  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
    <QueryItemsForm getItems={getItems} />
  </div>
  */}
        </div>
      </div>
    </div>
  );
}

export default App;
