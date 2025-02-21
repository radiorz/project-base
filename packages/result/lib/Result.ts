export interface Result {
  module: string; // 模块
  thing: string; // 事项
  work: string, // 具体事情
  status: 'success' | 'fail',
}

export function getToken(result: Result) {
  return `${result.module}.${result.thing}.${result.work}.${result.status}`
}

export function getLocaleString1(result: Result, localeConfig: Record<string, any>) {
  const token = getToken(result)
  const locale = localeConfig[token]
  return locale
}

export function getHTTPResponseJSON(result: Result, localeConfig: Record<string, any>) {
  const token = getToken(result)
  const message = getLocaleString1(result, localeConfig)
  return {
    code: 0,
    token,
    message
  }
}

// 自动切换locale
class Locale {
  private currentLocale: string;
  private localeConfigs: Map<string, Record<string, any>>;

  constructor() {
    this.currentLocale = 'zh-CN';
    this.localeConfigs = new Map();
  }

  setLocale(locale: string) {
    if (!this.localeConfigs.has(locale)) {
      throw new Error(`Locale ${locale} not registered`);
    }
    this.currentLocale = locale;
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  registerLocaleConfig(locale: string, config: Record<string, any>) {
    this.localeConfigs.set(locale, config);
  }

  getLocaleConfig(): Record<string, any> {
    const config = this.localeConfigs.get(this.currentLocale);
    if (!config) {
      throw new Error(`Locale config not found for ${this.currentLocale}`);
    }
    return config;
  }

  translate(token: string): string {
    const config = this.getLocaleConfig();
    const translation = config[token];
    if (!translation) {
      return token;
    }
    return translation;
  }
}

// 修改 getLocaleString 函数
export function getLocaleString(result: Result, locale?: Locale) {
  const token = getToken(result);
  if (!locale) {
    throw new Error('Locale instance is required');
  }
  return locale.translate(token);
}

// 示例
function createUser() {
  const result: Result = {
    module: "",
    thing: "",
    work: "",
    status: "fail"
  }
  throw new Error(getToken(result))
}

createUser()

// 配置语言
const zhConfig = {
  'user.login.submit.success': '登录成功',
  'user.login.submit.fail': '登录失败',
  // ... 其他配置
};

const enConfig = {
  'user.login.submit.success': 'Login successful',
  'user.login.submit.fail': 'Login failed',
  // ... 其他配置
};
const locale = new Locale();
locale.registerLocaleConfig('zh-CN', zhConfig);
locale.registerLocaleConfig('en-US', enConfig);
const result: Result = {
  module: "user",
  thing: "login",
  work: "submit",
  status: "success"
}
// 默认使用中文
console.log(getLocaleString(result)); // 输出：登录成功

// 切换到英文
locale.setLocale('en-US');
console.log(getLocaleString(result)); // 输出：Login successful
