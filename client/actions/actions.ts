"use server";

import { revalidatePath } from "next/cache";

interface Item {
  id: string;
  user_id: string;
  keywords: string[];
  description: string;
  image: string;
  lat: string;
  lon: string;
  date_from: string;
  date_to: string;
}

export const itemData = async () => {
  let response = await fetch("http://localhost:8000/items", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  return response;
};
