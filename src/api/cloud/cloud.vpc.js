import request from '@/plugin/axios'

export function fuzzyQueryCloudVPCPage (data) {
  return request({
    url: '/cloud/vpc/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function queryCloudVPCPage (data) {
  return request({
    url: '/cloud/vpc/page/query',
    method: 'post',
    data
  })
}

export function syncCloudVPCByKey (cloudVPCKey) {
  return request({
    url: '/cloud/vpc/sync?key=' + cloudVPCKey,
    method: 'get'
  })
}

export function deleteCloudVPCById (id) {
  return request({
    url: '/cloud/vpc/del?id=' + id,
    method: 'delete'
  })
}

export function setCloudVPCActiveById (id) {
  return request({
    url: '/cloud/vpc/active/set?id=' + id,
    method: 'put'
  })
}

export function queryCloudVPCSecurityGroupPage (data) {
  return request({
    url: '/cloud/vpc/security/group/page/query',
    method: 'post',
    data
  })
}

export function setCloudVPCSecurityGroupActiveById (id) {
  return request({
    url: '/cloud/vpc/security/group/active/set?id=' + id,
    method: 'put'
  })
}

export function queryCloudVPCVSwitchPage (data) {
  return request({
    url: '/cloud/vpc/vswitch/page/query',
    method: 'post',
    data
  })
}

export function setCloudVPCVSwitchActiveById (id) {
  return request({
    url: '/cloud/vpc/vswitch/active/set?id=' + id,
    method: 'put'
  })
}
