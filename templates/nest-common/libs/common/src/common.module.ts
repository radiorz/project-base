import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ClientModule } from './client/client.module';
import { DictModule } from './dict/dict.module';
import { ApplicationModule } from './application/application.module';

@Module({
  providers: [CommonService, ClientModule],
  exports: [CommonService, ClientModule],
  imports: [DictModule, ApplicationModule],
})
export class CommonModule {}
