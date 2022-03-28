import { Button } from '@mui/material'
import { useStore } from '@/store'
import { connectAsync, disconnectAsync } from '@/store/wallet'

const WalletButton = () => {
  const [ state, dispatch ] = useStore()

  return (
    <Button variant="outlined"
            color="primary"
            size="small"
            onClick={buttonAction(state, dispatch)}
            sx={{ typography: 'small1' }}>
      {buttonLabel(state)}
    </Button>
  )
}

export default WalletButton


// -- HELPERS --

const abbreviateAddress = address => {
  return `${address.substr(0, 6)}...${address.substr(38, 42)}`
}

const buttonLabel = ({ isConnecting, wallet }) => {
  if (! wallet?.address)  return 'Connect wallet'
  if (isConnecting)       return 'Connecting...'

  return abbreviateAddress(wallet.address)
}

const buttonAction = ({ isConnecting, wallet }, dispatch) => {
  if (isConnecting) return undefined

  return (wallet)
    ? () => dispatch(disconnectAsync())
    : () => dispatch(connectAsync())
}
