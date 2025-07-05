import { ConfigValue } from "../config.type";

export interface Source {
    // 初始化
    init?: () => void;
    // 用来加载初始配置
    load: () => ConfigValue;
    reset?: (path?: string) => void;
    // 用来同步配置进行新的保存
    save?: (path: string, value: any) => void;
    onChange?: (path: string, value: any) => void; // source变化我也变化
}
// alias
export type ConfigSource = Source 