import { Logger } from '../lib';
Logger.log('123');
Logger.debug!('123');
Logger.warn('123');
Logger.error('123');

const logger = new Logger();

logger.debug!('123');
