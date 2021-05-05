import { Stack } from "@chakra-ui/react"
import { TwitterIcon, InstagramIcon, MailIcon } from '@/styles/icons';
import { useColorMode } from "@chakra-ui/react"
import { MotionIconStack } from '@/components/Chakra_Framer/element';
import { nav_link_variants } from '@/components/Chakra_Framer/variants';

export default function SnsIcons() {

    const { colorMode, toggleColorMode } = useColorMode()
    const colorHnadler = (mode) => mode === 'light' ? "#000" : "#fff"

    return (
        <MotionIconStack
            direction={["row"]}
            spacing={8}
            pt={8}
            initial="hidden"
            animate="visible"
            variants={nav_link_variants}
        >
            <TwitterIcon width={6} height={6} color={colorHnadler(colorMode)} />
            <InstagramIcon width={6} height={6} color={colorHnadler(colorMode)} />
            <MailIcon width={6} height={6} color={colorHnadler(colorMode)} />
        </MotionIconStack>
    );
}
