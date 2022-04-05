import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Contract } from 'ethers'
import archimedesAbi from '@/data/abis/archimedes'
import { toNumber } from '@/lib/locales'
import { toBigNumber, toHuman, toNative } from '@/lib/math'
import { onUpdate } from '@/features/assets/utils/vaults'
import { dropNotificationGroup, useStore } from '@/store'
import { txSent, txSuccess, txError } from '@/utils/transactions'
import { validateWithdraw } from '@/utils/validations'
import { suggestedGasPrice } from '@/utils/gas'
import Max from './Max'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography
} from '@mui/material'

const Withdraw = ({ vault }) => {
  const [ { wallet }, dispatch ]    = useStore()
  const [ value, setValue ]         = useState('')
  const [ error, setError ]         = useState()
  const [ isPending, setIsPending ] = useState(false)
  const [ useMax, setUseMax ]       = useState(false)
  const { deposited }               = vault

  const isDisabled = isPending || typeof vault.withdraw !== 'function'

  const buttonLabel = (isPending)
    ? 'Withdrawing...'
    : 'Withdraw'

  const onSubmit = async () => {
    const chainId = vault.chainId
    const amount  = await nativeAmount(vault, value)
    const error   = validateWithdraw(vault, amount)

    // Update the displayed error message and abort if there's an error
    setError(error)
    if (error) return

    setIsPending(true)

    try {
      const transaction = await withdraw(wallet, vault, value, useMax)

      setValue('')
      setUseMax(false)
      setIsPending(false)
      dispatch(dropNotificationGroup('withdraws'))
      dispatch(withdrawSent(chainId, transaction.hash))

      const receipt = await transaction.wait()

      dispatch(dropNotificationGroup('withdraws'))
      dispatch(withdrawSuccess(chainId, receipt.transactionHash))
      // Since TwoPi lib refresh data every 2 seconds:
      setTimeout(() => { onUpdate(wallet, dispatch) }, 3 * 1000)
    } catch (error) {
      setIsPending(false)
      dispatch(dropNotificationGroup('withdraws'))
      dispatch(withdrawError(chainId, error))
    }
  }

  const onMax = event => {
    event.preventDefault()

    setValue(
      toNumber(toHuman(deposited, vault.decimals), { precision: vault.decimals.toNumber() })
    )

    setUseMax(true)
  }

  const onChange = ({ target }) => {
    setValue(target.value)
    setUseMax(false)
  }

  return (
    <React.Fragment>
      <Typography component="div" variant="body1" color="grey.400">
        Deposited ({deposited ? toNumber(toHuman(deposited, vault.decimals), { precision: 6 }) : '-'} {vault.token.toUpperCase()})
      </Typography>

      <Box component="div" sx={{ mt: 2 }}>
        <FormControl error={!!error} variant="outlined" fullWidth>
          <OutlinedInput id="deposited"
                         value={value}
                         size="small"
                         endAdornment={<Max onClick={onMax} />}
                         disabled={isDisabled}
                         onChange={onChange}
                         error={!!error}
                         fullWidth
                         sx={{ py: 0.5 }} />
          <FormHelperText id="deposited-error-text">{error}</FormHelperText>
          <FormHelperText id="deposited-helper-text" sx={{ mr: 0, textAlign: 'right' }}>
            {vault.withdrawalFeeLabel}
          </FormHelperText>
        </FormControl>
      </Box>

      <Button variant="outlined"
              color="primary"
              size="small"
              disabled={isDisabled}
              fullWidth
              onClick={onSubmit}
              sx={{ mt: 2, py: 0.75 }}>
        {buttonLabel}
      </Button>
    </React.Fragment>
  )
}

Withdraw.propTypes = {
  vault: PropTypes.object
}

export default Withdraw



// -- HELPERS --

const withdrawSent = (chainId, hash) => {
  return txSent('withdraws', 'withdraw', chainId, hash)
}

const withdrawSuccess = (chainId, hash) => {
  return txSuccess('withdraws', 'withdraw', chainId, hash)
}

const withdrawError = (chainId, error) => {
  return txError('withdraws', 'withdraw', chainId, error)
}

const nativeAmount = (vault, amount) => {
  const { decimals, sharePrice } = vault
  const price                    = sharePrice.toString()
  const precision                = toBigNumber(10).pow(decimals.toString())
  const shares                   = toBigNumber(amount).div(price).times(precision)

  return toNative(shares, decimals)
}

const withdraw = async (wallet, vault, amount, useMax) => {
  const contract  = new Contract(vault.contract, archimedesAbi, wallet.provider)
  const gasPrice  = await suggestedGasPrice()
  const overrides = { from: wallet.address, gasPrice }

  if (useMax) {
    try {
      const gas = await contract.estimateGas.withdrawAll(vault.pid, overrides)

      return await vault.withdrawAll({
        gasPrice,
        gasLimit: (gas.toNumber() * 1.2).toFixed()
      })
    } catch {
      // If estimates fail, we do it anyway with no guesses =)
      return await vault.withdrawAll()
    }
  } else {
    const amountNative = nativeAmount(vault, amount)

    try {
      const gas = await contract.estimateGas.withdraw(
        vault.pid, amountNative, overrides
      )

      return await vault.withdraw(amountNative, {
        gasLimit: (gas.toNumber() * 1.2).toFixed(),
        gasPrice
      })
    } catch {
      // If estimates fail, we do it anyway with no guesses =)
      return await vault.withdraw(amountNative)
    }
  }
}
