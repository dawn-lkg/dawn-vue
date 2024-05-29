/*jshint esversion: 9 */
import { service } from './Request'
import qs from 'qs'

/** 公用接口 */
const allApi = {
  getCaptcha() {
    return service({
      url: '/captcha',
      method: 'get',
    })
  },
}

export default allApi
