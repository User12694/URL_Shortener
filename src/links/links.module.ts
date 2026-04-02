import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkRepository } from './links.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LinkRepository])],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
