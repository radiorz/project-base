import bcrypt from 'bcryptjs';
const { genSalt, hash, compare } = bcrypt;
export async function generateKey(password: string) {
  const salt = await genSalt();
  const secret = await hash(password, salt);
  return { salt, secret };
}
