import { experimental_sx as sx } from '@mui/system'

const MuiOutlinedInput = {
  styleOverrides: {
    root: sx({
      py:              1.5,
      px:              2,
      backgroundColor: 'common.white',
      borderRadius:    1
    }),

    notchedOutline: sx({
      borderColor:     'grey.300',
    })
  }
}

export default MuiOutlinedInput
