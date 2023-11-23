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
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { HttpExceptionFilter } from 'src/http-exception-filter';
import { UpdateItemDto } from './dto/update-item.dto';
// import {  ParseUUIDPipe } from '@nestjs/common';



@Controller()
@UseFilters(new HttpExceptionFilter())
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

 // commented out: not served on route but an index.html is the requirement
 // @Get()
//   getHello(): string {
//     return this.itemService.getHello();
//   }

 
@Post('/item')
  @HttpCode(HttpStatus.CREATED)
  async createItem(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.createItem(createItemDto);
  }


  // handles GET requests to /item/:id to get an item provided id
  @Get('/item/:id')
  async getItemById(@Param('id') id: any) {
    const item = await this.itemService.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found.`);
    }
    return item;
  } 

  @Get('/items') // HTTP GET on '/items'
  getAllItems() {
    return this.itemService.findAll();
  }


//   @Get('/items')
//    getItems(@Query() query: any) {
//      return this.itemService.findAll(query);
//  }



 @Delete('/item/:id')
 @HttpCode(HttpStatus.NO_CONTENT)
 async deleteItem(@Param('id') id: string) {
   const isDeleted = await this.itemService.deleteItemById(id);
   if (!isDeleted) {
     throw new NotFoundException(`Item with ID ${id} not found.`);
   }
   // errrr if deleted, a 204 No Content response will be sent automatically
 }

   @Patch('/item/:id')
   updateItem(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.updateItem(id, updateItemDto);
  }
 

}