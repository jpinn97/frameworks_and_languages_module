const url = "http://localhost:8000";

export interface Item {
  id?: number;
  user_id: string;
  keywords: string[];
  description: string;
  image: string;
  lat: number;
  lon: number;
}

async function handleGetApiRequest<T>(
  endpoint: string,
  method = "GET"
): Promise<T> {
  const fullUrl = `${url}${endpoint}`;

  const response = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return (await response.json()) as T;
}

async function getItem<T>(id: string): Promise<T> {
  return handleGetApiRequest(`/item/${id}`);
}

async function getItems(): Promise<Item[]> {
  return handleGetApiRequest<Item[]>("/items");
}

/*
async function deleteItem<T>(id: string): Promise<T> {
  return handleApiRequest(`/item/${id}`, "DELETE");
}
*/

async function postItem<T>(formData: Item): Promise<T> {
  const fullUrl = `${url}/item`;
  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return (await response.json()) as T;
}

const apiService = {
  getItem,
  getItems,
  //deleteItem,
  postItem,
};

export default apiService;
