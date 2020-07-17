import request from '@/plugin/axios'

export function fuzzyQueryCloudInstanceTemplatePage (data) {
  return request({
    url: '/cloud/instance/template/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function fuzzyQueryCloudInstanceTypePage (data) {
  return request({
    url: '/cloud/instance/type/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function syncCloudInstanceTypeByType (cloudType) {
  return request({
    url: '/cloud/instance/type/sync?cloudType=' + cloudType,
    method: 'get'
  })
}

export function queryCloudRegionList (cloudType) {
  return request({
    url: '/cloud/instance/region/query?cloudType=' + cloudType,
    method: 'get'
  })
}

export function queryCloudCpuList (cloudType) {
  return request({
    url: '/cloud/instance/cpu/query?cloudType=' + cloudType,
    method: 'get'
  })
}

export function saveCloudInstanceTemplate (data) {
  return request({
    url: '/cloud/instance/template/save',
    method: 'post',
    data
  })
}

export function saveCloudInstanceTemplateYAML (data) {
  return request({
    url: '/cloud/instance/template/yaml/save',
    method: 'post',
    data
  })
}

export function deleteCloudInstanceTemplateById (id) {
  return request({
    url: '/cloud/instance/template/del?id=' + id,
    method: 'delete'
  })
}

export function queryCloudInstanceTemplateVSwitch (templateId, zoneId) {
  return request({
    url: '/cloud/instance/template/vswitch/query?templateId=' + templateId + '&zoneId=' + zoneId,
    method: 'get'
  })
}

export function createCloudInstance (data) {
  return request({
    url: '/cloud/instance/create',
    method: 'post',
    data
  })
}

export function queryCloudInstanceTaskById (id) {
  return request({
    url: '/cloud/instance/task/query?id=' + id,
    method: 'get'
  })
}

export function queryLastCloudInstanceTaskByTemplateId (templateId) {
  return request({
    url: '/cloud/instance/task/last/query?templateId=' + templateId,
    method: 'get'
  })
}
