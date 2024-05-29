import { service } from './Request'

const allApi = {
  getDataList(params) {
    return service({
      url: '/menu/list',
      params: params,
    })
  },
  updateData(form) {
    return service({
      url: '/menu',
      method: 'PUT',
      data: form,
    })
  },
  saveData(form) {
    return service({
      url: '/menu',
      method: 'POST',
      data: form,
    })
  },
  removeData(id) {
    return service({
      url: '/menu/' + id,
      method: 'DELETE',
    })
  },
}

export default allApi
