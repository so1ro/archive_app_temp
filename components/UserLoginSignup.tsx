
import { Button, HStack, Link, Text, useBreakpointValue } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { highlight_color } from '@/styles/colorModeValue';

export default function UserLoginSignup() {
    const highlighColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });

    return (
        <>
            <HStack align="center" spacing={[2, 2, 3]}>
                <Link fontSize={["10px", "11px"]} href="/api/auth/login?param=signup" lineHeight='14px'>
                    初めての方は<br />
                    <Text color={highlighColor}>サインアップ</Text>
                </Link>
                <Link href="/api/auth/login"><Button size={buttonSize} fontWeight='md'>ログイン</Button></Link>
            </HStack>
        </>
    );
}