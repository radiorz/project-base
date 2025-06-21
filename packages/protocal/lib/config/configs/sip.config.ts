export interface SipConfig {
  host: string;
  port: number;
  account: string; // 账号
  password: string; // 密码
  protocol: 'udp';
  keepalive: number;
}
