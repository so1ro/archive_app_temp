import Image from 'next/image'
import { GetStaticProps, GetStaticPaths } from "next"
import {
    query_instagram,
    query_instagram_image_official,
    query_instagram_image_yappi,
    query_instagram_image_chansho,
    query_instagram_image_miyashi,
} from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful'

import PageShell from '@/components/PageShell'
import 'react-static-tweets/styles.css'
import { Grid, Box, Square, useColorModeValue } from '@chakra-ui/react'
import { card_background_color, bg_color_sns, highlight_color } from '@/styles/colorModeValue'
import NavSNS from '@/components/NavSNS'

export default function Twitter({ items, images }) {
    console.log('items:', items)
    console.log('images:', images)

    return (
        <Box bg={useColorModeValue(bg_color_sns.l, bg_color_sns.d)} flexGrow={1}>
            <PageShell customPT={{ base: 0, lg: 0 }} customSpacing={{ base: 10, lg: 12 }}>
                <NavSNS items={items} />
                <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={{ base: 1, lg: 4 }} >
                    {images.map(img => (
                        <Square key={img.sys.id} pos='relative'>
                            <Image
                                src={`${img.image.url}?w=600&h=600&fit=fill`}
                                alt={`${img.id}のインスタグラム`}
                                width={600}
                                height={600} quality={100} />
                        </Square>
                    ))}
                </Grid>
            </PageShell>
        </Box>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    const { instagramCollection } = await fetchContentful(query_instagram)
    const paths = instagramCollection.items.map((col) => ({
        params: { path: col.path }
    }))

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { instagramOfficialCollection } = await fetchContentful(query_instagram_image_official)
    const { instagramUser1Collection } = await fetchContentful(query_instagram_image_yappi)
    const { instagramUser2Collection } = await fetchContentful(query_instagram_image_chansho)
    const { instagramUser3Collection } = await fetchContentful(query_instagram_image_miyashi)
    const allInstagramImages = [
        ...instagramOfficialCollection.items,
        ...instagramUser1Collection.items,
        ...instagramUser2Collection.items,
        ...instagramUser3Collection.items
    ]

    const { instagramCollection } = await fetchContentful(query_instagram)
    const instagraImages = await allInstagramImages.filter(col => col.id === params.path)

    return {
        props: { items: instagramCollection.items, images: instagraImages },
        revalidate: 1,
    }
}