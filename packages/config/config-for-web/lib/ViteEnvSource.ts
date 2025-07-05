import { EnvSource } from "@tikkhun/env-source";
export class ViteEnvSource extends EnvSource {
  getEnv() {
    return import.meta.env;
  }
  initEnv() {
    return true;
  }
}
