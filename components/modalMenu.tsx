import { HamburgerIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"


export default function ModalMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <HamburgerIcon w={6} h={6} onClick={onOpen} />

            <Modal
                onClose={onClose}
                isOpen={isOpen}
                motionPreset="slideInBottom"
                isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}