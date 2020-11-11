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

export function queryTaskExecutionGroupByHour () {
  return request({
    url: baseUrl + '/task/execution/by/hour/query',
    method: 'get'
  })
}

export function queryJobTypeStatistics () {
  return request({
    url: baseUrl + '/job/type/query',
    method: 'get'
  })
}

export function queryTaskExecutionGroupByWeek () {
  return request({
    url: baseUrl + '/task/execution/by/week/query',
    method: 'get'
  })
}

export function queryHotTopStatistics () {
  return request({
    url: baseUrl + '/hot/top/query',
    method: 'get'
  })
}
