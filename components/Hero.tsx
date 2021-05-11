import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import Image from 'next/image'

export default function Hero() {
    return (
        <Box pos='relative'>
            <Container h='100vh' zIndex={'-1'} d={{ base: 'block', lg: 'none' }}>
                <Image src='/img/hero3.jpg'
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </Container>
            <Container h='100vh' zIndex={'-1'} d={{ base: 'none', lg: 'block' }}>
                <Image src='/img/hero2.jpg'
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </Container>
        </Box>


    );
}