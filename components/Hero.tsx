import { Box, Container } from '@chakra-ui/react';
import Image from 'next/image'
import HeroSnsIcons from '@/components/HeroSnsIcons';
import HeroArchiveLink from '@/components/HeroArchiveLink';

export default function Hero({ todayImg }: { todayImg: TodayImgInterface }) {
    todayImg.sort(function (a, b) {
        return a.width - b.width;
    });
    const portraitImg = todayImg[0]
    const landscapeImg = todayImg[1]

    return (
        <Box pos='relative'>
            <Container h='100vh' zIndex={'-1'} d={{ base: 'block', lg: 'none' }}>
                <Image src={portraitImg.url}
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority={true}
                />
            </Container>
            <Container h='100vh' zIndex={'-1'} d={{ base: 'none', lg: 'block' }}>
                <Image src={landscapeImg.url}
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

