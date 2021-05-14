import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router';

import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"

import { bg_color, bg_color_nav_top, text_color } from '@/styles/colorModeValue';
import { MoonIcon, SunIcon } from '@/styles/icons';
import NavLinks from '@/components/NavLinks';
import UserMenu from '@/components/UserMenu';
import UserLoginSignup from '@/components/UserLoginSignup';


export default function Nav() {
    // Hooks
    const router = useRouter()
    const { colorMode, toggleColorMode } = useColorMode()
    const isTop = router.pathname === '/'
    const { user, error, isLoading } = useUser();

    const bgColor = isTop ?
        useColorModeValue(bg_color_nav_top.l, bg_color_nav_top.d) :
        useColorModeValue(bg_color.l, bg_color.d)

    return (
        <Flex
            backgroundColor="white"
            justifyContent="space-between"
            alignItems="center"
            px={[4]}
            py={[1, 1, 2]}
            w='full'
            color={useColorModeValue(text_color.l, text_color.d)}
            bg={bgColor}
            pos={isTop ? 'absolute' : 'relative'}
            top={isTop ? 0 : null}
            left={isTop ? 0 : null}
            zIndex={isTop ? 2 : null}
        >
            <Stack spacing={4} isInline alignItems="center">
                <Text as="h1" fontSize={["lg", "xl", "2xl"]}>カスブラ</Text>
            </Stack>
            <Flex alignItems="center">
                <NavLinks />
                <Stack spacing={[2, 2, 4]} isInline align="center" ml={6}>
                    {isLoading ? '' : (user ? <UserMenu /> : <UserLoginSignup />)}
                    <Box onClick={toggleColorMode} size="md" p={0}>
                        {colorMode === "light" ? <MoonIcon width={5} height={5} mb="2px" /> : <SunIcon width={5} height={5} />}
                    </Box>
                </Stack>
            </Flex>
        </Flex>
    )
}
