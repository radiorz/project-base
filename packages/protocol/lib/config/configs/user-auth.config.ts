// 谁可以用这个设备 提供认证方式 指纹 人脸 密码
export interface UserAuthConfig {
  type: string;// 类型
  config: any;
}
