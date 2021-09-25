import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/monitor/operLog/list',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperlog(id) {
  return request({
    url: '/monitor/operLog/' + id,
    method: 'delete'
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/monitor/operLog/clean',
    method: 'delete'
  })
}

// 导出操作日志
export function exportOperlog(query) {
  return request({
    url: '/monitor/operLog/export',
    method: 'get',
    params: query
  })
}
