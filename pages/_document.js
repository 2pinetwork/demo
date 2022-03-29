import { Head, Html, Main, NextScript } from 'next/document'

const Document = () => {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:local" content="en_US" />
        <meta property="og:title" content="2PI Demo" />
        <meta property="og:description" content="2PI Demo" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://demo.2pi.network" />
        <meta property="og:image" content="https://demo.2pi.network/images/2pi_512.png" />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="64x64" />
        <link rel="mask-icon" href="/favicon.svg" color="#000000" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
