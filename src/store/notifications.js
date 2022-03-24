import { pushNotification } from './index'

export const notify = (group, message) => {
  return pushNotification({ type: 'info', id: Date.now(), group, message })
}

export const notifySuccess = (group, message) => {
  return pushNotification({ type: 'success', id: Date.now(), group, message })
}

export const notifyError = (group, message) => {
  return pushNotification({ type: 'error', id: Date.now(), group, message })
}
