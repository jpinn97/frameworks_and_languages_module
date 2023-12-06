import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import ItemCard  from './ItemCard';
import TextArea from './TextArea';
import CreatedItemsTitle from './CreatedItemsTitle'


const urlAPI = import.meta.env.VITE_API_URL;


function NewItemForm() {
 

  // Function to generate a new image URL
  const generateNewImageUrl = () => {
    return `https://picsum.photos/450/520?random=${Math.random()}`;
  };

  // Initial  State Initialization
  const [formData, setFormData] = useState({
    user_id: '',
    lat: '',
    lon: '',
    image: generateNewImageUrl(),
    keywords: '',
    description: '',
  });
  const [isChange, setIsChange] = useState(false);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, [isChange]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // creating an item
  const create_item = async (e) => {  
    e.preventDefault();
  
    try {
      // Making the POST request to create a new item
      const response = await fetch(`${urlAPI}/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      // Check if the response is successful
      if (response.ok) {
        // Parse the response to get the newly created item
        const newItem = await response.json();
  
        // Update the items state to include the new item
        setItems(prevItems => [...prevItems, newItem]);
  
        // Resetting form data for the next input
        setFormData({
          user_id: '',
          lat: '',
          lon: '',
          image: generateNewImageUrl(), // Generate a new image URL for the next item
          keywords: '',
          description: '',
        });
  
        // Set a success message for the UI
        setMessage('Item created successfully.');
        setIsChange(!isChange);
      } else {
        //  where the server responds with an error status
        console.error('Failed to create item.');
        setMessage('Failed to create item.');
      }
    } catch (error) {
      // Catch and handle any errors during the fetch operation
      console.error('Error:', error);
      setMessage(`Error: ${error.message}`);
    }
  
    console.log("Form posted!!!");
  };



  const fetchItems = async () => {
    try {
      const response = await fetch(`${urlAPI}/items`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setMessage(`Error fetching items: ${error.message}`);
    }
  };
  

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`${urlAPI}/item/${itemId}`, {
        method: "DELETE"
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      if (response.status === 204) {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        setMessage('Item deleted successfully.');
      } else {
        console.error("Error deleting item:", response.statusText);
        setMessage(`Error deleting item: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Error deleting item: ${error.message}`);
    }
  };
  
       // Placeholder for UI
  return (
    <div  className="container flex flex-col mx-auto p-4">

  <form onSubmit={create_item} className="max-w-md mx-auto bg-gray-50 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
 
    <InputField
    label="UserID"
    type="text"
    name="user_id"
    placeholder="Enter user_id"
    value={formData.user_id}
    onChange={handleChange}
    />

    <InputField
    label="Longitude"
    type="number"
    name="lon"
    placeholder="Enter longitude"
    value={formData.lon}
    onChange={handleChange}
    />
    
    <InputField
    label="Latitude"
    type="number"
    name="lat"
    placeholder="Enter latitude"
    value={formData.lat}
    onChange={handleChange}
    />
   
    <InputField
    label="Image"
    type="url"
    name="image"
    placeholder="Enter Image url"
    value={formData.image}
    onChange={handleChange}
    />

    <InputField
    label="Keywords"
    type="text"
    name="keywords"
    placeholder="Enter keywords"
    value={formData.keywords}
    onChange={handleChange}
    />
      
  
    <TextArea
    label="Description" 
    type="text"
    name="description"
    aria-label="Description" 
    placeholder="Enter description"
    value={formData.description}
    onChange={handleChange}
    />
  
    
    <div className="flex justify-center">
      <button data-action="create_item" type="submit" className="bg-gray-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-5 rounded focus:outline-none focus:shadow-outline">
        Create Item
      </button>
    </div>
  </form>
          
       <div aria-live="polite" className="container mx-auto mt-5 " >
      
        <CreatedItemsTitle /> 

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
          <li key={item.id} className="flex justify-center p-8">
            <ItemCard item={item} onDelete={handleDeleteItem} />
          </li>
          ))}
        </ul>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default NewItemForm;
