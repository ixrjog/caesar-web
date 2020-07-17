import request from '@/plugin/axios'

export function queryAliyunRAMUserPage (data) {
  return request({
    url: '/aliyun/ram/user/page/query',
    method: 'post',
    data
  })
}

export function syncAliyunRAMUser () {
  return request({
    url: '/aliyun/ram/user/sync',
    method: 'get'
  })
}
