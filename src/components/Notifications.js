import PropTypes from 'prop-types'
import { useState } from 'react'
import { Alert, Snackbar, Stack } from '@mui/material'
import { useStore, dropNotification } from '@/store'

export const Notifications = () => {
  const [ { notifications }, dispatch ] = useStore()
  const [ open, setOpen ]               = useState(true)

  // Just to follow Material Design guidelines, we do not stack
  if (notifications.length) {
    const { id, type, message } = notifications[notifications.length - 1]

    const onClose = (event, reason) => {
      if (! ['escapeKeyDown', 'clickaway'].includes(reason)) {
        setOpen(false)

        setTimeout(() => {
          dispatch(dropNotification(id))
          setOpen(true)
        }, 1000)
      }
    }

    return (
      <Stack spacing={2}>
        <Notification key={id} open={open} type={type} message={message} onClose={onClose} />
      </Stack>
    )
  } else {
    return null
  }
}

export default Notifications

const Notification = ({ type, open, message, onClose }) => (
  <Snackbar open={open}
            key={message}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
    <Alert variant="filled" severity={type} onClose={onClose} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
)

Notification.propTypes = {
  type:    PropTypes.string.isRequired,
  open:    PropTypes.bool.isRequired,
  message: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired
}
