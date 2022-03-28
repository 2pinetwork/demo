import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import Deposit from './Deposit'
import Withdraw from './Withdraw'

const VaultActions = ({ vault }) => (
  <Grid container spacing={3} sx={{ mt: 2 }}>
    <Grid item xs={12} sm={12} md={6}>
      <Deposit vault={vault} />
    </Grid>

    <Grid item xs={12} sm={12} md={6}>
      <Withdraw vault={vault} />
    </Grid>
  </Grid>
)

VaultActions.propTypes = {
  vault: PropTypes.object
}

export default VaultActions
