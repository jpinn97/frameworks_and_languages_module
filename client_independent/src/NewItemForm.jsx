import React, { useState, useEffect } from 'react';
const urlAPI = import.meta.env.VITE_API_URL;
//const testValue = import.meta.env.VITE_TEST;




function NewItemForm() {

  const [isChange, setIsChange] = useState(false);
  // Initial  State Initialization
  const [formData, setFormData] = useState({
    user_id: '',
    lat: '',
    lon: '',
    image: 'http://placekitten.com/100/100',
    keywords: '',
    description: '',
  });

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onItemSubmit = (e) => {
     
    e.preventDefault();
    fetch(`${urlAPI}/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('Item created successfully.');
          setIsChange(!isChange);
          // TODO: add code here to handle a successful response, e.g., show a success message.
        } else {
          console.error('Failed to create item.');
          // TODO: add code here to handle a failed response, e.g., show an error message.
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // TODO: add code here to handle errors, e.g., show a network error message.
      });
  };
  const [items, setItems] = useState([]);
      
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [isChange]);

  const fetchItems = () => {
    fetch(`${urlAPI}/items`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => console.error("Error fetching items:", error));
  };
       // Placeholder for UI
  return (
    <div>
        <form  onSubmit={onItemSubmit}>
      <div>
        <label htmlFor="user_id">UserID:  </label>
        <input
          id="user_id"
          type="text"
          name="user_id"
          placeholder="Enter user_id"
          value={formData.user_id}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="lon">Longitude:  </label>
        <input
          id="lon"
          type="number"
          name="lon"
          placeholder="Enter your lon"
          value={formData.lon}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="lat">latitude:  </label>
        <input
          id="lat"
          type="number"
          name="lat"
          placeholder="Enter your lat"
          value={formData.lat}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="image">Image:  </label>
        <input
          id="image"
          type="url"
          name="image"
          placeholder="Enter Image url"
          value={formData.image}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="keywords">Keywords: </label>
        <input
          id="keywords"
          type="text"
          name="keywords"
          placeholder='Enter keywords'
          value={formData.keywords}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description: </label>
        <input
          id="description"
          type="text"
          name="description"
          rows="3"
          placeholder='Enter description'
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Item</button>
    </form>

    <div className="container mx-auto mt-5">
        <h3 className="text-lg font-semibold mb-4">Items</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center bg-gray-100 p-4 rounded-md">
              <button
                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </button>
              <div className="ml-4">
                <h5 className="text-md font-bold">Item ID: {item.id}</h5>
                <p>User ID: {item.user_id}</p>
                <p>Lat: {item.lat}</p>
                <p>Lon: {item.lon}</p>
                <img src={item.image} alt="item" />
                <p>Description: {item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    
    </div>
  );
}

export default NewItemForm;
