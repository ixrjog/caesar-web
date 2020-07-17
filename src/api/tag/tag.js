import request from '@/plugin/axios'

export function queryTagPage (tagKey, page, length) {
  return request({
    url: '/tag/page/query?tagKey=' + tagKey + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function addTag (data) {
  return request({
    url: '/tag/add',
    method: 'post',
    data
  })
}

export function deleteTagById (id) {
  return request({
    url: '/tag/del?id=' + id,
    method: 'delete'
  })
}

export function updateTag (data) {
  return request({
    url: '/tag/update',
    method: 'put',
    data
  })
}

export function updateTagBusiness (data) {
  return request({
    url: '/tag/business/update',
    method: 'put',
    data
  })
}

export function queryBusinessTag (businessType, businessId, tagKey) {
  return request({
    url: '/tag/business/query?businessType=' + businessType + '&businessId=' + businessId + '&tagKey=' + tagKey,
    method: 'get'
  })
}

export function queryNotInBusinessTag (businessType, businessId, tagKey) {
  return request({
    url: '/tag/business/notin/query?businessType=' + businessType + '&businessId=' + businessId + '&tagKey=' + tagKey,
    method: 'get'
  })
}
