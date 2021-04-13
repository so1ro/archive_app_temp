import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0';
import { ChakraProvider } from "@chakra-ui/react"
import { UserMetadataProvider } from '@/context/useUserMetadata';


function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <UserMetadataProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </UserMetadataProvider>
    </UserProvider>
  )
}

export default MyApp
