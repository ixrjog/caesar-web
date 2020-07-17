import request from '@/plugin/axios'

export function queryEnvPage (envName, envType, page, length) {
  return request({
    url: '/env/page/query?envName=' + envName + '&envType=' + envType + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function addEnv (data) {
  return request({
    url: '/env/add',
    method: 'post',
    data
  })
}

export function deleteEnvById (id) {
  return request({
    url: '/env/del?id=' + id,
    method: 'delete'
  })
}

export function updateEnv (data) {
  return request({
    url: '/env/update',
    method: 'put',
    data
  })
}
