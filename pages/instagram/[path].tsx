import { useRouter } from 'next/router'
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

import { SRLWrapper } from 'simple-react-lightbox-pro'

export default function Instagram({ items, images, path }: { items: InstagramItem[], images: InstagramImage[], path: string }) {

    const router = useRouter()
    const navItems = items.map(item => ({ id: item.sys.id, name: item.name, path: item.path }))
    const author = items.find(item => item.path === path)
    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const captions = images.map((img, i) => (
        {
            id: i, caption: (<HStack spacing={3} key={i}>
                <Image className='avatar' width={32} height={32} src={`${author.avatar.url}`} />
                <Heading as='h6' fontSize='sm' fontWeight='normal'>
                    {/* <Text>{author.name}のインスタグラムは、<Link href={author.instagramTopUrl} color={highLightColor} isExternal>こちら</Link></Text> */}
                    {img.instagramUrl ?
                        <Box className='SRLCustomCaption'>この写真のインスタグラムページは、<Link className='SRLCustomCaption' href={img.instagramUrl} color={highLightColor} isExternal>こちら</Link></Box> :
                        <Box className='SRLCustomCaption'>{author.name}のインスタグラムは、<Link className='SRLCustomCaption' href={author.instagramTopUrl} color={highLightColor} isExternal>こちら</Link></Box>}
                </Heading>
            </HStack>)
        }
    ))
    const options = {
        settings: {
            autoplaySpeed: 0,
        },
        buttons: {
            showAutoplayButton: false,
            showDownloadButton: false,
            showFullscreenButton: false,
            showThumbnailsButton: false,
        },
        caption: {
        }
    }

    return (
        <PageShell customPT={{ base: 0, lg: 0 }} customSpacing={{ base: 10, lg: 12 }}>
            <NavSNS items={navItems} />
            <SRLWrapper customCaptions={captions} options={options} key={router.asPath}>
                <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={{ base: 1, lg: 4 }} >
                    {images.map((img) => (
                        <Square pos='relative' key={img.sys.id}>
                            <a href={img.image.url}>
                                <img src={`${img.image.url}?w=660&h=660&fit=fill`} alt={`${img.id}のインスタグラム`} />
                            </a>
                        </Square>
                    ))}
                </Grid>
            </SRLWrapper>
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