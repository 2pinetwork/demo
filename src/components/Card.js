import PropTypes from 'prop-types'
import { Box } from '@mui/material'

const defaultStyles = ({ palette: { primary } }) => ({
  py:           4,
  px:           5,
  border:       `1px solid ${primary[240]}`,
  borderRadius: 2
})

const Card = ({ sx: styles, ...props }) => (
  <Box sx={[ defaultStyles, styles ]} {...props} />
)

Card.propTypes = {
  sx: PropTypes.object
}

export default Card
