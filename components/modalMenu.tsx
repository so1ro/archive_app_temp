import { HamburgerIcon } from '@chakra-ui/icons'

export default function ModalMenu(
    { isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean, setIsMenuOpen: Function }
) {
    return (
        <>
            <HamburgerIcon
                w={6}
                h={6}
                pos="fixed"
                bottom={[1, 2, 4]}
                left={[1, 2, 4]}
                zIndex={2}
                onClick={() => setIsMenuOpen({ isMenuOpen: !isMenuOpen })} />
        </>
    )
}

