const ItemCard = ({ item, onDelete }) => {
    return (
      <div key={item.id} className="bg-gray-100 p-4 rounded-md justify-center">
        <div>
          <img src={item.image} alt="item" />
          <h5>Item ID: {item.id}</h5>
          <p>User ID: {item.user_id}</p>
          <p>Lat: {item.lat}</p>
          <p>Lon: {item.lon}</p>
          <p>Description: {item.description}</p>
        </div>
        <div>
          <button
            className="bg-gray-600 items-center text-white mx-auto px-4 py-2 hover:bg-red-600 rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  export default ItemCard