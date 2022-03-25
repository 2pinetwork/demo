import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import { Card } from '@/components'
import { networks } from '@/data/networks'
import { addChain } from '@/data/wallet'
import { dropNotificationGroup, useStore } from '@/store'
import { notifyError } from '@/store/notifications'

const DEFAULT_CHAIN = 137

const Network = () => {
  const [ { wallet }, dispatch ]        = useStore()
  const [ chainId, setChainId ]         = useState(wallet?.chainId || DEFAULT_CHAIN)
  const [ networkName, setNetworkName ] = useState(networks[chainId]?.chainName)

  // Get chain id from wallet
  useEffect(() => {
    const newChainId = getChainId(wallet, chainId)

    if (wallet && newChainId === 0) {
      const network = networks[chainId || DEFAULT_CHAIN]

      const errorHandler = () => {
        dispatch(dropNotificationGroup('wallet'))
        dispatch(unsupportedNetworkError(network))
      }

      // Avoid awaiting here, it hangs without error on some clients.
      addChain(wallet, network).catch(errorHandler)
    }

    if (isSupportedNetwork(newChainId)) {
      setNetworkName(networks[newChainId]['chainName'])
    } else {
      setNetworkName('Unsupported')
    }

    // When the wallet's network is unsupported, prompt the wallet to switch
    // to the current network but change `chainId` anyway and display
    // "Unsupported Network" until the wallet switches to a supported one.
    setChainId(newChainId)
    // We don't want dispatch complains here =)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ chainId, wallet ])

  return (
    <Card sx={{ py: 0.5, px: 3, backgroundColor: 'common.white' }}>
      <Typography variant="h5">
        <Grid container spacing={1} sx={{ mt: 0.25 }}>
          <Grid item xs>
            <Box component="div" sx={{ pt: 0.5 }}>
              <Image src={`/images/logos/${networkName === 'Unsupported' ? 'unsupported' : 'polygon'}.svg`}
                     alt={networkName}
                     width="32"
                     height="32"
                     unoptimized />
            </Box>
          </Grid>

          <Grid item xs>
            <Box component="p" sx={{ m: 0 }}>
              {networkName}
            </Box>
          </Grid>
        </Grid>
      </Typography>
    </Card>
  )
}

export default Network



// -- HELPERS --

const getChainId = (wallet, currentChainId) => {
  if (! wallet) {
    // Avoid selecting an unsupported network when wallet is not conencted
    return currentChainId || DEFAULT_CHAIN
  }

  return isSupportedNetwork(wallet.chainId) ? wallet.chainId : 0
}

const isSupportedNetwork = chainId => Object.keys(networks).includes(`${chainId}`)

const unsupportedNetworkError = ({ chainName }) => {
  return notifyError('wallet',
    `Please add the ${chainName} network to your wallet in order to operate on it.`
  )
}
