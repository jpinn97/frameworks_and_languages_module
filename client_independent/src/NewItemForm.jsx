import { useState } from 'react';

function NewItemForm() {
  // Stage 1: State Initialization
  const [formData, setFormData] = useState({
    user_id: '',
    lat: '',
    lon: '',
    image: 'http://placekitten.com/100/100',
    keywords: '',
    description: '',
  });
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
