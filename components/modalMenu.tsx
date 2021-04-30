import Nav from '@/components/nav';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box
} from "@chakra-ui/react"
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { useDisclosure } from "@chakra-ui/react"
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { bg_color, text_color } from '@/styles/colorModeValue';
import Btn_hamburg from '@/components/btn_hamburg';

export default function ModalMenu() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnBottomPosition = [1, 2, 4]
    const btnLeftPosition = [1, 2, 4]

    return (
        <>
            {/* <HamburgerIcon
                w={6}
                h={6}
                pos="fixed"
                bottom={btnBottomPosition}
                left={btnLeftPosition}
                zIndex={2}
                onClick={onOpen} /> */}
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
                <ModalContent >
                    <Nav />
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </ModalBody>
                    <Btn_hamburg onHandler={onClose} isOpen={isOpen} />
                </ModalContent>

            </Modal>

        </>
    )
}

