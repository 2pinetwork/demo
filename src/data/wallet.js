import { Web3Provider } from '@ethersproject/providers'
import { createWalletModal } from '@/lib/wallet'

export const createSession = async () => {
  const modal          = createWalletModal()
  const walletProvider = await modal.requestProvider()
  const ethersProvider = new Web3Provider(walletProvider, 'any')
  const [ address ]    = await ethersProvider.listAccounts()
  const { chainId }    = await ethersProvider.getNetwork()

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
