import request from '@/utils/request'

export function getBookList(params) {
  return request({
    url: '/api/book/find',
    method: 'get',
    params
  });
}

export function removeBook(params) {
  return request({
    url: '/api/book/remove',
    method: 'post',
    data: params
  });
}