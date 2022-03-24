import PropTypes from 'prop-types'
import { Fragment } from 'react'
import { Typography } from '@mui/material'
import VaultsList from './VaultsList'

const Vaults = ({ vaults }) => {
  return (
    <Fragment>
      <Typography variant="h5" sx={{ mb: 3 }}>Vaults</Typography>

      <VaultsList vaults={vaults} />
    </Fragment>
  )
}

Vaults.propTypes = {
  vaults: PropTypes.arrayOf(PropTypes.object)
}

export default Vaults
