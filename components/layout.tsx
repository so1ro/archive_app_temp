import Head from 'next/head'
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { useMediaQuery } from "@chakra-ui/react"

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import Nav_Modal_SP_TB from '@/components/Nav_modal_SP_TB'
import Nav from '@/components/Nav';

import { bg_color, text_color } from '@/styles/colorModeValue';

export default function Layout({ children }) {
    const [isLargerThan992] = useMediaQuery("(min-width: 992px)")

    return (
        <>
            <Head>
                <title>{'タイトル'}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="preload" href="/fonts/RocknRollOne-Regular.woff2" as="font" crossOrigin="" />
            </Head>

            {/* //////// Shell //////// */}
            <Flex flexDirection="column"
                bg={useColorModeValue(bg_color.l, bg_color.d)}
                minH="100vh"
            >
                {/* //// Nav //// */}
                <Nav />
                {!isLargerThan992 && <Nav_Modal_SP_TB />}

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