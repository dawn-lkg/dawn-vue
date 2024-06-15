import { service } from './Request'

const allApi = {
  getNovelList() {
    return service({
      url: '/novel/list',
      method: 'GET',
    })
  },
  getChaptersList(novelId) {
    return service({
      url: '/novelChapter/list',
      method: 'GET',
      params: {
        novelId: novelId,
      },
    })
  },
  getChapterContent(chapterId) {
    return service({
      url: '/novelChapter/content/' + chapterId,
      method: 'GET',
    })
  },
  getNextChapterContent(params) {
    return service({
      url: '/novelChapter/next',
      method: 'GET',
      params: params,
    })
  },
  getPreviousChapterContent(params) {
    return service({
      url: '/novelChapter/previous',
      method: 'GET',
      params: params,
    })
  },
}

export default allApi
