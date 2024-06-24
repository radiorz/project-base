export interface ConfigSource {
  init?: () => void;
  load: () => Record<string, any>;
}
