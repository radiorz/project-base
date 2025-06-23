import { SERVER } from "../modules/endpoint/endpoint-types";
import { EndpointSchema } from "../modules/endpoint/endpoint";

// license-server 定义
export const licenseServerEndPoint: EndpointSchema = {
  name: 'licenseServer',
  title: '授权服务器',
  description: '授权服务器',
  type: SERVER.name,
  configSchema: {}
}


// // 具体某台
// export const testLicenseServer: Endpoint = {
//   id: '123123',
//   name: 'licenseServer-test',
//   type: licenseServerEndPoint.name,
//   config: {

//   }
// }
