import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import ItemCard  from './ItemCard';
import TextArea from './TextArea';


const urlAPI = import.meta.env.VITE_API_URL;


function NewItemForm() {
 

  // Function to generate a new image URL
  const generateNewImageUrl = () => {
    return `https://picsum.photos/200/300?random=${Math.random()}`;
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

  const onItemSubmit = (e) => {  
    e.preventDefault();
    console.log("Server Url: " + import.meta.env.VITE_API_URL),
    fetch(`${urlAPI}/item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then((response) => {
        if (response.status === 201) {
          console.log('Item created successfully.');
          setMessage('Item created successfully.');
          setIsChange(!isChange);
          setFormData({ ...formData, image: generateNewImageUrl() }); // Set a new random image
        } else {
          console.error('Failed to create item.');
          setMessage('Failed to create item.'); }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage(`Error: ${error.message}`);      
      });
      console.log("Form posted!!!")
  };


  const fetchItems = () => {
    fetch(`${urlAPI}/items`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => setMessage(`Error fetching items: ${error.message}`));
  };

  const handleDeleteItem = (itemId) => {
    fetch(`${urlAPI}/item/${itemId}`, {
      method: "DELETE" })
      .then((response) => {
        if (response.status === 204) {
          setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        } else {
          console.error("Error deleting item:", response.statusText);
          setMessage(`Error deleting item: ${response.statusText}`);
        }
      })
      .catch((error) => setMessage(`Error deleting item: ${error.message}`));
  };
       // Placeholder for UI
  return (
    <div  className="container flex flex-col mx-auto p-4">

  <form onSubmit={onItemSubmit} className="max-w-md mx-auto bg-gray-50 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
 
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
      type="text"
      name="lon"
      placeholder="Enter longitude"
      value={formData.lon}
      onChange={handleChange}
     />
    
      <InputField
      label="Latitude"
      type="text"
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
      placeholder="Enter description"
      value={formData.description}
      onChange={handleChange}
    />
    <div className="flex justify-center">
      <button type="submit" className="bg-gray-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-5 rounded focus:outline-none focus:shadow-outline">
        Create Item
      </button>
    </div>
  </form>

    <div aria-live="polite" className="container mx-auto mt-5 " >
        <div className="w-full pl-5 lg:pl-2 mb-4 mt-4 justify-center">
      <h1 className="text-3xl lg:text-4xl text-gray-600 font-extrabold flex justify-center">
        Created Items
      </h1>
    </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
          ))}
        </div>
      </div>
    
    </div>
  );
}

export default NewItemForm;
