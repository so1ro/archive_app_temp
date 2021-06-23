
import {Box, Button, HStack, Link, Text, useBreakpointValue, useColorMode, useToast, useColorModeValue } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons'
import { highlight_color } from '@/styles/colorModeValue';

export default function UserLoginSignup() {

    const highlighColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });
    const { colorMode } = useColorMode()
    const toast = useToast()

    return (
        <>
            <HStack align="center" spacing={[2, 2, 3]}>
                <Link fontSize={["10px", "11px"]} 
                    href="/api/auth/login?param=signup" 
                    lineHeight='14px'
                    onClick={() => {toast({ duration: 9000,
                                render: () => (
                                    <HStack color="white" p={4} bg="#69b578" borderRadius={6} align='flex-start' spacing={4}>
                                        <CheckCircleIcon w={6} h={6} color="white" />
                                        <Box whiteSpace='pre-wrap'>"サインアップに移動中..."</Box>
                                    </HStack>)})}}>
                    初めての方は<br /><Text color={highlighColor}>サインアップ</Text>
                </Link>
                <Link href="/api/auth/login"><Button
                    size={buttonSize}
                    fontWeight='md'
                    colorScheme='gray'
                    border="1px"
                    borderColor={colorMode === 'light' ? "gray.300" : 'gray.600'}>ログイン</Button></Link>
            </HStack>
        </>
    );
}