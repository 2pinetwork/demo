import PropTypes from 'prop-types'
import { Box, Grid, Skeleton, Typography } from '@mui/material'
import Card from '@/components/Card'
import VaultActions from './VaultActions'
import VaultHeader from './VaultHeader'

const VaultsList = ({ vaults }) => {
  return (
    <Box component="div">
      { (vaults)
          ? vaults.map(v => <VaultRow key={v.identifier} vault={v} />)
          : [...Array(1)].map((_, i) => <VaultsRowSkeleton key={i} />)
      }
    </Box>
  )
}

VaultsList.propTypes = {
  vaults: PropTypes.arrayOf(PropTypes.object)
}

export default VaultsList

const VaultRow = ({ vault }) => (
  <Card sx={{ backgroundColor: 'common.white' }}>
    <VaultHeader vault={vault} />
    <VaultActions vault={vault} />
  </Card>
)

VaultRow.propTypes = {
  vault: PropTypes.object.isRequired
}

const VaultsRowSkeleton = () => (
  <Card>
    <Grid container spacing={1}>
      <Grid item xs>
        <Typography><Skeleton /></Typography>
      </Grid>
      <Grid item xs>
        <Typography><Skeleton /></Typography>
      </Grid>
      <Grid item xs>
        <Typography><Skeleton /></Typography>
      </Grid>
      <Grid item xs>
        <Typography><Skeleton /></Typography>
      </Grid>
      <Grid item xs>
        <Typography><Skeleton /></Typography>
      </Grid>
      <Grid item xs>
        <Typography><Skeleton /></Typography>
      </Grid>
    </Grid>

    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs>
        <Typography><Skeleton /></Typography>
      </Grid>
      <Grid item xs>
        <Typography><Skeleton /></Typography>
      </Grid>
    </Grid>
  </Card>
)
