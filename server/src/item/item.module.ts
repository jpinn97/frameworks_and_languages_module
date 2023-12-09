// Import the Module decorator from NestJS, used for grouping providers (like services) and controllers.
import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';



// Decorator to mark a class as a module in NestJS.
@Module({
   // Registering the ItemController within this module.
  controllers: [ItemController],
  // Registering the ItemService as a provider so it can be injected into controllers or other services.
  providers: [ItemService]
})


// Exporting the ItemModule class
export class ItemModule {}
