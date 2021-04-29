import { useState } from "react"
import Head from 'next/head'
import NextLink from 'next/link';
import { useRouter } from 'next/router'

import { useUser } from '@auth0/nextjs-auth0'

import { Flex, Heading, Stack, Text, Button } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"

import { bg, color } from '@/styles/colorModeValue';
import { MoonIcon, SunIcon } from '@/styles/icons';
import ModalMenu from '@/components/modalMenu'

export default function Layout({ children }) {
    const router = useRouter()
    console.log('router.pathname:', router.pathname)

    // Hooks
    const { colorMode, toggleColorMode } = useColorMode()
    const { user, error, isLoading } = useUser();
    const [{ isMenuOpen }, setIsMenuOpen] = useState<{ isMenuOpen: boolean }>({ isMenuOpen: false })

    return (
        <>
            <Head>
                <title>{'タイトル'}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link
                    rel="preload"
                    href="/fonts/RocknRollOne-Regular.woff2"
                    as="font"
                    crossOrigin=""
                />
            </Head>

            {/* //////// Shell //////// */}
            <Flex flexDirection="column"
                bg={useColorModeValue(bg.light, bg.dark)}
                minH="100vh"
            >
                {/* //// Nav //// */}
                <Flex
                    backgroundColor="white"
                    justifyContent="space-between"
                    alignItems="center"
                    // p={4}
                    px={4}
                    py={2}
                    bg={useColorModeValue(bg.light, bg.dark)}
                    color={useColorModeValue(color.light, color.dark)}
                    zIndex={3}
                // bgColor={bg}
                >
                    <Stack spacing={4} isInline alignItems="center">
                        <Text as="h1" fontSize={["md", "lg", "xl", "2xl"]}>カスブラ</Text>
                        {/* <NextLink href="/sites" passHref>
                        <Link>Site</Link>
                        </NextLink>
                        <NextLink href="/feedback" passHref>
                        <Link>Feedback</Link>
                    </NextLink> */}
                    </Stack>
                    <Flex alignItems="center">
                        <Stack spacing={[1, 2, 4]} isInline alignItems="center">
                            <Text fontSize={["sm", "md", "lg"]}>
                                {isLoading ?
                                    '' :
                                    (user ? <a href="/api/auth/logout">ログアウト</a> : <a href="/api/auth/login">ログイン</a>)}
                            </Text>
                            <Button onClick={toggleColorMode} size="md" p={0}>
                                {colorMode === "light" ? <MoonIcon width={6} height={6} /> : <SunIcon width={6} height={6} />}
                            </Button>
                            {/* <Button onClick={toggleColorMode}>
                        Toggle {colorMode === "light" ? "Dark" : "Light"}
                    </Button> */}
                            {/* <Link mr={4}>Account</Link> */}
                            {/* {!!user ?
                        <Button variant="ghost" mr={2} onClick={() => signout()}>Sign out</Button> :
                        <Button variant="ghost" mr={2} onClick={() => signinWithGithub()}>Sign in</Button>}
                    <Avatar size="sm" src={user?.photoUrl} /> */}
                        </Stack>
                    </Flex>
                </Flex>

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
                    <ModalMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                </Flex>

                {/* //// Footer //// */}
                <Flex
                    backgroundColor="white"
                    justifyContent="space-between"
                    alignItems="center"
                    // p={4}
                    px={4}
                    py={2}
                    bg={bg}
                    color={color}
                // bgColor={bg}
                >
                    <Stack spacing={4} isInline alignItems="center">
                        <Heading as="h1" size="xl" isTruncated>Footer</Heading>

                        {/* <NextLink href="/sites" passHref>
                        <Link>Site</Link>
                    </NextLink>
                    <NextLink href="/feedback" passHref>
                        <Link>Feedback</Link>
                    </NextLink> */}
                    </Stack>
                    <Flex alignItems="center">
                        <Text fontSize="2xl">ログイン</Text>
                        {/* <Button onClick={toggleColorMode}>
                        Toggle {colorMode === "light" ? "Dark" : "Light"}
                    </Button> */}
                        {/* <Link mr={4}>Account</Link> */}
                        {/* {!!user ?
                        <Button variant="ghost" mr={2} onClick={() => signout()}>Sign out</Button> :
                        <Button variant="ghost" mr={2} onClick={() => signinWithGithub()}>Sign in</Button>}
                    <Avatar size="sm" src={user?.photoUrl} /> */}
                    </Flex>
                </Flex>

            </Flex>
        </>
    );
}