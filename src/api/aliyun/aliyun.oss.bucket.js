import request from '@/plugin/axios'

const baseUrl = '/aliyun/oss/bucket'

export function queryBucketPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function updateBucket (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function syncBucket () {
  return request({
    url: baseUrl + '/sync',
    method: 'put'
  })
}

export function setBucketActiveById (id) {
  return request({
    url: baseUrl + '/active/set?id=' + id,
    method: 'put'
  })
}

export function delBucketById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
