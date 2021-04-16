import request from '@/plugin/axios'

const baseUrl = '/jenkins/pipeline'

export function queryPipelineNodeStepLog (data) {
  return request({
    url: baseUrl + '/node/step/log/query',
    method: 'post',
    data
  })
}

export function queryPipelineNodeSteps (data) {
  return request({
    url: baseUrl + '/node/steps/query',
    method: 'post',
    data
  })
}
