import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { GetLinkDto } from './dto/get-link.dto';

const mockLink = { id: '1', name: 'google', url: 'https://google.com' };

describe('LinksController', () => {
  let controller: LinksController;
  let linksService: Partial<Record<keyof LinksService, jest.Mock>>;

  beforeEach(async () => {
    linksService = {
      getAllLinks: jest.fn().mockResolvedValue([mockLink]),
      createLink: jest.fn().mockResolvedValue(mockLink),
      getLink: jest.fn().mockResolvedValue(mockLink),
      deleteLink: jest.fn().mockResolvedValue(undefined),
      updateLink: jest.fn().mockResolvedValue({ ...mockLink, name: 'bing' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [
        {
          provide: LinksService,
          useValue: linksService,
        },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllLinks should return all links', async () => {
    await expect(controller.getAllLinks()).resolves.toEqual([mockLink]);
    expect(linksService.getAllLinks).toHaveBeenCalled();
  });

  it('createLink should create a link', async () => {
    const createDto: CreateLinkDto = { name: 'google', url: 'https://google.com' } as any;
    await expect(controller.createLink(createDto)).resolves.toEqual(mockLink);
    expect(linksService.createLink).toHaveBeenCalledWith('google', 'https://google.com', createDto);
  });

  it('getLink should return a link', async () => {
    await expect(controller.getLink('google')).resolves.toEqual(mockLink);
    expect(linksService.getLink).toHaveBeenCalledWith({ where: { name: 'google' } });
  });

  it('getLink should throw NotFoundException when no link', async () => {
    (linksService.getLink as jest.Mock).mockRejectedValueOnce(new NotFoundException());
    await expect(controller.getLink('none')).rejects.toThrow(NotFoundException);
  });

  it('deleteLink should delete by id', async () => {
    const getDto: GetLinkDto = { id: '1' };
    await expect(controller.deleteLink(getDto)).resolves.toBeUndefined();
    expect(linksService.deleteLink).toHaveBeenCalledWith(getDto);
  });

  it('updateLink should update and return link', async () => {
    const getDto: GetLinkDto = { id: '1' };
    const updateDto: UpdateLinkDto = { name: 'bing', url: 'https://bing.com' } as any;
    await expect(controller.updateLink(getDto, updateDto)).resolves.toEqual({ ...mockLink, name: 'bing' });
    expect(linksService.updateLink).toHaveBeenCalledWith(getDto, updateDto);
  });
});
