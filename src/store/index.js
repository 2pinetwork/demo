import PropTypes from 'prop-types'
import { createContext, useContext, useReducer, useMemo } from 'react'



// -- CONTEXT --

const Context = createContext()

export const useStore = () => {
  return useContext(Context)
}

// Allow passing an optional state to mock tests.
export const Provider = ({ state, children }) => {
  const [ currentState, dispatch ] = useReducer(reducer, state || initialState)

  const value = useMemo(() => {
    // Allow passing functions to dispatch as delegated operations (thunks)
    const dispatchThunk = action => {
      return (typeof action === 'function')
        ? action(dispatchThunk)
        : dispatch(action)
    }

    return [ currentState, dispatchThunk ]
  }, [ currentState, dispatch ])

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

Provider.propTypes = {
  state:    PropTypes.object,
  children: PropTypes.node
}



// -- STATE --

export const initialState = {
  wallet:        undefined,
  isConnecting:  false,
  notifications: []
}



// -- REDUCER --

export const reducer = (state, action) => {
  switch (action?.type) {
    case 'CONNECTING': {
      return { ...state, isConnecting: true }
    }

    case 'CONNECTION': {
      return { ...state, wallet: action.payload, isConnecting: false }
    }

    case 'PUSH_NOTIFICATION': {
      const notifications = state.notifications.concat([ action.payload ])

      return { ...state, notifications }
    }

    case 'DROP_NOTIFICATION': {
      const filter        = n => (n.id !== action.payload)
      const notifications = state.notifications.filter(filter)

      return { ...state, notifications }
    }

    case 'DROP_NOTIFICATION_GROUP': {
      const filter        = n => (n.group !== action.payload)
      const notifications = state.notifications.filter(filter)

      return { ...state, notifications }
    }

    default: {
      console.error('UNKNOWN ACTION', action)

      throw new RangeError('Unknown action')
    }
  }
}



// -- ACTIONS --

export const connecting = () => {
  return { type: 'CONNECTING' }
}

export const connection = wallet => {
  return { type: 'CONNECTION', payload: wallet }
}

export const pushNotification = notification => {
  return { type: 'PUSH_NOTIFICATION', payload: notification }
}

export const dropNotification = id => {
  return { type: 'DROP_NOTIFICATION', payload: id }
}

export const dropNotificationGroup = group => {
  return { type: 'DROP_NOTIFICATION_GROUP', payload: group }
}
