import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'

import { UserProvider } from '@auth0/nextjs-auth0';
import { ChakraProvider } from "@chakra-ui/react"
import { UserMetadataProvider } from '@/context/useUserMetadata';

import '@/styles/globals.css'
import theme from '@/styles/themes';

// To solve following problem, here using Dynamic import
// https://stackoverflow.com/questions/62243026/expected-server-html-to-contain-a-matching-tag-in-tag
// Dynamic import : https://nextjs.org/docs/advanced-features/dynamic-import
const Layout = dynamic(() => import('@/components/Layout'));

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
