import Nav from '@/components/Nav';
import ActiveLink from '@/components/ActiveLink';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    Flex,
    Link
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/react"
import { bg_color } from '@/styles/colorModeValue';
import Btn_hamburg from '@/components/Btn_hamburg';
import { nav_links } from '@/data/nav_links';

export default function NavModalSPTB() {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
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
                    <Nav />
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        pos='absolute'
                        w='100vw'
                        h='100vh'>
                        {nav_links.map(link => (
                            <ActiveLink href={link.href} key={link.key}>
                                <Link onClick={onClose}>{link.text}</Link>
                            </ActiveLink>
                        ))}
                    </Flex>
                    <Btn_hamburg onHandler={onClose} isOpen={isOpen} />
                </ModalContent>
            </Modal>
        </>
    )
}
