import request from '@/plugin/axios'

const baseUrl = '/jenkins/pipeline'

export function queryPipelineNodeStepLog (data) {
  return request({
    url: baseUrl + '/node/step/log/query',
    method: 'post',
    data
  })
}
