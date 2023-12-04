const ItemCard = ({ item, onDelete }) => {
    return (
      <div key={item.id} className="bg-gray-100 p-4 rounded-md justify-center">
        <div>
          <img src={item.image} alt="item" />
          <h5 data-field="id" >Item ID: {item.id}</h5>
          <p data-field="user_id">User ID: {item.user_id}</p>
          <p data-field="lat">Lat: {item.lat}</p>
          <p data-field="lon">Lon: {item.lon}</p>
          <p data-field="description">Description: {item.description}</p>
        </div>
        <div>
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

  export default ItemCard