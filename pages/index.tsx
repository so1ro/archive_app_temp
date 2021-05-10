import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Box, Container } from '@chakra-ui/react';
import Image from 'next/image'
// import { css } from "@emotion/react"

import { useUser } from '@auth0/nextjs-auth0'
export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <main>
        <Box pos='relative'>
          <Container h='100vh' zIndex={'-1'}>
            <Image src='/img/hero.jpg'
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </Container>
        </Box>
        <div>
          Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
        </div>
      </main>
    )
  }
  return <a href="/api/auth/login">Login</a>;

}
