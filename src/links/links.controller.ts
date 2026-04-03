import { Controller, Get, Post, Body, Put, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from './entities/links.entity';
import { GetLinkDto } from './dto/get-link.dto';

@Controller('links')
export class LinksController {  
  constructor(private readonly linksService: LinksService) {}
  
  @Get()
  async getAllLinks(): Promise<Array<Link>> {
    return await this.linksService.getAllLinks();
  }

  @Post()
  async createLink(
    @Body() createLinkDto: CreateLinkDto): Promise<Link> {
    return await this.linksService.createLink(createLinkDto.name, createLinkDto.url, createLinkDto);
  }

  @Get(':name')
  async getLink(@Param('name') name: string) {
    console.log('name = ', name);
    const link = await this.linksService.getLink({ where: { name } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return link;
  }

  @Delete('/:id')
  async deleteLink(@Param() getLinkDto: GetLinkDto): Promise<void> {
    return this.linksService.deleteLink(getLinkDto);
  }

  @Put('/:id')
  async updateLink(@Param() getLinkDto: GetLinkDto, @Body() updateLinkDto: UpdateLinkDto): Promise<Link> {
    return this.linksService.updateLink(getLinkDto, updateLinkDto);
  }
}