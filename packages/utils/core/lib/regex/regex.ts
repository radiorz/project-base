// 电话号码
export const phone = /^(?:(?:\+|00)86)?1\d{10}$/;
// 自然数（0 1...
export const nativeNumber = /^[0-9]*$/;
// 字母和数字
export const onlyLettersAndNumbers = /^[a-zA-Z0-9]*$/;
// 密码 至少八个字符，至少一个字母和一个数字
export const password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
