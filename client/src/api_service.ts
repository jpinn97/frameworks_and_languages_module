const url = "http://localhost:8000";

export interface Item {
  id: number;
  user_id: string;
  keywords: string[];
  description: string;
  image: string;
  lat: number;
  lon: number;
  date_from: string;
  date_to: string;
}

async function handleApiRequest<T>(
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
  return handleApiRequest(`/item/${id}`);
}

async function getItems(): Promise<Item[]> {
  return handleApiRequest<Item[]>("/items");
}

async function deleteItem<T>(id: string): Promise<T> {
  return handleApiRequest(`/item/${id}`, "DELETE");
}

async function postItem<T>(): Promise<T> {
  return handleApiRequest<T>("/item", "POST");
}

const apiService = {
  getItem,
  getItems,
  deleteItem,
  postItem,
};

export default apiService;
