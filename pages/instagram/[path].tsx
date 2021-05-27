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
import FsLightbox from 'fslightbox-react'

import PageShell from '@/components/PageShell'
import 'react-static-tweets/styles.css'
import { Grid, Box, useColorModeValue, Square, Portal, Heading, Text, Link, HStack } from '@chakra-ui/react'
import { card_background_color, bg_color_sns, highlight_color } from '@/styles/colorModeValue'
import NavSNS from '@/components/NavSNS'
import { css } from "@emotion/react"

export default function Twitter({ items, images, path }: { items: InstagramItem[], images: InstagramImage[], path: string }) {

    const [lightboxController, setLightboxController] = useState({ toggler: false, slide: 1 })
    const navItems = items.map(item => ({ id: item.sys.id, name: item.name, path: item.path }))

    let imageSource = []
    for (const img of images) {
        imageSource.push(img.image.url)
    }

    const author = items.find(item => item.path === path)
    const captions = images.map((img) => (
        <HStack spacing={4}>
            <Image className='avatar' width={32} height={32} src={`${author.avatar.url}`} />
            <Heading as='h6' fontSize='sm' fontWeight='normal'>
                <Text>{author.name}のインスタグラムは、<Link href={author.instagramTopUrl} color={useColorModeValue(highlight_color.l, highlight_color.d)} isExternal>こちら</Link></Text>
                {/* 正しいリンクを貼ることができない {img.instagramUrl ?
                    <Text>この写真のインスタグラムページは、<Link href={img.instagramUrl} isExternal>こちら</Link></Text> :
                    <Text>{author.name}のインスタグラムは、<Link href={author.instagramTopUrl} isExternal>こちら</Link></Text>} */}
            </Heading>
        </HStack>
    ))

    function openLightboxOnSlide(number) {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    return (
        <Box bg={useColorModeValue(bg_color_sns.l, bg_color_sns.d)} flexGrow={1}>
            <PageShell customPT={{ base: 0, lg: 0 }} customSpacing={{ base: 10, lg: 12 }}>
                <NavSNS items={navItems} />
                <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={{ base: 1, lg: 4 }} >
                    {images.map((img, i) => (
                        <Square pos='relative' key={img.sys.id} onClick={() => openLightboxOnSlide(i + 1)}>
                            <Image
                                src={`${img.image.url}?w=660&h=660&fit=fill`}
                                alt={`${img.id}のインスタグラム`}
                                width={660} height={660} quality={100} />
                        </Square>
                    ))}
                </Grid>
                <Portal>
                    <Box css={fslightboxCss}>
                        <FsLightbox
                            toggler={lightboxController.toggler}
                            slide={lightboxController.slide}
                            sources={imageSource}
                            captions={captions}
                        /></Box>
                </Portal>
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

    .fslightbox-toolbar-button:nth-child(4), .fslightbox-toolbar-button:nth-child(5) {
        display: none;
    }
    
    img.avatar { border-radius: 50%;}
`