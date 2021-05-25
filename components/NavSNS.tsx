import { Box, Link, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router'
import NextLink from 'next/link';

export default function NavSNS({ items }: { items: TwitterCollectionItems[] }) {

    const router = useRouter()
    const { path } = router.query
    // Twitter path check!!!!
    const root = router.pathname.includes('twitter') ? 'twitter' : 'instagram'

    return (
        <HStack
            flexWrap='wrap'
            spacing={{ base: 4, md: 6 }}
            justify='center'
            px='0'
            pt={{ base: 12, lg: 16 }}
            pb={{ base: 0, lg: 6 }}>
            { items.map(item => (
                (<NextLink href={`/${root}/${item.path}`} key={item.sys.id} passHref>
                    <Link fontSize={{ base: 'sm', md: 'md' }} className={path === item.path ? 'active' : ''}>{item.name}</Link>
                </NextLink>)
            ))
            }</HStack>
    )
}