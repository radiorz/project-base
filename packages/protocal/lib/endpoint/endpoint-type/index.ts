// 1. 管理端：管理设备的应用，如手机app，网页应用等
// 2. 服务端：可接入设备并进行管理的服务器，为管理端和设备端提供必要的能力，如获取设备数据

import { EndpointType } from "../EndpointType.type"

// 3. 设备端：物联网设备，如主机、分机、门口机、网关等
export const SERVER: EndpointType = {
  name: 'server',
  title: '服务端',
  description: '服务端',
}

export const ADMIN: EndpointType = {
  name: 'admin',
  title: '管理端',
  description: '管理端',
}
export const CLIENT: EndpointType = {
  name: 'client',
  title: '客户端',
  description: '客户端',
}
