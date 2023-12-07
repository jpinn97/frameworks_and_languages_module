// import React, { useState, useEffect } from 'react';

// const urlAPI = import.meta.env.VITE_API_URL;

// // const urlParams = new URLSearchParams(window.location.search);
// // const urlAPI = (urlParams.get('api') || '/api/v1').replace(/\/$/, '');



// function NewItemForm() {
//   let img = "https://picsum.photos/150"
 
//   // Initial  State Initialization
//   const [formData, setFormData] = useState({
//     user_id: '',
//     lat: '',
//     lon: '',
//     image: img,
//     keywords: '',
//     description: '',
//   });
//   const [isChange, setIsChange] = useState(false);
//   const [items, setItems] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchItems();
//   }, [isChange]);
 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const onItemSubmit = (e) => {  
//     e.preventDefault();
//     console.log("Server Url: " + import.meta.env.VITE_API_URL),
//     fetch(`${urlAPI}/item`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     })
//     .then((response) => {
//         if (response.status === 201) {
//           console.log('Item created successfully.');
//           setMessage('Item created successfully.');
//           setIsChange(!isChange);
//         } else {
//           console.error('Failed to create item.');
//           setMessage('Failed to create item.'); }
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         setMessage(`Error: ${error.message}`);      
//       });
//       console.log("Form posted!!!")
//   };


//   const fetchItems = () => {
//     fetch(`${urlAPI}/items`)
//       .then((response) => response.json())
//       .then((data) => {
//         setItems(data);
//       })
//       .catch((error) => setMessage(`Error fetching items: ${error.message}`));
//   };

//   const handleDeleteItem = (itemId) => {
//     fetch(`${urlAPI}/item/${itemId}`, {
//       method: "DELETE" })
//       .then((response) => {
//         if (response.status === 204) {
//           setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
//         } else {
//           console.error("Error deleting item:", response.statusText);
//           setMessage(`Error deleting item: ${response.statusText}`);
//         }
//       })
//       .catch((error) => setMessage(`Error deleting item: ${error.message}`));
//   };
//        // Placeholder for UI
//   return (
//     <div  className="container flex flex-col mx-auto p-4">

//   <form onSubmit={onItemSubmit} className="max-w-md mx-auto bg-gray-50 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
//     <div className="flex items-center mb-5">
//       <label htmlFor="user_id" className="mr-2">UserID:</label>
//       <input
//         className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-100 outline-none focus:border-green-400"
//         id="user_id"
//         type="text"
//         name="user_id"
//         placeholder="Enter user_id"
//         aria-label="User ID"
//         value={formData.user_id}
//         onChange={handleChange}
//       />
//     </div>
//     <div className="flex items-center mb-5" >
//         <label htmlFor="lon" className="mr-2">Longitude:  </label>
//         <input
//           className="border-b-2 border-gray-400 mx-auto flex-1 py-2 placeholder-gray-200 outline-none focus:border-green-400"
//           id="lon"
//           type="number"
//           name="lon"
//           placeholder="Enter your lon"
//           value={formData.lon}
//           onChange={handleChange}
//         />
//       </div>
//     <div className="flex items-center mb-5">
//         <label htmlFor="lat" className="mr-2">latitude:  </label>
//         <input
//            className="border-b-2 border-gray-400 mx-auto flex-1 py-2 placeholder-gray-200 outline-none focus:border-green-400"
//           id="lat"
//           type="number"
//           name="lat"
//           placeholder="Enter your lat"
//           value={formData.lat}
//           onChange={handleChange}
//         />
//       </div>
//     <div className="flex items-center mb-5">
//         <label htmlFor="image" className="mr-2">Image:  </label>
//         <input
//           className="border-b-2 border-gray-400 mx-auto flex-1 py-2 placeholder-gray-200 outline-none focus:border-green-400"
//           id="image"
//           type="url"
//           name="image"
//           placeholder="Enter Image url"
//           value={formData.image}
//           onChange={handleChange}
//         />
//       </div>
//      <div className="flex items-center mb-5">
//         <label htmlFor="keywords" className="mr-2">Keywords: </label>
//         <input
//            className="border-b-2 border-gray-400 mx-auto flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400"
//           id="keywords"
//           type="text"
//           name="keywords"
//           placeholder='Enter keywords'
//           value={formData.keywords}
//           onChange={handleChange}
//         />
//       </div>
//     <div className="flex items-center mb-5">
//       <label htmlFor="description" className="mr-2">Description:</label>
//       <textarea
//         className="border-b-2 border-gray-400 mx-auto flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400"
//         id="description"
//         name="description"
//         rows="3"
//         placeholder="Enter description"
//         aria-label="Description"
//         value={formData.description}
//         onChange={handleChange}
//       ></textarea>
//     </div>
//     <div className="flex justify-center">
//       <button type="submit" className="bg-gray-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-5 rounded focus:outline-none focus:shadow-outline">
//         Create Item
//       </button>
//     </div>
//   </form>

//     <div aria-live="polite" className="container mx-auto mt-5 " >
//         <div className="w-full pl-5 lg:pl-2 mb-4 mt-4 justify-center">
//       <h1 className="text-3xl lg:text-4xl text-gray-600 font-extrabold flex justify-center">
//         Created Items
//       </h1>
//     </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {items.map((item) => (
//             <div key={item.id} className="bg-gray-100 p-4 rounded-md justify-center"><div>
//               <img src={item.image} alt="item"/>
//                 <h5>Item ID: {item.id}</h5>
//                 <p>User ID: {item.user_id}</p>
//                 <p>Lat: {item.lat}</p>
//                 <p>Lon: {item.lon}</p>
//                 <p>Description: {item.description}</p>
//               </div>
//               <div>
//               <button
//               className="bg-gray-600 items-center text-white mx-auto px-4 py-2 hover:bg-red-600 rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out" 
//                 onClick={() => handleDeleteItem(item.id)}
//               >
//                 Delete
//               </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
    
//     </div>
//   );
// }

// export default NewItemForm;
