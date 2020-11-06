import request from '@/plugin/axios'

const baseUrl = '/dashboard'

export function queryTopCard () {
  return request({
    url: baseUrl + '/top/card/query',
    method: 'get'
  })
}

export function queryLatestTasks () {
  return request({
    url: baseUrl + '/latest/tasks/query',
    method: 'get'
  })
}
