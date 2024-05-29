/*jshint esversion: 9 */
/**
 * http请求配置
 */
import axios from 'axios'
import Const from './Const'
import { userData as userDataStore } from '@/store/User'
import { messageSuccess, messageError, confirm } from '@/action/MessagePrompt'
import router from '@/router'
import { userData } from '@/store/User'

export const service = axios.create({
  //可创建多个 axios实例
  baseURL: Const.baseApiURL, //设置公共的请求前缀
  timeout: Const.timeout, //超时终止请求
})

service.interceptors.request.use(
  (config) => {
    const userData = userDataStore()
    config.headers = config.headers || {}
    config.headers['token'] = userData.userInfo.token
    return config
  },
  () => {
    return Promise.reject({
      msg: '请求发生错误，请稍后再试',
    })
  }
)

let modelShow = false
service.interceptors.response.use(
  (response) => {
    const data = response.data
    // console.log(data)
    if (!data) {
      return Promise.reject({
        msg: '请求发生错误',
      })
    }
    const code = data.code
    console.log(data)
    switch (code) {
      case 0:
        return data
      case 401: //表示需要重新登录
        if (!modelShow) {
          modelShow = true
          confirm('登录已经失效，是否重新登录？', '登录失效', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              userData().setUserInfo(null)
              router.push({
                path: '/login',
              })
            })
            .catch(() => {})
            .finally(() => {
              modelShow = false
            })
        }
        return Promise.reject(data)
      case 202: //表示失败，参数或其他原因
        return Promise.reject(data)
      case 500: //表示报错。未知原因
        return Promise.reject(data)
      default:
        return Promise.reject(data)
    }
  },
  () => {
    //数据请求发生错误
    return Promise.reject({
      msg: '请求发生错误，请稍后再试',
    })
  }
)
