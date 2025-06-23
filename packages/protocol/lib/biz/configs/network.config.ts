export const networkSchema = {
    type: 'object',
    properties: {

    }
}
export interface networkConfig {
    type: NetworkType;
    mac: string;
    dhcp: boolean;
    ip: string;
    gateway: string;
    dns_prefer: string;
    netmask: string;
    dns_alter: string
}

export enum NetworkType {
    UNKNOWN, // 未知
    LAN, // 有线
    WLAN, // 无线
}