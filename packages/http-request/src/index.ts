import axios, { CreateAxiosDefaults } from 'axios';
export interface Options extends CreateAxiosDefaults {
  requestInterceptors: Function[];
  responseInterceptors: Function[];
}

export const defaultOptions = {
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
  requestInterceptors: [],
  responseInterceptors: [
    function (response: any) {
      const { status } = response;
      if (status === 200 || status === 201) {
        return response.data;
      } else {
        return Promise.reject(response);
      }
    },
    function (error: any) {
      if ((error.response || {}).status == 403) {
        // console.log(`error.response.status`, error.response.status)
        // 返回接口的真实数据而不是axioserror
        return { ...(error.response.data || {}), errorType: 'PERMISSION_ERROR' };
      }
      // 美一云返回全部都是200,除了未预判状况..
      return error;
    },
  ],
};
export class HttpRequest {
  token: String | null = null;
  create(options?: Partial<Options>) {
    const { ...config } = Object.assign(defaultOptions, options);
    const instance = axios.create(config);
    // requestInterceptors?.forEach((requestInterceptor) => {
    //   instance.interceptors.request.use(requestInterceptor);
    // });
    return instance;
  }
}
