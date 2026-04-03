import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { WildcardController } from './wildcard.controller';
import { LinksService } from '../links/links.service';

const mockLink = { id: '1', name: 'google', url: 'https://google.com' };

describe('WildcardController', () => {
  let controller: WildcardController;
  let linksService: Partial<Record<keyof LinksService, jest.Mock>>;
  let res: Partial<Response>;

  beforeEach(async () => {
    linksService = {
      getLink: jest.fn().mockResolvedValue(mockLink),
    };

    res = {
      redirect: jest.fn().mockReturnValue(undefined),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WildcardController],
      providers: [{ provide: LinksService, useValue: linksService }],
    }).compile();

    controller = module.get<WildcardController>(WildcardController);
  });

  it('should redirect to link.url when link found', async () => {
    await controller.getLinkByName('google', res as Response);
    expect(linksService.getLink).toHaveBeenCalledWith({ where: { name: 'google' } });
    expect(res.redirect).toHaveBeenCalledWith(301, 'https://google.com');
  });

  it('should throw NotFoundException when link not found', async () => {
    (linksService.getLink as jest.Mock).mockRejectedValueOnce(new NotFoundException('Link not found'));
    await expect(controller.getLinkByName('none', res as Response)).rejects.toThrow(NotFoundException);
  });
});