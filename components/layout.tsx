import { useState } from "react"
import Head from 'next/head'
import NextLink from 'next/link';
import { useRouter } from 'next/router'

import { Flex, Heading, Stack, Text, Button } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"

import { bg_color, text_color } from '@/styles/colorModeValue';
import ModalMenu from '@/components/modalMenu'
import Nav from '@/components/nav';

export default function Layout({ children }) {
    const router = useRouter()
    console.log('router.pathname:', router.pathname)

    // Hooks
    // const [{ isMenuOpen }, setIsMenuOpen] = useState<{ isMenuOpen: boolean }>({ isMenuOpen: false })

    return (
        <>
            <Head>
                <title>{'タイトル'}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="preload" href="/fonts/RocknRollOne-Regular.woff2" as="font" crossOrigin="" />
                <link rel="preload" href="/fonts/AniconsGX.ttf" as="font" crossOrigin="" />
                <link rel="preload" href="/fonts/AniconsColorGX.ttf" as="font" crossOrigin="" />
            </Head>

            {/* //////// Shell //////// */}
            <Flex flexDirection="column"
                bg={useColorModeValue(bg_color.l, bg_color.d)}
                minH="100vh"
            >
                {/* //// Nav //// */}
                <Nav />
                <ModalMenu />

                {/* //// Body //// */}
                <Flex backgroundColor="blackAlpha.100" flexGrow={1} >
                    <Flex
                        w="100%"
                        maxWidth="800px"
                        ml="auto"
                        mr="auto"
                        direction="column"
                    >
                        {children}
                    </Flex>
                </Flex>

                {/* //// Footer //// */}
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    px={4}
                    py={2}
                    bg={bg_color}
                    color={text_color}
                >
                    <Stack spacing={4} isInline alignItems="center">
                        <Heading as="h1" size="xl" isTruncated>Footer</Heading>
                    </Stack>
                    <Flex alignItems="center">
                        <Text fontSize="2xl">ログイン</Text>
                    </Flex>
                </Flex>

            </Flex>
        </>
    );
}