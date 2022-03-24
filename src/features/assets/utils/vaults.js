import { useState, useEffect } from 'react'
import { getVaults } from '@/data/vaults'
import { useStore } from '@/store'

// [TODO]
// - Update vaults on a loop (refresh)
// - Cache vaults
export const useVaults = () => {
  const [ vaults, setVaults ] = useState()
  const [ state ]             = useStore()

  useEffect(() => {
    getVaults(state.wallet).then(setVaults)
  }, [state])

  return vaults
}
