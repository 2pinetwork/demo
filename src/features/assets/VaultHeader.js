import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { toNumber, toPercentage } from '@/lib/locales'
import { toHuman } from '@/lib/math'
import { capitalize } from '@/lib/string'
import Logo from './Logo'

const VaultHeader = ({ vault }) => {
  const { balance, deposited, protocol, token, apy } = vault

  return (
    <Grid container columnSpacing={1} rowSpacing={{ xs: 4, md: 1 }}>
      <Grid item xs={6} md>
        <Logo name={token} alt={token.toUpperCase()} />
      </Grid>

      <Grid item xs={6} md>
        <Typography component="div" variant="body1" sx={{ fontWeight: 'bold', textAlign: { xs: 'left', md: 'center' } }}>
          {toPercentage(apy)}
        </Typography>
        <Typography component="div" variant="body2" color="grey.400" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          Earn {token.toUpperCase()}
        </Typography>
        <Typography component="div" variant="body2" color="grey.400" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          Uses {capitalize(protocol || 'auto')}
        </Typography>
      </Grid>

      <Grid item xs={6} md>
        <Typography component="div" variant="body2" color="grey.400" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          ${balance ? toNumber(toHuman(balance, vault.tokenDecimals), { precision: 2 }) : '-'}
        </Typography>
        <Typography component="div" variant="body2" color="primary.main" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          {balance ? toNumber(toHuman(balance, vault.tokenDecimals), { precision: 6 }) : '-'}
        </Typography>
        <Typography component="div" variant="body2" color="grey.400" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          Balance
        </Typography>
      </Grid>

      <Grid item xs={6} md>
        <Typography component="div" variant="body2" color="grey.400" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          ${deposited ? toNumber(toHuman(deposited, vault.decimals), { precision: 2 }) : '-'}
        </Typography>
        <Typography component="div" variant="body2" color="primary.main" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          {deposited ? toNumber(toHuman(deposited, vault.decimals), { precision: 6 }) : '-'}
        </Typography>
        <Typography component="div" variant="body2" color="grey.400" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          Deposited
        </Typography>
      </Grid>

      <Grid item xs={6} md>
        <Typography component="div" variant="body1" sx={{ fontWeight: 'bold', textAlign: { xs: 'left', md: 'center' } }}>
          {toPercentage(apy)}
        </Typography>
        <Typography component="div" variant="body2" color="grey.400" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          APY
        </Typography>
      </Grid>

      <Grid item xs={6} md>
        <Typography component="div" variant="body1" sx={{ fontWeight: 'bold', textAlign: { xs: 'left', md: 'center' } }}>
          {toPercentage(apy / 365, { precision: 3 })}
        </Typography>
        <Typography component="div" variant="body2" color="grey.400" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          Daily
        </Typography>
      </Grid>
    </Grid>
  )
}

VaultHeader.propTypes = {
  vault: PropTypes.object
}

export default VaultHeader
