import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Box, Grid, Typography } from '@mui/material'
import { Card, Notifications } from '@/components'
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
        <Card sx={{ py: 0.5, px: 3, backgroundColor: 'common.white' }}>
          <Typography variant="h5">
            <Grid container spacing={1} sx={{ mt: 0.25 }}>
              <Grid item xs>
                <Box component="div" sx={{ pt: 0.5 }}>
                  <Image src="/images/logos/polygon.svg" alt="Polygon" width="32" height="32" unoptimized />
                </Box>
              </Grid>

              <Grid item xs>
                <Box component="p" sx={{ m: 0 }}>
                  Polygon
                </Box>
              </Grid>
            </Grid>
          </Typography>
        </Card>
      </Box>

      <Vaults vaults={vaults} />

      <Notifications />
    </Layout>
  )
}

export default Assets
