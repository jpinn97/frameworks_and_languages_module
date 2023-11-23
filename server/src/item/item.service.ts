import { Injectable, NotFoundException } from '@nestjs/common';
// import { v4 as uuid } from 'uuid';

@Injectable()
export class ItemService {

  private idCounter = 2; // Start the counter for Id => using this temporarily
  private items: Record<string, any> = {
    1: {
      id: 1,
      user_id: 'user1234',
      keywords: ['hammer', 'nails', 'tools'],
      description: 'A hammer and nails set',
      lat: 1,
      lon: 1,
      date_from: '2021-11-22T08:22:39.067408',
    },
  };

  getHello(): string {
    return 'Hello World!';
  }

  
  createItem(item: any) {
    //const newItemId = this.generateUniqueId();
    const newItemId = (this.idCounter++).toString(); 
    const currentTime = new Date().toISOString(); // ISO 8601 format
    const expirationTime = new Date(); 
    expirationTime.setHours(expirationTime.getHours() + 24); // set expiration say For example, 24 hours from now

    const newItem = {
      id: newItemId,
      date_from: currentTime,
      date_to: expirationTime.toISOString(),
      ...item
    };

    this.items[newItemId] = newItem;
    return newItem;
  }

  findById(id: string) {
    return this.items[id] || null;
  }
  

  findAll(): any[] {
    return Object.values(this.items);
  }

  
  deleteItemById(id: string): boolean {
    if (this.items[id]) {
      delete this.items[id];
      return true; // Indicate successful deletion
    }
    return false; // Indicate item not found
  }
  
 
  updateItem( id: string, item: any) {
  if (this.items[id]) {
    this.items[id] = {...this.items[id], ...item};
    return this.items[id];
  } else {
    throw new NotFoundException(`Item with id ${id} not found`);
  }
}

  filter(query: any) {
    return Object.values(this.items).filter((item: any) => {
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
  

  // private generateUniqueId() {
  //   // return uuid()
  // }

}
