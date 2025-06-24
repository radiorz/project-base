export interface SipConfig {
  host: string;
  port: number;
  account: string; // 账号
  password: string; // 密码
  protocol: 'udp';
  keepalive: number;
  targets?: Target[]
}

interface Target {
  name: string; // 唯一指定名称，比如就是首页呼叫护士站的，要把护士站的地址告诉他
  account: string;
  title?: string;// 显示标题

}
