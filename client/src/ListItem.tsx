import { Item } from "./api_service.ts";

type ListItemProps = {
  item: Item;
  onDeleteItem: (id: number) => void;
};

function ListItem({ onDeleteItem, item }: ListItemProps) {
  return (
    <div className="border-soiid border-2 border-black max-w-max">
      <li key={item.id}>
        User ID: {item.user_id}
        <br />
        Description: {item.description}
        <br />
        <ul>
          Keywords:{" "}
          {Object.keys(item.keywords).map((keyword, index) => (
            <li key={index}>- {keyword}</li>
          ))}
        </ul>
        <img className="object-scale-down h-48 w-96" src={item.image}></img>
        <br />
        Latitude: {item.lat}
        <br />
        Longitude: {item.lon}
        <br />
        Date From: {item.date_from}
        <br />
      </li>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => onDeleteItem(item.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default ListItem;
