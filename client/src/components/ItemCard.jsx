// Define the ItemCard functional component with destructured props.

const ItemCard = ({ item, onDelete }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md justify-center">
      <img src={item.image} alt="item" />
      <div>
        <h5 data-field="id">Item ID: {item.id}</h5>
        <p>User ID: {item.user_id}</p>
        <div>
          <p>Lat: {item.lat}</p>
          <p>Lon: {item.lon}</p>
          <p>Keywords: {item.keywords}</p>
          <p>Description: {item.description}</p>
        </div>
        <button
          data-action="delete"
          className="bg-gray-600 w-full mt-2  text-white mx-auto px-4 py-2 hover:bg-red-600 rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
          onClick={() => onDelete(item.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Export the ItemCard component for reuse in other parts of the application.
export default ItemCard;

