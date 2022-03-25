import { useEffect } from 'react'
import { getVaults } from '@/data/vaults'
import { useStore, vaultsLoaded } from '@/store'

// [TODO]
// - Update vaults on a loop (refresh)
// - Cache vaults
export const useVaults = () => {
  const [ { wallet, vaults }, dispatch ] = useStore()

  useEffect(() => {
    const order = Date.now()

    getVaults(wallet).then(result => {
      dispatch(vaultsLoaded(result, order))
    })
    // We don't want dispatch complains here =)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet])

  return vaults?.value
}
