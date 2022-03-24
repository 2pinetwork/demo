import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal'
import { getRpcUrl } from '@/data/networks'

export const createWalletModal = () => {
  const providerOptions = {
    walletconnect:       walletConnect,
    'custom-walletlink': walletLink
  }

  const modalOptions = {
    providerOptions,
    cacheProvider: true,
    theme:         'dark'
  }

  return new SafeAppWeb3Modal(modalOptions)
}



// -- OPTIONS --

export const walletConnect = {
  package: WalletConnectProvider,

  options: {
    network: 'matic',
    infuraId: '5c86b242025449ee96c9120c215bd029',
    rpc: {
      // 1 is needed at least for Trust Wallet
      1:     'https://polygon-rpc.com/',
      137:   'https://polygon-rpc.com/',
      80001: 'https://rpc-mumbai.matic.today/'
    }
  }
}

const walletLinkConnector = async (_, options) => {
  const { appName, networkUrl, chainId } = options

  const appLogoUrl = '/images/favicon.svg'
  const walletlink = new CoinbaseWalletSDK({ appName, appLogoUrl, darkMode: true })
  const provider   = walletlink.makeWeb3Provider(networkUrl, chainId)

  await provider.enable()

  return provider
}

const walletLink = {
  package: CoinbaseWalletSDK,

  options: {
    appName:    '2PI',
    chainId:    137, // Polygon Mainnet
    networkUrl: getRpcUrl(137)
  },

  display: {
    logo:        '/images/logos/wallet-link.svg',
    name:        'WalletLink',
    description: 'Scan with WalletLink to connect',
  },

  connector: walletLinkConnector
}
