import request from '@/plugin/axios'

export function queryAliyunRAMPolicyPage (data) {
  return request({
    url: '/aliyun/ram/policy/page/query',
    method: 'post',
    data
  })
}

export function syncAliyunRAMPolicy () {
  return request({
    url: '/aliyun/ram/policy/sync',
    method: 'get'
  })
}

export function setAliyunRAMPolicyWorkorderById (id) {
  return request({
    url: '/aliyun/ram/policy/workorder/set?id=' + id,
    method: 'put'
  })
}
