import request from '@/utils/request'

export function getCaptcha() {
  return request({
    url: '/api/getCaptcha',
    method: 'get',
    noToken: false
  });
}

export function login(params) {
  return request({
    url: '/api/login',
    method: 'post',
    data: params
  });
}