import { service } from './Request'

const allApi = {
  getSystemInfo() {
    return service({
      url: '/monitor/server',
      method: 'GET',
    })
  },
}

export default allApi
