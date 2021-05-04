import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0'

import { Box, Flex, Heading, Stack, Text, Button, Link } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { useMediaQuery } from "@chakra-ui/react"

import { bg_color, text_color } from '@/styles/colorModeValue';
import { MoonIcon, SunIcon } from '@/styles/icons';
import ActiveLink from '@/components/ActiveLink';
import { nav_links } from '@/data/nav_links';


export default function Nav() {
    // Hooks
    const { colorMode, toggleColorMode } = useColorMode()
    const { user, error, isLoading } = useUser();
    const [isPC] = useMediaQuery("(min-width: 992px)")

    return (
        <Flex
            backgroundColor="white"
            justifyContent="space-between"
            alignItems="center"
            px={4}
            py={2}
            bg={useColorModeValue(bg_color.l, bg_color.d)}
            color={useColorModeValue(text_color.l, text_color.d)}
            zIndex={3}
        >
            <Stack spacing={4} isInline alignItems="center">
                <Text as="h1" fontSize={["md", "lg", "xl", "2xl"]}>カスブラ</Text>
            </Stack>
            <Flex alignItems="center">
                {isPC && <Flex>
                    <Stack spacing={4} mr={4} isInline alignItems="center">
                        {nav_links.map(link => (
                            <ActiveLink href={link.href} key={link.key}>
                                <Link>{link.text}</Link>
                            </ActiveLink>
                        ))}
                    </Stack>
                </Flex>}
                <Stack spacing={[1, 2, 4]} isInline alignItems="center">
                    <Text fontSize={["sm", "md", "lg"]}>
                        {isLoading ?
                            '' :
                            (user ? <a href="/api/auth/logout">ログアウト</a> : <a href="/api/auth/login">ログイン</a>)}
                    </Text>
                    <Box onClick={toggleColorMode} size="md" p={0}>
                        {colorMode === "light" ? <MoonIcon width={6} height={6} /> : <SunIcon width={6} height={6} />}
                    </Box>
                </Stack>
            </Flex>
        </Flex>
    )
}
