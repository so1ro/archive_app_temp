// /** @jsxImportSource @emotion/react */
import Nav from '@/components/nav';
import NextLink from 'next/link';

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
import Btn_hamburg from '@/components/btn_hamburg';

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
                <ModalContent bg={useColorModeValue(bg_color.l, bg_color.d)} m={0}>
                    <Nav />
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        pos='absolute'
                        w='100vw'
                        h='100vh'>
                        <NextLink href='/' passHref><Link onClick={onClose}>トップ</Link></NextLink>
                        <NextLink href='/archive' passHref><Link onClick={onClose}>アーカイブ</Link></NextLink>
                        <NextLink href='/twitter' passHref><Link onClick={onClose}>ツイッター</Link></NextLink>
                        <NextLink href='/instagram' passHref><Link onClick={onClose}>インスタグラム</Link></NextLink>
                    </Flex>
                    <Btn_hamburg onHandler={onClose} isOpen={isOpen} />
                </ModalContent>
            </Modal>

        </>
    )

}
