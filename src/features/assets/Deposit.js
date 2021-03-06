import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Contract } from 'ethers'
import archimedesAbi from '@/data/abis/archimedes'
import erc20abi from '@/data/abis/erc20'
import { toNumber } from '@/lib/locales'
import { toBigNumber, toHuman, toNative } from '@/lib/math'
import { onUpdate } from '@/features/assets/utils/vaults'
import { dropNotificationGroup, useStore } from '@/store'
import { notifySuccess } from '@/store/notifications'
import { txSent, txSuccess, txError } from '@/utils/transactions'
import { isNumber, validateDeposit } from '@/utils/validations'
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


export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const Deposit = ({ vault }) => {
  const [ { wallet }, dispatch ]    = useStore()
  const [ value, setValue ]         = useState('')
  const [ error, setError ]         = useState()
  const [ isPending, setIsPending ] = useState(false)
  const [ useMax, setUseMax ]       = useState(false)
  const { balance }                 = vault

  const isDisabled = isPending || typeof vault.approve !== 'function'
  const isApproved = isTokenApproved(vault, value)

  const buttonLabel = (isApproved)
    ? (isPending ? 'Depositing...' : 'Deposit')
    : (isPending ? 'Approving...'  : 'Approve')

  const onApprove = async () => {
    const chainId = vault.chainId

    setIsPending(true)

    try {
      const transaction = await approve(wallet, vault, 1 + '0'.repeat(58))

      dispatch(dropNotificationGroup('deposits'))
      dispatch(approveSent(chainId, transaction.hash))

      const receipt = await transaction.wait()

      // Since TwoPi lib refresh data every 2 seconds:
      setTimeout(() => {
        dispatch(dropNotificationGroup('deposits'))
        dispatch(approveSuccess(chainId, receipt.transactionHash))

        onUpdate(wallet, dispatch)
      }, 5 * 1000)
    } catch (error) {
      dispatch(dropNotificationGroup('deposits'))
      dispatch(approveError(chainId, error))
    } finally {
      setTimeout(() => { setIsPending(false) }, 5 * 1000)
    }
  }

  const onDeposit = async () => {
    const chainId = vault.chainId
    const amount  = nativeAmount(vault, value)
    const error   = validateDeposit(vault, amount)

    // Update the displayed error message and abort if there's an error
    setError(error)
    if (error) return

    setIsPending(true)

    try {
      const referral    = localStorage.getItem('referral') || ZERO_ADDRESS
      const transaction = await deposit(wallet, vault, value, referral, useMax)

      setValue('')
      setUseMax(false)
      dispatch(dropNotificationGroup('deposits'))
      dispatch(depositSent(chainId, transaction.hash))

      const receipt = await transaction.wait()

      // Since TwoPi lib refresh data every 2 seconds:
      setTimeout(() => {
        dispatch(dropNotificationGroup('deposits'))
        dispatch(depositSuccess(chainId, receipt.transactionHash))

        onUpdate(wallet, dispatch)
      }, 5 * 1000)
    } catch {
      dispatch(dropNotificationGroup('deposits'))
      dispatch(depositError(chainId, error))
    } finally {
      setTimeout(() => { setIsPending(false) }, 5 * 1000)
    }
  }

  const onMax = event => {
    event.preventDefault()

    setValue(toHuman(balance, vault.tokenDecimals).toFixed(vault.tokenDecimals))
    setUseMax(true)
  }

  const onChange = ({ target }) => {
    setValue(target.value)
    setUseMax(false)
  }

  const onSubmit = (isApproved) ? onDeposit : onApprove

  return (
    <React.Fragment>
      <Typography component="div" variant="body1" color="grey.400">
        Balance ({balance ? toNumber(toHuman(balance, vault.tokenDecimals), { precision: 6 }) : '-'} {vault.token.toUpperCase()})
      </Typography>

      <Box component="div" sx={{ mt: 2 }}>
        <FormControl error={!! error} variant="outlined" fullWidth>
          <OutlinedInput id="balance"
                         value={value}
                         size="small"
                         endAdornment={<Max onClick={onMax} />}
                         disabled={isDisabled}
                         onChange={onChange}
                         error={!! error}
                         fullWidth
                         sx={{ py: 0.5 }} />
          <FormHelperText id="balance-error-text">{error}</FormHelperText>
          <FormHelperText id="balance-helper-text" sx={{ mr: 0, textAlign: 'right' }}>
            {vault.depositFeeLabel}
          </FormHelperText>
        </FormControl>
      </Box>

      <Button variant="contained"
              color="primary"
              size="small"
              disabled={! wallet || isDisabled || ! isNumber(value)}
              fullWidth
              onClick={onSubmit}
              sx={{ mt: 2, py: 1 }}>
        {buttonLabel}
      </Button>
    </React.Fragment>
  )
}

Deposit.propTypes = {
  vault: PropTypes.object
}

export default Deposit



// -- HELPERS --

const isTokenApproved = ({
  chainId,
  token,
  tokenDecimals,
  allowance,
  balance
}, value) => {
  if ([ 137, 80001 ].includes(chainId) && token === 'matic') return true

  if (value) {
    const precision = toBigNumber(10).pow(tokenDecimals.toString())
    const amount    = toBigNumber(value).times(precision)

    return amount.isPositive() && allowance?.gte(amount.toFixed(0))
  } else {
    return allowance?.gte(balance)
  }
}

const approveSent = (chainId, hash) => {
  return txSent('deposits', 'approval', chainId, hash)
}

const approveSuccess = () => {
  const message = 'The approval was successful, you may deposit now.'

  return notifySuccess('deposits', message)
}

const approveError = (chainId, error) => {
  return txError('deposits', 'approval', chainId, error)
}

const depositSent = (chainId, hash) => {
  return txSent('deposits', 'deposit', chainId, hash)
}

const depositSuccess = (chainId, hash) => {
  return txSuccess('deposits', 'deposit', chainId, hash)
}

const depositError = (chainId, error) => {
  return txError('deposits', 'deposit', chainId, error)
}

const nativeAmount = (vault, amount) => {
  const tokenDecimals = vault.tokenDecimals

  return toNative(amount, tokenDecimals)
}

const approve = async (wallet, vault, amount) => {
  const amountNative = nativeAmount(vault, amount)

  try {
    const contract = new Contract(vault.tokenContract, erc20abi, wallet.provider)
    const gasPrice = await suggestedGasPrice()
    const gas      = await contract.estimateGas.approve(
      vault.contract, amountNative, { from: wallet.address }
    )

    return await vault.approve(amountNative, {
      gasLimit: (gas.toNumber() * 1.5).toFixed(),
      gasPrice
    })
  } catch {
    // If estimates fail, we do it anyway with no guesses =)
    return await vault.approve(amountNative)
  }
}

const deposit = async (wallet, vault, amount, referral, useMax) => {
  const contract  = new Contract(vault.contract, archimedesAbi, wallet.provider)
  const gasPrice  = await suggestedGasPrice()
  const overrides = { from: wallet.address, gasPrice }

  if (useMax) {
    try {
      const gas = await contract.estimateGas.depositAll(
        vault.pid, referral, overrides
      )

      return await vault.depositAll(referral, {
        gasPrice,
        gasLimit: (gas.toNumber() * 1.5).toFixed()
      })
    } catch {
      // If estimates fail, we do it anyway with no guesses =)
      return await vault.depositAll(referral)
    }
  } else {
    const amountNative = nativeAmount(vault, amount)

    try {
      const gas = await contract.estimateGas.deposit(
        vault.pid, amountNative, referral, overrides
      )

      return await vault.deposit(amountNative, referral, {
        gasLimit: (gas.toNumber() * 1.5).toFixed(),
        gasPrice
      })
    } catch {
      // If estimates fail, we do it anyway with no guesses =)
      return await vault.deposit(amountNative, referral)
    }
  }
}
