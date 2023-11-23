import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // 'public' is the folder where your static files are located. Adjust if necessary.
    }),
    ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
