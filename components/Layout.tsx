import Head from 'next/head'
import { useColorMode, useColorModeValue } from "@chakra-ui/react"

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import NavModalSPTB from '@/components/NavModalSPTB'
import Nav from '@/components/Nav';

import { bg_color, text_color } from '@/styles/colorModeValue';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <Head>
                <title>{'タイトル'}</title>
                <meta charSet="utf-8" />
                {/* <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' /> */}
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="preload" href="/fonts/RocknRollOne-Regular.woff2" as="font" crossOrigin="" />
            </Head>
            <Flex flexDirection="column" minH="100vh" bg={useColorModeValue(bg_color.l, bg_color.d)}>
                <Nav />
                <NavModalSPTB />
                <Flex w="100%" flexGrow={1} ml="auto" mr="auto" direction="column">{children}</Flex>
                <Footer />
            </Flex>
        </>
    );
}