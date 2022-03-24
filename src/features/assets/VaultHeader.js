import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { toCurrency, toNumber, toPercentage } from '@/lib/locales'
import { toHuman } from '@/lib/math'
import { capitalize } from '@/lib/string'
import Logo from './Logo'

const VaultHeader = ({ vault }) => {
  const { balance, deposited, protocol, token, apy, tvl } = vault

  return (
    <Grid container spacing={1}>
      <Grid item xs>
        <Logo name={token} alt={token.toUpperCase()} />
      </Grid>

      <Grid item xs>
        <Typography component="div" variant="body1" align="center" sx={{ fontWeight: 'bold' }}>
          {toPercentage(apy)}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="grey.400">
          Earn {token.toUpperCase()}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="grey.400">
          Uses {capitalize(protocol || 'auto')}
        </Typography>
      </Grid>

      <Grid item xs>
        <Typography component="div" align="center" variant="body2" color="grey.400">
          ${balance ? toNumber(toHuman(balance, vault.tokenDecimals), { precision: 2 }) : '-'}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="primary.main">
          {balance ? toNumber(toHuman(balance, vault.tokenDecimals), { precision: 4 }) : '-'}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="grey.400">
          Balance
        </Typography>
      </Grid>

      <Grid item xs>
        <Typography component="div" align="center" variant="body2" color="grey.400">
          ${deposited ? toNumber(toHuman(deposited, vault.decimals), { precision: 2 }) : '-'}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="primary.main">
          {deposited ? toNumber(toHuman(deposited, vault.decimals), { precision: 4 }) : '-'}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="grey.400">
          Deposited
        </Typography>
      </Grid>

      <Grid item xs>
        <Typography component="div" align="center" variant="body1" sx={{ fontWeight: 'bold' }}>
          {toPercentage(apy)}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="grey.400">
          APY
        </Typography>
      </Grid>

      <Grid item xs>
        <Typography component="div" align="center" variant="body1" sx={{ fontWeight: 'bold' }}>
          {toPercentage(apy / 365, { precision: 3 })}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="grey.400">
          Daily
        </Typography>
      </Grid>

      <Grid item xs>
        <Typography component="div" align="center" variant="body1" sx={{ fontWeight: 'bold' }}>
          {toCurrency(tvl)}
        </Typography>
        <Typography component="div" variant="body2" align="center" color="grey.400">
          TA
        </Typography>
      </Grid>
    </Grid>
  )
}

VaultHeader.propTypes = {
  vault: PropTypes.object
}

export default VaultHeader
