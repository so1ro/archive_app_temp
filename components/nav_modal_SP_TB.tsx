// /** @jsxImportSource @emotion/react */
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

export default function Nav_Modal_SP_TB() {

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
                        <ActiveLink href='/'><Link onClick={onClose}>トップ</Link></ActiveLink>
                        <ActiveLink href='/archive'><Link onClick={onClose}>アーカイブ</Link></ActiveLink>
                        <ActiveLink href='/twitter'><Link onClick={onClose}>ツイッター</Link></ActiveLink>
                        <ActiveLink href='/instagram'><Link onClick={onClose}>インスタグラム</Link></ActiveLink>
                    </Flex>
                    <Btn_hamburg onHandler={onClose} isOpen={isOpen} />
                </ModalContent>
            </Modal>

        </>
    )

}
