import { ClientsModule, Transport } from '@nestjs/microservices'; // 注册一个用于对微服务进行数据传输的客户端

export const ClientModule = ClientsModule.register([
  {
    name: 'MATH_SERVICE',
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  },
]);
