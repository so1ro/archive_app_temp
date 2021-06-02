import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from "next"
import { query_archiveRoute, query_allArchives } from "@/hook/contentful-queries";
import { fetchContentful } from '@/hook/contentful'

import { Box, Grid, Spinner } from '@chakra-ui/react';
import ArchiveDrawer from "@/components/ArchiveDrawer";
import ArchiveSideNav from '@/components/ArchiveSideNav';

import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"

export default function ArchiveRoute({
    filteredData,
    pathObj }: {
        filteredData: AllArchivesInterface[],
        pathObj: ArchivePath[]
    }) {
    // console.log('paths:', pathObj)
    // console.log('filteredData:', filteredData)

    const { user, error, isLoading } = useUser()
    const { User_Detail, isMetadataLoading, subscription_state, Stripe_Customer_Detail, error_metadata } = useUserMetadata()
    const router = useRouter()

    if (user && (subscription_state === 'subscribe')) {
        return (
            <>
                <ArchiveDrawer pathObj={pathObj} />
                <Grid templateColumns={{ base: '1fr', lg: '240px 1fr' }} >
                    <Box p={4} display={{ base: 'none', lg: 'block' }}>
                        <ArchiveSideNav pathObj={pathObj} onCloseDrawer={null} />
                    </Box>
                    <Box>Archive Route</Box>
                </Grid>
            </>
        )

    } else if (typeof window !== 'undefined') {
        router.push(`/archive`)
        return (
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            />
        )
    }
    return (
        <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
        />
    )
}


export const getStaticPaths: GetStaticPaths = async () => {

    const { archivePathCollection: { items } } = await fetchContentful(query_archiveRoute)
    let paths = []
    items[0].archiveRouteArray.map((obj: ArchivePath) => {
        if (!obj.paths) paths.push({ params: { path: [obj.categoryName] } })
        else obj.paths.map(path => paths.push({ params: { path: [obj.id, path] } }))
    })

    return { paths, fallback: false }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { kasumibroVideoCollection: { items: allArchives } } = await fetchContentful(query_allArchives)
    const { archivePathCollection: { items } } = await fetchContentful(query_archiveRoute)

    let filteredData
    // ex: archive/season/春
    if (params.path.length === 2) {
        const key = params.path[0]
        const value = params.path[1]
        filteredData = allArchives.filter(data => data[key]?.includes(value))
    }
    if (params.path.length === 1) {
        // archive/すべて
        if (params.path[0] === 'すべて') filteredData = allArchives
        // ex: archive/名人
        else filteredData = allArchives.filter(data => data.category?.includes(params.path[0]))
    }

    return {
        props: { filteredData, pathObj: items[0].archiveRouteArray },
        revalidate: 1,
    }
}