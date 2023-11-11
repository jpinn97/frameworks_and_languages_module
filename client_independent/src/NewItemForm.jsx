import { useState } from 'react';

function NewItemForm() {
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
    fetch(`https://stunning-waffle-qx7p7x96qggc65x6-8000.app.github.dev/items/item`, {
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
    fetch(`https://stunning-waffle-qx7p7x96qggc65x6-8000.app.github.dev/items`)
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
    
    </div>
  );
}

export default NewItemForm;
