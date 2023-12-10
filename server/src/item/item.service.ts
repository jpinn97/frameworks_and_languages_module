// Import decorators and utilities from NestJS and external libraries.
import { Injectable, NotFoundException } from '@nestjs/common';
 import { v4 as uuid } from 'uuid'; // Importing UUID library to generate unique identifiers.

@Injectable()
export class ItemService {

  // private idCounter = 2; // Start the counter for Id => using this temporarily



  // Object to store items. 
  // Each key is an item ID, and the value is the item data.
  private items: Record<string, any> = {
    1: {
      // Initial item 
      id: 1,
      user_id: 'user1234',
      keywords: ['hammer', 'nails', 'tools'],
      description: 'A hammer and nails set',
      image: "http://placekitten.com/100/100",
      lat: 1,
      lon: 1,
      date_from: '2021-11-22T08:22:39.067408',
    },
  };


// Sample method, typically for testing or as a placeholder.
  getHello(): string {
    return 'Hello World!';
  }

    
  // Method to create a new item with unique ID and timestamps.
  createItem(item: any) {
    const newItemId = this.generateUniqueId();
    //const newItemId = (this.idCounter++).toString(); 
    const currentTime = new Date().toISOString(); // ISO 8601 format
    const expirationTime = new Date(); 
    expirationTime.setHours(expirationTime.getHours() + 24); // set expiration say For example, 24 hours from now

     // Constructing the new item object.
     const newItem = {
      id: newItemId,
      date_from: currentTime,
      date_to: expirationTime.toISOString(),
      ...item // Spread operator to include other item properties.
    };

    this.items[newItemId] = newItem;
    return newItem;
  }
  // Method to find an item by its ID.
  findById(id: string) {
    return this.items[id] || null; // Return the item or null if not found.
  }
  
 // Method to retrieve all items.
  findAll(): any[] {
    return Object.values(this.items); // Convert items object to an array.
  }

  // Method to delete an item by its ID.
  deleteItemById(id: string): boolean {
    if (this.items[id]) {
      delete this.items[id];
      return true; // Indicate successful deletion
    }
    return false; // Indicate item not found
  }
  
 // Method to update an existing item by its ID.
  updateItem( id: string, item: any) {
  if (this.items[id]) {
    this.items[id] = {...this.items[id], ...item};
    return this.items[id];
  } else {
    throw new NotFoundException(`Item with id ${id} not found`);
  }
}

// Method to filter items based on various query parameters.
  filter(query: any) {
    return Object.values(this.items).filter((item: any) => {
      // Filtering logic based on user_id, keyword, location, and date.
      // Return true if item passes all filters, otherwise false.
      if (query.user_id && item.user_id !== query.user_id) {
        return false;
      }
  
      if (query.keyword && !item.keywords.some(kw => query.keyword.split(',').includes(kw))) {
        return false;
      }
  
      if (query.lon && query.lat && (item.lon !== query.lon || item.lat !== query.lat)) {
        return false;
      }
  
      if (query.date_from && new Date(item.date_from) < new Date(query.date_from)) {
        return false;
      }
  
      return true; // Item passes all filters
    });
  }
  

  private generateUniqueId() {
     return uuid()
  }

}
