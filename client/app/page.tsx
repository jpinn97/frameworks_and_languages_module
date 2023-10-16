import React from "react";
import Form from "./components/form";
import { itemData } from "@/actions/actions";

export default async function ItemHome() {
  const items = await itemData();
  return (
    <main className="container">
      <h1>Home</h1>
      <Form />
      <ul className="list-dict"></ul>
    </main>
  );
}
