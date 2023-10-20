import { Item } from "./api_service.ts";

type ListItemProps = {
  item: Item;
};

function ListItem({ item }: ListItemProps) {
  return (
    <li key={item.id}>
      User ID: {item.user_id}
      <br />
      Description: {item.description}
      <br />
      <ul>
        {Object.keys(item.keywords).map((keyword, index) => (
          <li key={index}>{keyword}</li>
        ))}
      </ul>
      Image: {item.image}
      <br />
      Latitude: {item.lat}
      <br />
      Longitude: {item.lon}
      <br />
      Date From: {item.date_from}
      <br />
    </li>
  );
}

export default ListItem;
