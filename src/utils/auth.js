import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getUsername() {
    return Cookies.get('username')
}

export function setUsername(username) {
    return Cookies.set('username', username)
}

export function removeUsername() {
    return Cookies.remove('username')
}

export function getUid() {
    return Cookies.get('uid')
}

export function setUid(uid) {
    return Cookies.set('uid', uid)
}

export function removeUid() {
    return Cookies.remove('uid')
}
