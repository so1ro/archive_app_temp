import { Box, Container } from '@chakra-ui/react';
import Image from 'next/image'
import HeroSnsIcons from '@/components/HeroSnsIcons';
import HeroArchiveLink from '@/components/HeroArchiveLink';

export default function Hero() {

    return (
        <Box pos='relative'>
            <Container h='100vh' zIndex={'-1'} d={{ base: 'block', lg: 'none' }}>
                <Image src='/img/hero3.jpg'
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority={true}
                />
            </Container>
            <Container h='100vh' zIndex={'-1'} d={{ base: 'none', lg: 'block' }}>
                <Image src='/img/hero2.jpg'
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority={true}
                />
            </Container>
            <HeroArchiveLink />
            <HeroSnsIcons />
        </Box>
    );
}