import { Box, Container } from '@chakra-ui/react';
import Image from 'next/image'
import HeroSnsIcons from '@/components/HeroSnsIcons';
import HeroArchiveLink from '@/components/HeroArchiveLink';
import { dailyNum } from '@/utils/helpers';
import { useWindowSizeOrientation } from '@/utils/useWindowSize';

export default function Hero({ allHeroImg }) {
    // Arrange Portrait First & Destructuring 
    const portraitFirstAllImg = allHeroImg.map(pair => pair.imageCollection.items.sort((a, b) => a.width - b.width))
    const { height: innerHeight } = useWindowSizeOrientation();

    return (
        <Box pos='relative'>
            {portraitFirstAllImg.map((pair, i) => (
                // Change Hero image Everyday
                (i === dailyNum(portraitFirstAllImg)) &&
                <Box key={i}>
                    {pair.map((img, j) => (
                        <Container key={j}
                            h={`${innerHeight}px`}
                            zIndex={'-1'}
                            d={j === 0 ? { base: 'block', lg: 'none' } : { base: 'none', lg: 'block' }}>
                            <Image src={img.url}
                                layout="fill"
                                objectFit="cover"
                                quality={100}
                                priority={true}
                            />
                        </Container>
                    ))}
                </Box>
            ))}
            <HeroArchiveLink />
            <HeroSnsIcons />
        </Box>
    );
}

