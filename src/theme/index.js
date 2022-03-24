import { createTheme } from '@mui/material'
import { palette } from '@/theme/color'
import { components } from '@/theme/components'
import { shape } from '@/theme/shape'
import { typography } from '@/theme/typography'

// Pass an empty object first to deep merge with MUI's system defaults.
// https://github.com/mui/material-ui/blob/master/packages/mui-material/src/styles/createTheme.js#L24
export const theme = createTheme({}, {
  components,
  palette,
  shape,
  typography
})
