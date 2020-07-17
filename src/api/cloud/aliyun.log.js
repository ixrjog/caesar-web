import request from '@/plugin/axios'

export function queryAliyunLogPage (data) {
  return request({
    url: '/aliyun/log/page/query',
    method: 'post',
    data
  })
}

export function updateAliyunLog (data) {
  return request({
    url: '/aliyun/log/update',
    method: 'put',
    data
  })
}

export function addAliyunLog (data) {
  return request({
    url: '/aliyun/log/add',
    method: 'post',
    data
  })
}

export function queryProject (data) {
  return request({
    url: '/aliyun/log/project/query',
    method: 'post',
    data
  })
}

export function queryLogstore (data) {
  return request({
    url: '/aliyun/log/logstore/query',
    method: 'post',
    data
  })
}

export function queryConfig (data) {
  return request({
    url: '/aliyun/log/config/query',
    method: 'post',
    data
  })
}

export function pushAliyunLogById (id) {
  return request({
    url: '/aliyun/log/push?id=' + id,
    method: 'get'
  })
}
