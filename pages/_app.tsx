import { AppProps } from 'next/app'

import { UserProvider } from '@auth0/nextjs-auth0';
import { ChakraProvider } from "@chakra-ui/react"
import { UserMetadataProvider } from '@/context/useUserMetadata';

import Layout from '@/components/layout';
import '@/styles/globals.css'
import theme from '@/styles/themes';

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <UserMetadataProvider>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </UserMetadataProvider>
    </UserProvider>
  )
}

export default App
