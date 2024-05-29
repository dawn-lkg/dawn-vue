import { service } from './Request'

const allApi = {
  getDataList(params) {
    return service({
      url: '/weblink/list',
      method: 'GET',
      params: params,
    })
  },
  saveData(form) {
    return service({
      url: '/weblink',
      method: 'POST',
      data: form,
    })
  },
  updateData(form) {
    return service({
      url: '/weblink',
      method: 'PUT',
      data: form,
    })
  },
  removeData(id) {
    return service({
      url: '/weblink/' + id,
      method: 'DELETE',
    })
  },
}

export default allApi
