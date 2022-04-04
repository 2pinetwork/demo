import { useEffect } from 'react'
import { getVaults } from '@/data/vaults'
import { loopWithBackOff } from '@/lib/function'
import { dropNotificationGroup, useStore, vaultsLoaded } from '@/store'
import { notifyError } from '@/store/notifications'

const FETCH_INTERVAL = 30 * 1000

// [TODO]
// - Cache vaults
export const useVaults = () => {
  const [ { wallet, vaults }, dispatch ] = useStore()

  useEffect(() => {
    const order     = Date.now()
    const delay     = (wallet) ? FETCH_INTERVAL : FETCH_INTERVAL * 6
    const getData   = ()     => getVaults(wallet)
    const onSuccess = vaults => dispatch(vaultsLoaded(vaults, order))
    const onError   = () => {
      dispatch(dropNotificationGroup('fetchVaults'))
      dispatch(fetchError())
    }

    // Start fetch loop
    const cancelLoop = loopWithBackOff(getData, { delay, onSuccess, onError })

    return cancelLoop
    // We don't want dispatch complains here =)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet])

  return vaults?.value
}

export const onUpdate = (wallet, dispatch) => {
  const order = Date.now()

  getVaults(wallet).then(result => {
    dispatch(vaultsLoaded(result, order))
  })
}

const fetchError = () => {
  return notifyError('fetchVaults',
    'We can’t reach out some resources, please refresh the page and try again'
  )
}
