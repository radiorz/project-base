import { Logger } from '../lib/impl';
Logger.log('log');
Logger.debug!('debug');
Logger.warn('warn');
Logger.error('error');

const logger = new Logger('local');
logger.debug!('debug1');
logger.setLogLevels!(['log']);
logger.debug!('debug2');
