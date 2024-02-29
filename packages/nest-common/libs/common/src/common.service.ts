import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  getHello() {
    return 'hello';
  }
}
