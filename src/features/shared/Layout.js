import PropTypes from 'prop-types'
import Image from 'next/image'
import { AppBar, Box, Container, Toolbar } from '@mui/material'
import { Link, WalletButton } from '@/components'

const Logo = () => (
  <Image src="/images/2pi_dark.svg" alt="2PI" width="98" height="56" unoptimized />
)

const Layout = ({ children }) => (
  <Box component="main" sx={{ flexGrow: 1 }}>
    <AppBar color="default" position="static" sx={{ backgroundColor: 'common.white' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Link href="/" sx={{ textAlign: 'center', mt: 1 }}>
            <Logo />
          </Link>

          <Box sx={{ flexGrow: 1 }}>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <WalletButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

    <Container maxWidth="lg" sx={{ mt: 6 }}>
      {children}
    </Container>
  </Box>
)

Layout.propTypes = {
  children: PropTypes.node
}

export default Layout
