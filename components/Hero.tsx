import { Box, Container } from '@chakra-ui/react';
import Image from 'next/image'
import HeroSnsIcons from '@/components/HeroSnsIcons';
import HeroArchiveLink from '@/components/HeroArchiveLink';
import { dailyNum } from '@/utils/helpers';

export default function Hero({ allHeroImg }) {

    const shapedAllImg = allHeroImg.map(pair => pair.imageCollection.items.sort((a, b) => a.width - b.width))

    return (
        <Box pos='relative'>
            {shapedAllImg.map((pair, i) => (
                (i === dailyNum(shapedAllImg)) &&
                <Box key={i}>
                    {pair.map((img, j) => (
                        <Container key={j}
                            h='100vh'
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

