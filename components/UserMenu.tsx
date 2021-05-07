import NextLink from 'next/link';
import { UserIcon } from '@/styles/icons';
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Button, Link } from '@chakra-ui/react';

export default function UserMenu() {
    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<UserIcon width={7} height={7} />}
                bg='none'
                _expanded={{ bg: "none" }}
                _focus={{ bg: "none" }}
            />
            <MenuList>
                <MenuItem><NextLink href="/account" passHref>アカウント</NextLink></MenuItem>
                <MenuItem><Link href="/api/auth/logout" w='full'>ログアウト</Link></MenuItem>
            </MenuList>
        </Menu>
    );
}