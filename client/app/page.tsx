import React from "react";
import { ItemButton } from "./components/ItemButton";

async function postItem() {}

async function getItem() {
  const res = await fetch(process.env.API_BACKEND_URL + "/item/1");
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function deleteItem() {}

async function getItems() {}

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <ItemButton />
    </div>
  );
}
