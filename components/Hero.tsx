import { Box, Container } from '@chakra-ui/react'
import Image from 'next/image'
import HeroSnsIcons from '@/components/HeroSnsIcons'
import HeroArchiveLink from '@/components/HeroArchiveLink'
import { useWindowSizeOrientation } from '@/utils/useWindowSize'

export default function Hero({ todayImgPair }) {

    const { height: innerHeight } = useWindowSizeOrientation()

    return (
        <Box pos='relative'>
            <Box>
                {todayImgPair.map((img, i) => (
                    <Container key={i}
                        h={`${innerHeight}px`}
                        zIndex={'-1'}
                        d={i === 0 ? { base: 'block', lg: 'none' } : { base: 'none', lg: 'block' }}>
                        <Image src={img.url}
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                            priority={true}
                        />
                    </Container>
                ))}
            </Box>
            <HeroArchiveLink />
            <HeroSnsIcons />
        </Box>
    )
}

