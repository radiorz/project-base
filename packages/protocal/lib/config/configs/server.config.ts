// 一般应用只对应一个主服务器，偶尔会访问其他的服务器
export interface ServerConfig {
  host: string;
  port: string;
  auth: any;
}

export interface BaseAuth {
  username: string;
  password: string;
}
export interface JwtAuth {
  token: string;
}
