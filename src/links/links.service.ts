import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinksRepository } from './links.repository';
import { Link } from './entities/links.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions } from 'typeorm';
import { GetLinkDto } from './dto/get-link.dto';
@Injectable()
export class LinksService {
  linksRepository: LinksRepository;
  constructor(
    @InjectRepository(LinksRepository)
    linksRepository: LinksRepository) {
    this.linksRepository = linksRepository;
  }
  async getAllLinks(): Promise<Array<Link>> {
    return await this.linksRepository.find();
  }
  normalizedLink(link: Link): Link {
    if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
      if (!link.url.startsWith('www'))
      link.url = 'https://' + link.url;
    }
    return link;

  }
  async createLink(name: string, url: string, createLinkDto: CreateLinkDto): Promise<Link> {
    const duplicate = await this.linksRepository.findDuplicate(name, url);
    if (duplicate) {
      throw new ConflictException('Name or URL already exists');
    }

    const link = this.linksRepository.create({
      name: name,
      url: url
    });
    return await this.linksRepository.save(link);
  }

  async getLink(conditions: FindOneOptions<Link>): Promise<Link> {
    const link = await this.linksRepository.findOne(conditions);
    // Nếu không có tìm thấy link, trả về lỗi 404 Not Found
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return link;
  }
  async deleteLink(getLinkDto: GetLinkDto): Promise<void> {
    const {id} = getLinkDto
    const result = await this.linksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Link with id ${id} not found`);
    }
  }
  async updateLink(getLinkDto: GetLinkDto, updateLinkDto: UpdateLinkDto): Promise<Link> {
    const {id} = getLinkDto;
    const { name, url } = updateLinkDto;
    const link = await this.getLink({ where: { id } });
    link.name = name;
    link.url = url;
    await this.linksRepository.save(link);
    return link;
  }
}
