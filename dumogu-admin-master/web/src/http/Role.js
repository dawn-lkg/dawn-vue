import { service } from './Request'

const allApi = {
  getDataPage(params) {
    return service({
      url: '/role/page',
      method: 'GET',
      params: params,
    })
  },
  getDataList(params) {
    return service({
      url: '/role/list',
      method: 'GET',
      params: params,
    })
  },
  updateData(form) {
    return service({
      url: '/role',
      method: 'PUT',
      data: form,
    })
  },
  saveData(form) {
    return service({
      url: '/role',
      method: 'POST',
      data: form,
    })
  },
  removeData(id) {
    return service({
      url: '/role/' + id,
      method: 'DELETE',
    })
  },
}

export default allApi
