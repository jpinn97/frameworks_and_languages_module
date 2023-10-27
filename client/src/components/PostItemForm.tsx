import { useState } from "react";
import apiService, { Item } from "../api_service";
import React from "react";

function PostItemForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState<Item>({
    id: 0,
    user_id: "",
    keywords: "",
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
    console.log(name, value);
    // Check if the input field corresponds to keywords
    if (name === "keywords") {
      // Normalize and split keywords based on various delimiters
      const normalizedInput: string[] = normalizeAndSplitKeywords(value);
      setFormData({ ...formData, keywords: normalizedInput.join(",") });
    } else {
      // Handle other input fields as usual
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function to normalize and split keywords based on various delimiters
  const normalizeAndSplitKeywords = (input: string) => {
    const delimiters = /[/,;|.\s]+/;
    return input.split(delimiters);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        User ID:
        <input
          data-field="user_id"
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
          data-field="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Keywords:
        <textarea
          data-field="keywords"
          name="keywords"
          value={formData.keywords}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Image:
        <input
          data-field="image"
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
          data-field="lat"
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
          data-field="lon"
          type="number"
          name="lon"
          value={formData.lon}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <button
        data-action="create_item"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}

export default PostItemForm;
