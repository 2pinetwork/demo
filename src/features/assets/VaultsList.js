import PropTypes from 'prop-types'
import { Alert, Box, Grid, Skeleton, Typography } from '@mui/material'
import Card from '@/components/Card'
import VaultActions from './VaultActions'
import VaultHeader from './VaultHeader'

const VaultsList = ({ vaults }) => {
  return (
    <Box component="div" sx={{ mb: 6 }}>
      { (vaults)
          ? vaults.map(v => <VaultRow key={v.identifier} vault={v} />)
          : [...Array(2)].map((_, i) => <VaultsRowSkeleton key={i} />)
      }
    </Box>
  )
}

VaultsList.propTypes = {
  vaults: PropTypes.arrayOf(PropTypes.object)
}

export default VaultsList

const vaultCardStyle = () => {
  return { backgroundColor: 'common.white', mb: 3 }
}

const vaultInfo = vault => {
  if (vault.infoLabel) {
    return (
      <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
        {vault.infoLabel}
      </Alert>
    )
  } else {
    return null
  }
}

const VaultRow = ({ vault }) => (
  <Card sx={vaultCardStyle()}>
    {vaultInfo(vault)}
    <VaultHeader vault={vault} />
    <VaultActions vault={vault} />
  </Card>
)

VaultRow.propTypes = {
  vault: PropTypes.object.isRequired
}

const VaultsRowSkeleton = () => (
  <Card sx={{ mb: 3 }}>
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
