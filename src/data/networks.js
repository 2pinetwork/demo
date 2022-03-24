import { polygonMainnet, polygonTestnet } from './networks/polygon'

// NOTE: Always add trailing slashes to network URLs.
// https://github.com/MetaMask/metamask-extension/issues/3245
export const networks = {
  // Polygon
  137:    polygonMainnet,
  80001:  polygonTestnet
}

export const getRpcUrl = chainId => {
  const network = networks[chainId]

  return network?.rpcUrls.find(_ => true)
}

export const getBlockExplorerUrl = chainId => {
  const network = networks[chainId]

  return network?.blockExplorerUrls.find(_ => true)
}
