import { ConfigRecordId, ConfigData } from './config-manager.types';
export interface ConfigObject {
  [id: ConfigRecordId]: ConfigData;
}
