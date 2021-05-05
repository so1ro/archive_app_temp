import { Stack, Link } from '@chakra-ui/react';
import { nav_links } from '@/data/nav_links';
import ActiveLink from '@/components/ActiveLink';

export default function NavLinks() {
    return (
        <Stack spacing={4} mr={4} isInline alignItems="center">
            {nav_links.map(link => (
                <ActiveLink href={link.href} key={link.key}>
                    <Link>{link.text}</Link>
                </ActiveLink>
            ))}
        </Stack>
    );
}