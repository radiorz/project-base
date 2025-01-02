import { EnvSource } from "@tikkhun/config-core";
export class ViteEnvSource extends EnvSource {
  getEnv() {
    return import.meta.env;
  }
  initEnv() {
    return true;
  }
}
