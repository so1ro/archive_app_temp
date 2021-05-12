import { Box, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MotionIconBox } from '@/components/Chakra_Framer/element';
import { hero_icon_twitter_variants, hero_icon_instagram_variants } from '@/components/Chakra_Framer/variants';
import { TwitterIcon, InstagramIcon } from '@/styles/icons';

export default function HeroSnsIcons() {
    return (
        <VStack
            spacing={5}
            pos='absolute'
            bottom={{ base: 6, lg: 16 }}
            right={{ base: 4, lg: 8 }}>
            <Box>
                <NextLink href={'/twitter'}>
                    <MotionIconBox
                        whileHover={{ scale: 1.1 }}
                        initial="hidden"
                        animate="visible"
                        variants={hero_icon_twitter_variants}>
                        {/* <Box> */}
                        <TwitterIcon
                            width={8}
                            height={8}
                            color='#FFF' />
                        {/* </Box> */}
                    </MotionIconBox>
                </NextLink>
            </Box>
            <Box>
                <NextLink href={'/instagram'}>
                    <MotionIconBox
                        whileHover={{ scale: 1.1 }}
                        initial="hidden"
                        animate="visible"
                        variants={hero_icon_instagram_variants}>
                        {/* <Box> */}
                        <InstagramIcon
                            width={8}
                            height={8}
                            color='#FFF' />
                        {/* </Box> */}
                    </MotionIconBox>
                </NextLink>
            </Box>
        </VStack>
    );
}