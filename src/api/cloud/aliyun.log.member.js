import request from '@/plugin/axios'

export function queryAliyunLogMemberPage (data) {
  return request({
    url: '/aliyun/log/member/page/query',
    method: 'post',
    data
  })
}

export function queryLogMemberServerGroupPage (data) {
  return request({
    url: '/aliyun/log/member/server/group/query',
    method: 'post',
    data
  })
}

export function addAliyunLogMember (data) {
  return request({
    url: '/aliyun/log/member/add',
    method: 'post',
    data
  })
}

export function removeAliyunLogMemberById (id) {
  return request({
    url: '/aliyun/log/member/remove?id=' + id,
    method: 'delete'
  })
}

export function pushAliyunLogMemberById (id) {
  return request({
    url: '/aliyun/log/member/push?id=' + id,
    method: 'get'
  })
}
