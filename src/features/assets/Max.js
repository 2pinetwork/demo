import PropTypes from 'prop-types'
import { InputAdornment, Typography } from '@mui/material'
import { Link } from '@/components'

const Max = ({ onClick }) => (
  <InputAdornment position="end">
    <Typography component="span" variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
      <Link href="#" underline="none" onClick={onClick}>
        Max
      </Link>
    </Typography>
  </InputAdornment>
)

Max.propTypes = {
  onClick: PropTypes.func
}

export default Max
