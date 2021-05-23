import { Box, Link, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router'
import NextLink from 'next/link';

export default function NavTwitter({ items }: { items: TwitterCollectionItems[] }) {

    const router = useRouter()
    const { path } = router.query
    const isTwitter = () => router.pathname.includes('twitter')

    return (
        <HStack spacing={6} justify='center' pt={{ base: 12, lg: 24 }} pb={{ base: 6, lg: 12 }}>{
            items.map(item => (
                (<NextLink href={`/twitter/${item.path}`} key={item.sys.id} passHref>
                    <Link className={path === item.path ? 'active' : ''}>{item.name}</Link>
                </NextLink>)
            ))
        }</HStack>
    )
}