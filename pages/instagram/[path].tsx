import { useState } from 'react';
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
import { Grid, Box, useColorModeValue, Square, Portal, Heading, Text, Link, HStack } from '@chakra-ui/react'
import { highlight_color } from '@/styles/colorModeValue'
import NavSNS from '@/components/NavSNS'
import { css } from "@emotion/react"

export default function Instagram({ items, images, path }: { items: InstagramItem[], images: InstagramImage[], path: string }) {

    const navItems = items.map(item => ({ id: item.sys.id, name: item.name, path: item.path }))

    let imageSource = []
    for (const img of images) {
        imageSource.push(img.image.url)
    }

    const author = items.find(item => item.path === path)

    return (
        <PageShell customPT={{ base: 0, lg: 0 }} customSpacing={{ base: 10, lg: 12 }}>
            <NavSNS items={navItems} />
            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={{ base: 1, lg: 4 }} >
                {images.map((img) => (
                    <Link href={img.instagramUrl ?? author.instagramTopUrl} key={img.sys.id} isExternal >
                        <Square pos='relative' >
                            <Image
                                src={`${img.image.url}?w=660&h=660&fit=fill`}
                                alt={`${img.id}のインスタグラム`}
                                width={660} height={660} quality={100} />
                        </Square>
                    </Link>
                ))}
            </Grid>
        </PageShell>
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
    const path = params.path

    return {
        props: { items: instagramCollection.items, images: instagraImages, path },
        revalidate: 1,
    }
}


const fslightboxCss = css`
    .fslightbox-caption {
        z-index: 9;
    }

    .fslightbox-toolbar-button:nth-of-type(1), .fslightbox-toolbar-button:nth-of-type(4), .fslightbox-toolbar-button:nth-of-type(5) {
        display: none;
    }
    
    img.avatar { border-radius: 50%;}
`