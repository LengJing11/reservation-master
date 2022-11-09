// axios: 二次封装AJAX请求
import axios from 'axios';
import { Message } from 'element-ui';
import config from '../config';

const baseUrl = process.env.NODE_ENV === 'development'
  ? config.baseUrl.dev : config.baseUrl.prop;

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // 获取基本的配置
  getConfig() {
    return {
      baseURL: this.baseUrl,
      header: {},
    };
  }

  // 拦截器
  interceptors(instance) {
    // 添加请求拦截器
    instance.interceptors.request.use((config) => config,
      (error) => {
        // 对请求错误做些什么
        Message.error('数据请求失败......');
        return Promise.reject(error.message);
      });

    // 添加响应拦截器
    instance.interceptors.response.use((response) => response.data,
      (error) => {
        Message.error('服务期未响应......');
        return Promise.reject(error.message);
      });
  }

  sendRequest(options) {
    const instance = axios.create();

    options = { ...(this.getConfig()), ...options };

    this.interceptors(instance);

    return instance(options); // 返回promise对象
  }
}

export default new HttpRequest(baseUrl);
