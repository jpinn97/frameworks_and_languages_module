"use client";

import { itemData } from "@/actions/actions";

export default function Form() {
  return (
    <form action={itemData} className="">
      <input
        type="text"
        name="content"
        placeholder="User ID"
        className=""
        required
      />
      <button className="">Submit</button>
    </form>
  );
}
