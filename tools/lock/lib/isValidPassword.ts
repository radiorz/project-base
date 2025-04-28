import bcrypt from 'bcryptjs';
const { compare } = bcrypt;
/**
 * 是否是有效的密码
 * @param password 用户输入的密码
 * @param secret 加密后的secret
 * @returns
 */
export function isValidPassword(password: string, secret: string) {
  return compare(password, secret);
}
