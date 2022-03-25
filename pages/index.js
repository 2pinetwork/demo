import Head from 'next/head'
import { Box } from '@mui/material'
import { Network, Notifications } from '@/components'
import Layout from '@/features/shared/Layout'
import Vaults from '@/features/assets/Vaults'
import { useVaults } from '@/features/assets/utils/vaults'

const Assets = () => {
  const vaults = useVaults()

  return (
    <Layout>
      <Head>
        <title>2PI - Demo dApp</title>
      </Head>

      <Box component="header" sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
        <Network />
      </Box>

      <Vaults vaults={vaults} />

      <Notifications />
    </Layout>
  )
}

export default Assets
