import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'

export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}

export function setUserId(userId: string) {
  return ss.set('userId', userId)
}

export function getUserId() {
  return ss.get('userId')
}

export function removeUserId() {
  return ss.remove('userId')
}
