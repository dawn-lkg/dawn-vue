import { service } from './Request'

const allApi = {
  getDataList(params) {
    return service({
      url: '/todo/list',
      method: 'GET',
      params: params,
    })
  },
  updateData(form) {
    return service({
      url: '/todo',
      method: 'PUT',
      data: form,
    })
  },
  saveData(form) {
    return service({
      url: '/todo',
      method: 'POST',
      data: form,
    })
  },
  removeData(id) {
    return service({
      url: '/todo/' + id,
      method: 'DELETE',
    })
  },
}

export default allApi
