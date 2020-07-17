import request from '@/plugin/axios'

export function queryDocByKey (key) {
  return request({
    url: '/doc/key/query?key=' + key,
    method: 'get'
  })
}

export function queryDocById (id) {
  return request({
    url: '/doc/id/query?id=' + id,
    method: 'get'
  })
}

export function queryUserDocByType (docType) {
  return request({
    url: '/doc/user/type/query?docType=' + docType,
    method: 'get'
  })
}

export function saveUserDoc (data) {
  return request({
    url: '/doc/user/save',
    method: 'put',
    data
  })
}
