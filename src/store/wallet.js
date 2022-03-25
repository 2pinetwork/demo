import { createSession, destroySession } from '@/data/wallet'
import { connecting, connection, dropNotificationGroup } from './index'
import { notifyError } from './notifications'

export const connectAsync = () => {
  return async dispatch => {
    dispatch(dropNotificationGroup('wallet'))
    dispatch(connecting())

    try {
      const wallet = await createSession(dispatch)
      dispatch(connection(wallet))

    } catch (error) {
      dispatch(notifyError('wallet', 'Your wallet couldn’t be connected'))
    }
  }
}

export const disconnectAsync = () => {
  return async dispatch => {
    dispatch(dropNotificationGroup('wallet'))
    dispatch(connecting())

    try {
      const wallet = await destroySession()
      dispatch(connection(wallet))

    } catch (error) {
      dispatch(notifyError('wallet', 'Your wallet couldn’t be disconnected'))
    }
  }
}
