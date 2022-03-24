import { JsonRpcProvider, getDefaultProvider } from '@ethersproject/providers'
import { TwoPi } from '@2pi-network/js-sdk'
import doGetPrices from '@2pi-network/js-sdk/dist/fetchers/prices'

const clients       = {}
let   currentWallet = undefined

export const getPrices = async chainId => {
  return doGetPrices(getClient(chainId, currentWallet))
}

export const getVaults = (chainId, wallet) => {
  return getClient(chainId, wallet).getVaults()
}



// -- HELPERS --

const networks = {
  137: { name: 'matic', rpcUrl: 'https://polygon-rpc.com/' }
}

const getClient = (chainId, wallet) => {
  let client = clients[chainId]

  if (!client || wallet !== currentWallet) {
    const provider = getEthersProvider(chainId, wallet)
    const signer   = wallet && provider.getSigner()

    client = new TwoPi(chainId, provider, signer)

    // Update cache
    currentWallet    = wallet
    clients[chainId] = client
  }

  return client
}

const getEthersProvider = (chainId, wallet) => {
  return (wallet)
    ? wallet.provider
    : getDefaultProvider(getEthersNetwork(chainId))
}

const getEthersNetwork = chainId => {
  const { name, rpcUrl } = networks[chainId]
  const _defaultProvider = () => new JsonRpcProvider(rpcUrl)

  return { name, chainId, _defaultProvider }
}
