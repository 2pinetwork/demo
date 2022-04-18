import { useEffect, useRef } from 'react'
import { getVaults } from '@/data/vaults'
import { loopWithBackOff } from '@/lib/function'
import { dropNotificationGroup, useStore, vaultsLoaded } from '@/store'
import { notifyError } from '@/store/notifications'

const FETCH_INTERVAL = 30 * 1000

const useUpdateEffect = (callback, dependencies) => {
  const initMount = useRef(true)

  useEffect(() => {
    if (initMount.current) {
      initMount.current = false

      return
    }

    return callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

// [TODO]
// - Cache vaults
export const useVaults = () => {
  const [ { wallet, vaults }, dispatch ] = useStore()

  useUpdateEffect(() => {
    const delay     = (wallet) ? FETCH_INTERVAL : FETCH_INTERVAL * 6
    const getData   = ()     => getVaults(wallet)
    const onSuccess = vaults => dispatch(vaultsLoaded(vaults, Date.now()))
    const onError   = ()     => {
      dispatch(dropNotificationGroup('fetchVaults'))
      dispatch(fetchError())
    }

    // Start fetch loop
    return loopWithBackOff(getData, { delay, onSuccess, onError })
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
