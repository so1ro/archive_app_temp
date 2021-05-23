import { ReactNode } from 'react';
import { Container, VStack } from '@chakra-ui/react';

export default function PageShell(
    { children,
        customPY,
        customSpacing }:
        {
            children: ReactNode,
            customPY: object | null,
            customSpacing: object | null
        }) {
    return (
        <Container maxW='1000px'>
            <VStack py={customPY ?? { base: 12, lg: 24 }} spacing={customSpacing ?? { base: 24, lg: 32 }}>
                {children}
            </VStack>
        </Container >
    );
}