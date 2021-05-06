import Nav from '@/components/Nav';
import ActiveLink from '@/components/ActiveLink';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    Flex,
    Box,
    Stack,
    VStack,
} from "@chakra-ui/react"
import {
    useDisclosure,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react"
import { MotionLink } from '@/components/Chakra_Framer/element';
import { nav_link_variants } from '@/components/Chakra_Framer/variants';

import Btn_hamburg from '@/components/BtnHamburg';
import SnsIcons from '@/components/SnsIcons';
import { bg_color } from '@/styles/colorModeValue';
import { nav_links } from '@/data/nav_links';


export default function NavModalSPTB() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box d={{ base: "block", lg: "none" }}>
            <Btn_hamburg onHandler={onOpen} isOpen={isOpen} />
            <Modal
                onClose={onClose}
                isOpen={isOpen}
                motionPreset="none"
                size="full"
                isCentered>
                <ModalOverlay
                    bg={useColorModeValue(bg_color.l, bg_color.d)}
                />
                <ModalContent bg={useColorModeValue(bg_color.l, bg_color.d)} m={0}>
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        pos='absolute'
                        w='100vw'
                        h='100vh'>
                        <VStack spacing={2}>
                            {nav_links.map(link => (
                                <ActiveLink href={link.href} key={link.key}>
                                    <MotionLink
                                        onClick={onClose}
                                        initial="hidden"
                                        animate="visible"
                                        variants={nav_link_variants}
                                        fontSize="xl"
                                    >{link.text}</MotionLink>
                                </ActiveLink>
                            ))}
                            <SnsIcons animation={true} type={'NavModal'} />
                        </VStack>
                    </Flex>
                    <Btn_hamburg onHandler={onClose} isOpen={isOpen} />
                </ModalContent>
            </Modal>
        </Box>
    )
}
