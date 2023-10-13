"use client";

import { useState } from "react";

export function ItemButton() {
  const [itemData, setItemData] = useState("");

  const getItem = () => {
    // Your logic to fetch the item data
    // For example, make an API call here

    // Once you have the item data, set it in the state
    setItemData("Item data received.");
  };

  return (
    <div>
      <button onClick={getItem}>Get Item</button>
      <p>{itemData}</p>
    </div>
  );
}
