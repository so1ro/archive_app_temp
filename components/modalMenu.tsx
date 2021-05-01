import Nav from '@/components/nav';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/react"
import { bg_color } from '@/styles/colorModeValue';
import Btn_hamburg from '@/components/btn_hamburg';
import { motion } from "framer-motion"

export default function ModalMenu() {

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
                <ModalContent bg={useColorModeValue(bg_color.l, bg_color.d)}>
                    <Nav />
                    {/* <ModalCloseButton /> */}

                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        pos='absolute'
                        w='100vw'
                        h='100vh'>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Flex>

                    <Btn_hamburg onHandler={onClose} isOpen={isOpen} />
                </ModalContent>
            </Modal>

        </>
    )
}

