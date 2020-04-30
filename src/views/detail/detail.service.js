import request from '@/utils/request'

// 获取图书详情
export function getBookDetail(params) {
  return request({
    url: '/api/book/detail',
    method: 'get',
    params
  });
}

// 获取主题详情
export function getThemeDetail() {
  return request({
    url: '/api/theme/find',
    method: 'get',
  });
}

// 更新主题
export function updateTheme(params) {
  return request({
    url: '/api/theme/update',
    method: 'post',
    data: params
  });
}

// 获取笔记列表
export function getNote(params) {
  return request({
    url: '/api/note/find',
    method: 'get',
    params
  });
}

// 添加笔记
export function createNote(params) {
  return request({
    url: '/api/note/create',
    method: 'post',
    data: params
  });
}

// 修改笔记
export function updateNote(params) {
  return request({
    url: '/api/note/update',
    method: 'post',
    data: params
  });
}

// 删除笔记
export function removeNote(params) {
  return request({
    url: '/api/note/remove',
    method: 'post',
    data: params
  });
}
