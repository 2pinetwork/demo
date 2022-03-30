import Head from 'next/head'
import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme'
import { Provider } from '@/store'

const App = ({ Component, pageProps }) => (
  <Provider>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </Provider>
)

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
