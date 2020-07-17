import request from '@/plugin/axios'

/**
 * 模糊查询
 * @param data
 * @returns {AxiosPromise}
 */
export function fuzzyQueryAssetPage (data) {
  return request({
    url: '/jump/jumpserver/asset/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function syncAsset () {
  return request({
    url: '/jump/jumpserver/asset/sync',
    method: 'get'
  })
}

export function delAssetByAssetId (assetId) {
  return request({
    url: '/jump/jumpserver/asset/del?assetId=' + assetId,
    method: 'delete'
  })
}

export function queryAssetsNodePage (value, page, length) {
  return request({
    url: '/jump/jumpserver/assetsNode/page/query?value=' + value + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}
