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

      {/* Main content container */}
      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-200 p-4">
            <PostItemForm onSubmit={getItems} />
          </div>
          <div className="bg-gray-300 p-4">
            {items && (
              <ul className="flex flex-wrap -mx-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="px-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3"
                  >
                    <ListItem onDeleteItem={onDeleteItem} item={item} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
