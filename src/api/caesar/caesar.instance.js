import request from '@/plugin/axios'

const baseUrl = '/caesar/instance'

export function queryCaesarInstancePage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function delCaesarInstanceById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function setCaesarInstanceActiveById (id) {
  return request({
    url: baseUrl + '/active/set?id=' + id,
    method: 'get'
  })
}
