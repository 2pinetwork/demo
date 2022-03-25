import { Web3Provider } from '@ethersproject/providers'
import { createWalletModal } from '@/lib/wallet'
import { addressChanged, chainChanged } from '@/store'

export const createSession = async dispatch => {
  const modal          = createWalletModal()
  const walletProvider = await modal.requestProvider()
  const ethersProvider = new Web3Provider(walletProvider, 'any')
  const [ address ]    = await ethersProvider.listAccounts()
  const { chainId }    = await ethersProvider.getNetwork()

  subscribe(walletProvider, dispatch)

  // Return current wallet state
  return { address, chainId, modal, provider: ethersProvider }
}

export const destroySession = async wallet => {
  if (wallet) {
    await wallet.modal.clearCachedProvider()
  }

  // Return current wallet state
  return undefined
}

// NOTE: Don't rely on this ever resolving.
// On some clients `provider.request` _hangs_ without error.
export const addChain = async (wallet, networkSettings) => {
  const walletProvider = wallet.provider.provider
  const params         = [ networkSettings ]

  await walletProvider.request({ method: 'wallet_addEthereumChain', params })
}

// -- HELPERS --

const subscribe = (provider, dispatch) => {
  if (provider.on) {
    provider.on('accountsChanged', _accounts => {
      if (provider.selectedAddress) {
        const address = provider.selectedAddress

        dispatch(addressChanged(address))
      } else {
        dispatch(addressChanged(undefined))
      }
    })

    provider.on('chainChanged', chainId => {
      const id = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId

      dispatch(chainChanged(id))
    })
  }
}
