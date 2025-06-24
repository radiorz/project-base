import { StatusCategory } from 'dist';

export const MqttStatus: StatusCategory = {
  name: 'mqtt',
  title: 'MQTT状态',
  values: [
    {
      value: 0,
      name: '未连接',
    },
    {
      value: 1,
      name: '已连接',
    },
  ],
  default: 0,
};
