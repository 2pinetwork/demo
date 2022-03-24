import PropTypes from 'prop-types'
import Image from 'next/image'
import { Box } from '@mui/material'

const styles = {
  display: 'inline-block',
  mr:      2,
  '& > *': { display: 'block !important' }
}

const Logo = ({ name, alt }) => (
  <Box sx={styles}>
    <Image src={`/images/logos/${name}.svg`} alt={alt} width="56" height="56" unoptimized />
  </Box>
)

Logo.propTypes = {
  name: PropTypes.string.isRequired,
  alt:  PropTypes.string
}

export default Logo
