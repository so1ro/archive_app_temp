import Head from 'next/head'

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Layout({ children }) {
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
            <Flex flexDirection="column"
                // bgColor={bg_Content}
                minH="100vh"
            >
                <Flex
                    backgroundColor="white"
                    justifyContent="space-between"
                    alignItems="center"
                    // p={4}
                    px={4}
                    py={2}
                // bgColor={bg}
                >
                    <Stack spacing={4} isInline alignItems="center">
                        <Text as="h1" fontSize="3xl">カスブラ</Text>
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
                <Flex backgroundColor="blackAlpha.100" flexGrow={1}>
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
                <Flex
                    backgroundColor="white"
                    justifyContent="space-between"
                    alignItems="center"
                    // p={4}
                    px={4}
                    py={2}
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
