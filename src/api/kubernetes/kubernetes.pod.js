import request from '@/plugin/axios'

const baseUrl = '/kubernetes/pod'

export function queryMyKubernetesPod (data) {
  return request({
    url: baseUrl + '/query',
    method: 'post',
    data
  })
}
