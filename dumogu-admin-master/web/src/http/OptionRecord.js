import { service } from './Request'

/** 公用接口 */
const allApi = {
  getOptionDataPage(param) {
    return service({
      url: '/operation-record/page',
      method: 'get',
      params: param,
    })
  },
  getLoginDataPage(param) {
    return service({
      url: '/operation-record/loginOperator/page',
      method: 'get',
      params: param,
    })
  },
}

export default allApi
