import { useRef } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    useDisclosure,
} from "@chakra-ui/react"

import ArchiveSideNav from '@/components/ArchiveSideNav'

export default function ArchiveDrawer({ pathObj }: { pathObj: ArchivePath[] }) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()
    const btnBottomLeftPosition = [4, 6]

    return (
        <>
            <Button
                ref={btnRef}
                colorScheme="teal"
                onClick={onOpen}
                display={{ base: 'inline-flex', lg: 'none' }}>
                Open
            </Button>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton top={null} right={null} bottom={btnBottomLeftPosition} left={btnBottomLeftPosition} />
                    <DrawerHeader>もくじ</DrawerHeader>
                    <DrawerBody>
                        <ArchiveSideNav pathObj={pathObj} onClose={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

