import PropTypes from 'prop-types'
import { Alert, Snackbar, Stack } from '@mui/material'
import { useStore, dropNotification } from '@/store'

export const Notifications = () => {
  const [ { notifications }, dispatch ] = useStore()

  // Just to follow Material Design guidelines, we do not stack
  if (notifications.length) {
    const { id, type, message } = notifications.pop()

    const onClose = (event, reason) => {
      if (! ['escapeKeyDown', 'clickaway'].includes(reason)) {
        dispatch(dropNotification(id))
      }
    }

    return (
      <Stack spacing={2}>
        <Notification key={id} type={type} message={message} onClose={onClose} />
      </Stack>
    )
  } else {
    return null
  }
}

export default Notifications

const Notification = ({ type, message, onClose }) => (
  <Snackbar open={true}
            key={message}
            onClose={onClose}
            autoHideDuration={10 * 60 * 1000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
    <Alert variant="filled" severity={type} onClose={onClose} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
)

Notification.propTypes = {
  type:    PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired
}
