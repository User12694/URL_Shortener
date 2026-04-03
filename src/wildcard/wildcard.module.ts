import { Module } from '@nestjs/common';
import { WildcardController } from './wildcard.controller';
import { LinksModule} from 'src/links/links.module';

@Module({
  imports: [LinksModule],
  controllers: [WildcardController],
})
export class WildcardModule {}
