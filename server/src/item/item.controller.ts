// Importing necessary decorators and components from NestJS and other modules.



import {  
  Body, 
  Post, 
  Get, 
  HttpCode, 
  HttpStatus, 
  Controller, 
  Query, 
  NotFoundException, 
  Param, 
  Delete,
  Patch,
  UseFilters
} from '@nestjs/common';
import { ItemService } from './item.service'; // Service for handling item-related logic.
import { CreateItemDto } from './dto/create-item.dto'; // Data Transfer Object for creating items.
import { HttpExceptionFilter } from 'src/http-exception-filter'; // Custom exception filter.
import { UpdateItemDto } from './dto/update-item.dto';  // DTO for updating items.
// import {  ParseUUIDPipe } from '@nestjs/common';


// Decorators to mark a class as a NestJS controller with its route path.
@Controller()
// Applying a custom exception filter for this controller.
@UseFilters(new HttpExceptionFilter())
export class ItemController {
  // Injecting ItemService into the controller.
  constructor(private readonly itemService: ItemService) {}

 // commented out: not served on route but an index.html is the requirement
 // @Get()
//   getHello(): string {
//     return this.itemService.getHello();
//   }

   // POST endpoint to create a new item.
@Post('/item')
  @HttpCode(HttpStatus.CREATED) // Setting the HTTP status code to 201 (Created).
  async createItem(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.createItem(createItemDto);
  }

 // GET endpoint to fetch an item by its ID.
  // handles GET requests to /item/:id to get an item provided id
  @Get('/item/:id')
  async getItemById(@Param('id') id: any) {
    const item = await this.itemService.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found.`);
    }
    return item;
  } 


   // GET endpoint to fetch all items.
  @Get('/items') // HTTP GET on '/items'
  getAllItems() {
    return this.itemService.findAll();
  }


  // DELETE endpoint to delete an item by its ID.
 @Delete('/item/:id')
 @HttpCode(HttpStatus.NO_CONTENT)  // Setting HTTP status code to 204 (No Content) on success.
 async deleteItem(@Param('id') id: string) {
   const isDeleted = await this.itemService.deleteItemById(id);
   // If the item is not found for deletion, throw a 404 error.
   if (!isDeleted) {
     throw new NotFoundException(`Item with ID ${id} not found.`);
   }
   // errrr if deleted, a 204 No Content response will be sent automatically
 }

 // PATCH endpoint to update an existing item by its ID.
   @Patch('/item/:id')
   updateItem(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.updateItem(id, updateItemDto);
  }
 

}