import { experimental_sx as sx } from '@mui/system'

const MuiButton = {
  styleOverrides: {
    root: sx({
      py:           2,
      px:           4,
      borderRadius: 6
    }),

    sizeSmall: sx({
      py: 1.5,
      px: 3,
    }),

    outlined: sx({
      border:     '2px solid !important',
      '&:hover':  { backgroundColor: 'primary.40' },
      '&:active': { backgroundColor: 'primary.40' }
    })
  }
}

export default MuiButton
