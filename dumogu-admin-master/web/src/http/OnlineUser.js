import { service } from './Request'

const allApi = {
  getDataList(params) {
    return service({
      url: '/monitor/online/list',
      method: 'GET',
      params: params,
    })
  },
  offline(data) {
    return service({
      url: '/monitor/online/offline',
      method: 'POST',
      data: data,
    })
  },
}

export default allApi
