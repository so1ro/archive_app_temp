import React from 'react';
import { Text, VStack, Center, Spinner, useColorModeValue } from '@chakra-ui/react';
import useWindowSize from '@/utils/useWindowSize';
import { highlight_color } from '@/styles/colorModeValue';

export default function LodingSpinner() {
    const { height: innerHeight } = useWindowSize();

    return (
        <Center h={`${innerHeight}px`}>
            <VStack spacing={4}>
                <Spinner thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={useColorModeValue(highlight_color.l, highlight_color.d)}
                    size="xl" />
                <Text fontSize='sm'>このまま少々お待ち下さい...</Text>
            </VStack>
        </Center>
    );
}