import { Description } from "./consts";
import { ID } from "./id";

export interface EndpointType extends Description {

}
export interface EndpointSchema extends Description {
  type: EndpointType['name'];
  configSchema: Record<string, any>;
}

export interface Endpoint extends Description {
  id: ID;
  type: EndpointSchema['name'];
  config: Record<string, any>
}
export const server: EndpointType = {
  name: 'server',
  title: '服务器',
  description: '服务器',
}

export const admin: EndpointType = {
  name: 'admin',
  title: '管理后台',
  description: '管理后台',
}
export const client: EndpointType = {
  name: 'client',
  title: '客户端',
  description: '客户端',
}
// license-server 定义
export const licenseServerEndPoint: EndpointSchema = {
  name: 'licenseServer',
  title: '授权服务器',
  description: '授权服务器',
  type: server.name,
  configSchema: {}
}
// 具体某台
export const testLicenseServer: Endpoint = {
  id: '123123',
  name: 'licenseServer-test',
  type: licenseServerEndPoint.name,
  config: {

  }
}
