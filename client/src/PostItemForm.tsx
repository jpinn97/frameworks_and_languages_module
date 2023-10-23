import { useState } from "react";
import apiService from "./api_service.ts";
import { Item } from "./api_service.ts";

function PostItemForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState<Item>({
    id: 0,
    user_id: "",
    keywords: [],
    description: "",
    image: "",
    lat: 0,
    lon: 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert lat and lon to numbers
    const numericLat = parseFloat(formData.lat.toString());
    const numericLon = parseFloat(formData.lon.toString());

    if (!isNaN(numericLat) && !isNaN(numericLon)) {
      // Update the formData with numeric values
      const updatedFormData: Item = {
        ...formData,
        lat: numericLat,
        lon: numericLon,
      };

      try {
        const itemData: Item = await apiService.postItem(updatedFormData);
        console.log(itemData);
      } catch (err: unknown) {
        console.error(err);
      }
    }

    // Sends a request from the parent App, to the server to get the latest items
    onSubmit();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, keywords: value.split(",") });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        User ID:
        <input
          type="text"
          name="user_id"
          value={formData.user_id}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Keywords:
        <textarea
          name="keywords"
          value={formData.keywords.join(",")}
          onChange={handleKeywordsChange}
        />
      </label>
      <br />
      <label>
        Image:
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Latitude:
        <input
          type="number"
          name="lat"
          value={formData.lat}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Longitude:
        <input
          type="number"
          name="lon"
          value={formData.lon}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}

export default PostItemForm;
