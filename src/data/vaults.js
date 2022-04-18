import { BigNumber } from 'ethers'
import { get } from '@/lib/client'
import { toHuman } from '@/lib/math'
import { getVaults as protocolVaults } from '@/lib/protocol'

const only = [
  'polygon_mstable_usdc',
  'polygon_quickswap_usdc'
]

// This should be moved elsewhere, but well...
const info = {
  'polygon_mstable_usdc': {
    depositFeeLabel:    'Deposit fee ~0.005%',
    withdrawalFeeLabel: 'Withdrawal fee 0.1%',
    infoLabel:          'imUSD is insured. Funds inside mStable protocol are covered by Nexus Mutual.'
  },
  'polygon_quickswap_usdc': {
    depositFeeLabel:    'Deposit fee ~0.8% due to LP creation / staking',
    withdrawalFeeLabel: 'Withdrawal fee 0.1% + 0.8% LP conversion / unstaking'
  }
}

export const getVaults = async wallet => {
  const response   = await get(`/v1/vaults${query()}`)
  const vaults     = (response.data || []).filter(v => only.includes(v.identifier))
  const vaultsData = wallet && await protocolVaults(wallet.chainId, wallet)

  return await Promise.all(
    vaults.map(vault => parseVault(vault, vaultsData))
  )
}

const query = () => {
  const params = ['only[]=polygon']

  return `?${params.join('&')}`
}

const parseVault = async (vault, data) => {
  const [ network, protocol, token ] = getInfo(vault)
  const id                           = [network, token, protocol].join('-')
  const extra                        = data && data.find(data => data.id === id)
  const result                       = {
    identifier:    vault.identifier,
    pid:           vault.pid,
    tokenPrice:    Number(vault.token_price),
    apy:           Number(vault.apy),
    tvl:           toHuman(vault.tvl, +vault.token_decimals),
    contract:      vault.contract_address,
    tokenContract: vault.token_address,
    chainId:       extra?.chainId,
    tokenDecimals: extra && await extra.tokenDecimals(),
    decimals:      extra && await extra.decimals(),
    balance:       extra && await extra.balance(),
    allowance:     extra && await extra.allowance(),
    sharePrice:    extra && await extra.pricePerFullShare(),
    shares:        extra && await extra.shares(),
    deposited:     extra && await deposited(extra),
    deposit:       extra?.deposit?.bind(extra),
    depositAll:    extra?.depositAll?.bind(extra),
    approve:       extra?.approve?.bind(extra),
    withdraw:      extra?.withdraw?.bind(extra),
    withdrawAll:   extra?.withdrawAll?.bind(extra),
    network,
    protocol,
    token
  }

  return { ...result, ...info[result.identifier] }
}

const deposited = async extra => {
  const shares            = await extra.shares()
  const decimals          = await extra.decimals()
  const pricePerFullShare = await extra.pricePerFullShare()

  return shares.mul(pricePerFullShare).div(BigNumber.from(10).pow(decimals))
}

const getInfo = ({ identifier }) => {
  const [ network, protocol, token ] = identifier.split('_')

  return (token)
    ? [ network, protocol, token ]
    : [ network, undefined, protocol ]
}
