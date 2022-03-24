import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toNumber } from '@/lib/locales'
import { toHuman, toNative } from '@/lib/math'
import { dropNotificationGroup, useStore } from '@/store'
import { txSent, txSuccess, txError } from '@/utils/transactions'
import { validateDeposit } from '@/utils/validations'
import Max from './Max'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography
} from '@mui/material'

const Deposit = ({ vault }) => {
  const [ { wallet }, dispatch ]    = useStore()
  const [ value, setValue ]         = useState('')
  const [ error, setError ]         = useState()
  const [ isPending, setIsPending ] = useState(false)
  const { balance }                 = vault

  const isApproved = isTokenApproved(vault)
  const isDisabled = isPending || typeof vault.approve !== 'function'

  const buttonLabel = (isApproved)
    ? (isPending ? 'Depositing...' : 'Deposit')
    : (isPending ? 'Approving...'  : 'Approve')

  const onApprove = async () => {
    const chainId = vault.chainId

    setIsPending(true)

    try {
      const transaction = await approve(vault, 1e58)

      dispatch(dropNotificationGroup('deposits'))
      dispatch(approveSent(chainId, transaction.hash))

      const receipt = await transaction.wait()

      onUpdate()
      dispatch(dropNotificationGroup('deposits'))
      dispatch(approveSuccess(chainId, receipt.transactionHash))

    } catch (error) {
      dispatch(dropNotificationGroup('deposits'))
      dispatch(approveError(chainId, error))

    } finally {
      setIsPending(false)
    }
  }

  const onDeposit = async () => {
    const chainId = vault.chainId
    const amount  = nativeAmount(vault, value)
    const error   = await validateDeposit(vault, amount)

    // Update the displayed error message and abort if there's an error
    setError(error)
    if (error) return

    setIsPending(true)

    try {
      const referral    = localStorage.getItem('referral')
      const transaction = await deposit(vault, value, referral)

      setValue('')
      setIsPending(false)
      dispatch(dropNotificationGroup('deposits'))
      dispatch(depositSent(chainId, transaction.hash))

      const receipt = await transaction.wait()

      onUpdate()
      dispatch(dropNotificationGroup('deposits'))
      dispatch(depositSuccess(chainId, receipt.transactionHash))

    } catch (error) {
      setIsPending(false)
      dispatch(dropNotificationGroup('deposits'))
      dispatch(depositError(chainId, error))
    }
  }

  const onMax = (event) => {
    event.preventDefault()

    setValue(toNumber(toHuman(balance, vault.tokenDecimals), { precision: vault.tokenDecimals }))
  }

  const onChange = ({ target }) => setValue(target.value)
  const onSubmit = (isApproved) ? onDeposit : onApprove

  return (
    <React.Fragment>
      <Typography component="div" variant="body1" color="grey.400">
        Balance ({balance ? toNumber(toHuman(balance, vault.tokenDecimals), { precision: 4 }) : '-'} {vault.token.toUpperCase()})
      </Typography>

      <Box component="div" sx={{ mt: 2 }}>
        <FormControl error={!!error} variant="outlined" fullWidth>
          <OutlinedInput id="balance"
                         value={value}
                         size="small"
                         endAdornment={<Max onClick={onMax} />}
                         disabled={!isApproved || isDisabled}
                         onChange={onChange}
                         error={!!error}
                         fullWidth
                         sx={{ py: 0.5 }} />
          <FormHelperText id="deposited-error-text">{error}</FormHelperText>
        </FormControl>
      </Box>

      <Button variant="contained"
              color="primary"
              size="small"
              disabled={!wallet || isDisabled}
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

const isTokenApproved = ({ chainId, token, allowance, balance }) => {
  if ([ 137, 80001 ].includes(chainId) && token === 'matic') return true

  return allowance?.gt(balance)
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

const approve = async (vault, amount) => {
  const amountNative = nativeAmount(vault, amount)

  return await vault.approve(amountNative)
}

const deposit = async (vault, amount, referral) => {
  const amountNative = nativeAmount(vault, amount)

  return await vault.deposit(amountNative, referral)
}
