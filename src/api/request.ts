import axios, { AxiosInstance, AxiosResponse } from "axios";

axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;

const instance: AxiosInstance = axios.create({
  timeout: 30_000,
  headers: { "Content-Type": "application/json; charset=UTF-8" },
});

interface Response<T = undefined> {
  err_no: number;
  err_msg: string;
  data: T;
}

const request = <T = undefined>(
  url: string,
  options: {
    method?: any;
    data?: any;
    header?: {};
    params?: {};
  },
): Promise<Response<T>> => {
  // 预处理请求头
  options.header = {
    // 默认使用 application/json
    ...{ "Content-Type": "application/json; charset=UTF-8" },
    ...options.header,
  };
  // 预处理请求行
  options.params = {
    // 默认加上参数 _ts
    ...{ _ts: new Date().getTime() },
    ...options.params,
  };

  return instance
    .request<Response<T>>({
      url: url,
      method: options.method,
      data: options.data,
      params: options.params,
      headers: options.header,
      timeout: 30_000, // 30 秒超时
    })
    .then((res: AxiosResponse) => res.data as Response<T>);
};

const post = <T = undefined>(url: string, body?: any, params?: any, headers?: {}): Promise<Response<T>> => {
  return request(url, {
    method: POST,
    data: body,
    header: headers,
    params: params,
  });
};

const put = <T = undefined>(url: string, body?: any, headers?: {}): Promise<Response<T>> => {
  return request(url, {
    method: PUT,
    data: body,
    header: headers,
    params: {},
  });
};

const get = <T = undefined>(url: string, params?: {}, headers?: {}): Promise<Response<T>> => {
  return request(url, {
    method: GET,
    data: {},
    header: headers,
    params: params,
  });
};

const GET = "GET";
const PUT = "PUT";
const POST = "POST";

export { post, put, get, request, GET, PUT, POST, type Response };
