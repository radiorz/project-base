# logger

实现一个可以替换logger 实现的例子

## 使用

```
import { Logger } from '../lib/impl';
Logger.log('123');
Logger.debug!('123');
Logger.warn('123');
Logger.error('123');

const logger = new Logger('local');

logger.debug!('123');

```
