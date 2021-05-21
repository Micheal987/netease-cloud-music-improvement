import axios from 'axios'
import {
  Message,
  Loading
} from 'element-ui'
// 默认请求baseurl
const ConfigBaseURL = 'http://localhost:3000'

let loadingInstance = null //这里是loading
//使用create方法创建axios实例
export const Service = axios.create({
  timeout: 10000, // 请求超时时间
  baseURL: ConfigBaseURL,
  method: 'get', // 默认请求方式
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
// 添加请求拦截器
Service.interceptors.request.use(config => {
  loadingInstance = Loading.service({
    lock: true,
    text: "拼命加载中",
    spinner: "el-icon-loading",
    background: 'transparent',

  })
  return config
})
// 添加响应拦截器
Service.interceptors.response.use(response => {
  // 关闭等待动画效果
  loadingInstance.close()
  // console.log(response)
  // 返回响应数据
  return response.data
}, error => {
  // 打印错误信息
  console.log('TCL: error', error)
  const msg = error.Message !== undefined ? error.Message : ''
  Message({
    message: '网络错误' + msg,
    type: 'error',
    duration: 3 * 1000
  })
  // 关闭等待动画效果 并且返回错误信息
  loadingInstance.close()
  return Promise.reject(error)
})