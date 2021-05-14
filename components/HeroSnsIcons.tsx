import { Box, VStack, useMediaQuery } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MotionIconBox } from '@/components/Chakra_Framer/element';
import { hero_icon_twitter_variants, hero_icon_instagram_variants } from '@/components/Chakra_Framer/variants';
import { TwitterIcon, InstagramIcon } from '@/styles/icons';

export default function HeroSnsIcons() {
    const [isLargerThan992] = useMediaQuery("(min-width: 992px)")

    const HeroSnsIconsBox = ({ children, href, variants }) => {
        return (
            <Box>
                <NextLink href={href}>
                    <MotionIconBox
                        whileHover={{ scale: 1.1 }}
                        initial={isLargerThan992 ? "hidden" : ''}
                        animate={isLargerThan992 ? "visible" : ''}
                        variants={variants}>
                        {children}
                    </MotionIconBox>
                </NextLink>
            </Box>
        );
    };

    return (
        <VStack
            spacing={5}
            pos='absolute'
            bottom={{ base: 6, lg: 16 }}
            right={{ base: 4, lg: 8 }}>
            {<HeroSnsIconsBox href='/twitter' variants={hero_icon_twitter_variants}> <TwitterIcon width={8} height={8} color='#FFF' /> </HeroSnsIconsBox>}
            {<HeroSnsIconsBox href='/instagram' variants={hero_icon_instagram_variants}> <InstagramIcon width={8} height={8} color='#FFF' /> </HeroSnsIconsBox>}
        </VStack>
    );
}