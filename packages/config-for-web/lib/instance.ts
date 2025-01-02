import { Config } from "@tikkhun/config-core";
import { LocalStorageSource } from "./LocalStorageSource";
import { ViteEnvSource } from "./ViteEnvSource";
export const DEFAULT_CONFIG_MANAGER = Config.create({
  sources: [new ViteEnvSource(), new LocalStorageSource()],
});
