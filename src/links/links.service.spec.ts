import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { LinksRepository } from './links.repository';
import { Link } from './entities/links.entity';
import { GetLinkDto } from './dto/get-link.dto';

const mockLink: Link = { id: '1', name: 'google', url: 'https://google.com' };

describe('LinksService', () => {
  let service: LinksService;
  let linksRepository: Partial<Record<keyof LinksRepository, jest.Mock>>;

  beforeEach(async () => {
    linksRepository = {
      find: jest.fn().mockResolvedValue([mockLink]),
      findDuplicate: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockReturnValue(mockLink),
      save: jest.fn().mockResolvedValue(mockLink),
      findOne: jest.fn().mockResolvedValue(mockLink),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: LinksRepository,
          useValue: linksRepository,
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllLinks should return a list of links', async () => {
    const result = await service.getAllLinks();
    expect(result).toEqual([mockLink]);
    expect(linksRepository.find).toHaveBeenCalled();
  });

  it('normalizedLink should add https:// when missing protocol', () => {
    const unnormalized = { ...mockLink, url: 'example.com' };
    const result = service.normalizedLink(unnormalized);
    expect(result.url).toBe('https://example.com');
  });

  it('normalizedLink should keep url when has http protocol', () => {
    const secure = { ...mockLink, url: 'http://example.com' };
    const result = service.normalizedLink(secure);
    expect(result.url).toBe('http://example.com');
  });

  it('createLink should throw conflict when duplicate exists', async () => {
    (linksRepository.findDuplicate as jest.Mock).mockResolvedValue(mockLink);
    await expect(service.createLink('google','https://google.com',{name:'google',url:'https://google.com'} as any)).rejects.toThrow(ConflictException);
  });

  it('createLink should save when no duplicate', async () => {
    (linksRepository.findDuplicate as jest.Mock).mockResolvedValue(null);
    const result = await service.createLink('google','https://google.com',{name:'google',url:'https://google.com'} as any);
    expect(result).toEqual(mockLink);
    expect(linksRepository.create).toHaveBeenCalledWith({ name: 'google', url: 'https://google.com' });
    expect(linksRepository.save).toHaveBeenCalledWith(mockLink);
  });

  it('getLink should return a link when exists', async () => {
    (linksRepository.findOne as jest.Mock).mockResolvedValue(mockLink);
    const result = await service.getLink({ where: { name: 'google' } });
    expect(result).toEqual(mockLink);
  });

  it('getLink should throw NotFoundException when not found', async () => {
    (linksRepository.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.getLink({ where: { name: 'none' } })).rejects.toThrow(NotFoundException);
  });

  it('deleteLink should succeed when record exists', async () => {
    (linksRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
    await expect(service.deleteLink({ id: '1' } as GetLinkDto)).resolves.toBeUndefined();
  });

  it('deleteLink should throw NotFoundException when no record deleted', async () => {
    (linksRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });
    await expect(service.deleteLink({ id: '1' } as GetLinkDto)).rejects.toThrow(NotFoundException);
  });

  it('updateLink should modify and save link', async () => {
    (linksRepository.findOne as jest.Mock).mockResolvedValue({ ...mockLink });
    const result = await service.updateLink({ id: '1' } as GetLinkDto, { name: 'bing', url: 'https://bing.com' } as any);
    expect(result.name).toBe('bing');
    expect(result.url).toBe('https://bing.com');
    expect(linksRepository.save).toHaveBeenCalled();
  });
});
