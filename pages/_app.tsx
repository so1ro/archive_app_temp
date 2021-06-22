import React from "react"
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'

import { UserProvider } from '@auth0/nextjs-auth0';
import { ChakraProvider } from "@chakra-ui/react"
import { UserMetadataProvider } from '@/context/useUserMetadata';
import { ArchiveStateProvider } from '@/context/useArchiveState';
import Layout from '@/components/Layout';
import SimpleReactLightbox from 'simple-react-lightbox-pro'

// import '@/styles/globals.css'
import '@/styles/font.css'
import theme from '@/styles/themes';

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <UserMetadataProvider>
        <ChakraProvider theme={theme}>
          <ArchiveStateProvider>
            <React.StrictMode>
              <SimpleReactLightbox>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </SimpleReactLightbox>
            </React.StrictMode>
          </ArchiveStateProvider>
        </ChakraProvider>
      </UserMetadataProvider>
    </UserProvider>
  )
}

export default App
