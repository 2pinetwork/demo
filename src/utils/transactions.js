import PropTypes from 'prop-types'
import React from 'react'
import { Link } from '@mui/material'
import { getBlockExplorerUrl } from '@/data/networks'
import { notify, notifySuccess, notifyError } from '@/store/notifications'

export const txSent = (group, name, chainId, hash) => {
  const message = (
    <React.Fragment>
      Your {name} was sent. Check the transaction{' '}
      <TxLink chainId={chainId} hash={hash}>here</TxLink>.
    </React.Fragment>
  )

  return notify(group, message)
}

export const txSuccess = (group, name, chainId, hash) => {
  const message = (
    <React.Fragment>
      Your {name} was successful. Check the transaction{' '}
      <TxLink chainId={chainId} hash={hash}>here</TxLink>.
    </React.Fragment>
  )

  return notifySuccess(group, message)
}

export const txError = (group, name, chainId, error) => {
  const hash = error?.transactionHash

  const message = (hash)
    ? renderErrorMessage(name, chainId, hash)
    : `An error occurred with your ${name}, please try again.`

  return notifyError(group, message)
}



// -- HELPERS --

const renderErrorMessage = (name, chainId, hash) => (
  <React.Fragment>
    The {name} transaction failed, please check it{' '}
    <TxLink chainId={chainId} hash={hash}>here</TxLink>.
  </React.Fragment>
)

const TxLink = ({ chainId, hash, children }) => {
  const explorerUrl = getBlockExplorerUrl(chainId)
  const url         = `${explorerUrl}tx/${hash}`

  return (
    <Link href={url}
          color="inherit"
          target="_blank"
          rel="noreferrer"
          sx={{ fontWeight: 'bold' }}>
      {children}
    </Link>
  )
}

TxLink.propTypes = {
  chainId:  PropTypes.number.isRequired,
  hash:     PropTypes.string.isRequired,
  children: PropTypes.node
}
