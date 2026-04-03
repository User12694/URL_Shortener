import { Controller, Get, Param, NotFoundException, Res } from '@nestjs/common';
import express from 'express';
import { LinksService } from 'src/links/links.service';

@Controller()
export class WildcardController {
    constructor(private readonly linksService: LinksService) { }

    @Get(':name')
    async getLinkByName(@Param('name') name: string,@Res() res: express.Response) {
        const link = await this.linksService.getLink({ where: { name } });
        if (!link) {
            throw new NotFoundException('Link not found');
        }
        return res.redirect(301, link.url);
    }
}
