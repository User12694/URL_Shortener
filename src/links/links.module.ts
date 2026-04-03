import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksRepository } from './links.repository';
import { Link } from './entities/links.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  controllers: [LinksController],
  providers: [LinksService, LinksRepository],
  exports: [LinksService, LinksRepository],
})
export class LinksModule {}
