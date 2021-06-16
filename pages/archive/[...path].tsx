import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from "next"
import NextLink from 'next/link'
import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { useArchiveState } from "@/context/useArchiveState"
import { useMediaQuery } from '@/utils/useMediaQuery'

import { query_archiveRoute, query_allArchives } from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful'
import { format, parseISO, compareDesc } from "date-fns"

import {
    VStack, Box, Flex, Grid, List, ListItem, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useColorModeValue, HStack, Center, Link,
} from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChevronRightIcon } from '@chakra-ui/icons'

import Video from '@/components/Video'
import VideoThumbnail from '@/components/VideoThumbnail';
import ArchiveDrawer from "@/components/ArchiveDrawer"
import ArchiveSideNav from '@/components/ArchiveSideNav'

import LoadingSpinner from '@/components/Spinner'
import { highlight_color } from '@/styles/colorModeValue'
import ArchiveSearch from '@/components/ArchiveSearch'


export default function ArchiveRoute({
    filteredDescArchive,
    currentPaths,
    pathObj }: {
        filteredDescArchive: AllArchivesInterface[],
        currentPaths: string[],
        pathObj: ArchivePath[]
    }) {

    // Hook
    const { user, error, isLoading } = useUser()
    const router = useRouter()
    const {
        isMetadataLoading,
        subscription_state,
        One_Pay_Detail,
        error_metadata } = useUserMetadata()
    const {
        isSeaching,
        searchedArchiveResult,
        isVideoMode,
        setIsVideoMode,
        isArchiveDesc,
        setIsArchiveDesc } = useArchiveState()
    const isLargerThan992 = useMediaQuery("(min-width: 992px)")

    // Archive Filtering
    const filteredAscArchive = [...filteredDescArchive].sort((a, b) => compareDesc(parseISO(b.publishDate), parseISO(a.publishDate)))
    const filteredArchive = isArchiveDesc ? filteredDescArchive : filteredAscArchive
    const searchedArchive = searchedArchiveResult?.map(archive => archive.item)
    const selectedArchive = !isSeaching ? filteredArchive : searchedArchive

    // Effect for setIsVideoMode
    useEffect(() => {
        // Only when you find router.query.id changing route, set isVideoMode true 
        router.query.id && setIsVideoMode({ isVideoMode: true })
    }, [router.query.id])

    useEffect(() => {
        // Always before changing route, set isVideoMode false 
        const handleHistoryChange = (url, { shallow }) => { !url.includes('id=') && setIsVideoMode({ isVideoMode: false }) }
        router.events.on('routeChangeStart', handleHistoryChange)
        return () => { router.events.off('routeChangeStart', handleHistoryChange) }
    }, [])

    // Functions
    const sortHandler = async (direction) => {
        direction === 'desc' ? setIsArchiveDesc({ isArchiveDesc: true }) : setIsArchiveDesc({ isArchiveDesc: false })
    }

    // Miscellaneous
    const currentRoot = currentPaths.join('/')
    const breadCrumbPaths = () => {
        if (currentPaths.length === 2) return [pathObj.find(obj => obj.id === currentPaths[0]).categoryName, currentPaths[1]]
        return currentPaths
    }
    const arrowSize = { base: 6, md: 8 }
    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)

    // Components
    const BreadcrumbNav = ({ paths }) => (
        <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize='md'
            mb={{ base: 3, sm: 0 }}>
            {paths.map((path, i) => (
                <BreadcrumbItem key={i}>
                    <BreadcrumbLink textDecoration='none' cursor='default'>{path}</BreadcrumbLink>
                </BreadcrumbItem>
            ))}
        </Breadcrumb>
    )


    const SortArrow = () => (
        <HStack>
            <ChevronDownIcon
                onClick={() => sortHandler('desc')}
                w={arrowSize} h={arrowSize}
                color={isArchiveDesc && highLightColor} />
            <ChevronUpIcon
                onClick={() => sortHandler('asc')}
                w={arrowSize} h={arrowSize}
                mr={8}
                color={!isArchiveDesc && highLightColor} />
        </HStack>
    )

    const ErrowMessage = () => (
        <Center w='full' px={6}>
            <Box>アーカイブのご購入を確認できませんでした。ご購入は<NextLink href='/archive' passHref><Link className='active'>こちら</Link></NextLink>から。</Box>
        </Center>
    )

    // Main Component
    if (user && ((subscription_state === 'subscribe') || !!One_Pay_Detail)) {
        return (
            <>
                {!isVideoMode && !isLargerThan992 && <ArchiveDrawer pathObj={pathObj} />}
                {!isVideoMode &&
                    <Flex flexGrow={1} direction='row'>
                        <Grid templateColumns={{ base: '1fr', lg: '240px 1fr', xl: '300px 1fr' }} w='full'>
                            {isLargerThan992 && <Box p={8} >
                                <ArchiveSideNav pathObj={pathObj} onCloseDrawer={null} />
                            </Box>}
                            <VStack spacing={8} p={{ base: 4, md: 8 }} >
                                <Flex justify={{ base: 'none', sm: 'space-between' }} flexDirection={{ base: 'column', sm: 'row' }} w='full' align='center'>
                                    <BreadcrumbNav paths={breadCrumbPaths()} />
                                    <HStack spacing={{ base: 3, sm: 6, md: 8 }}>
                                        <SortArrow />
                                        <ArchiveSearch filteredArchive={filteredArchive} />
                                    </HStack>
                                </Flex>
                                {!!selectedArchive.length ?
                                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', '3xl': 'repeat(3, 1fr)' }} gap={{ base: 4, md: 6 }} cursor='pointer'>
                                        {selectedArchive.map((archive) => <VideoThumbnail archive={archive} inVideoCompo={false} currentRoot={currentRoot} key={archive.sys.id} setSkipTime={null} playing={false} />)}
                                    </Grid>
                                    : <Flex flexGrow={1}><Center>該当する動画は見つかりませんでした。</Center></Flex>
                                }
                            </VStack>
                        </Grid>
                    </Flex>}
                {isVideoMode && <Video selectedArchive={selectedArchive} currentRoot={currentRoot} />}
            </>
        )
    }
    else if (isLoading || isMetadataLoading) {
        return (
            <LoadingSpinner />
        )
    } else {
        return (
            <>
                {(subscription_state !== 'subscribe') &&
                    <Flex flexGrow={1} direction='row'>
                        <ErrowMessage />
                    </Flex>}
            </>
        )
    }
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

    let filteredDescArchive
    // ex: archive/season/春
    if (params.path.length === 2) {
        const key = params.path[0]
        const value = params.path[1]
        filteredDescArchive = allArchives.filter(data => data[key]?.includes(value))
    }
    if (params.path.length === 1) {
        // archive/すべて
        if (params.path[0] === 'すべて') filteredDescArchive = allArchives
        // ex: archive/名人
        else filteredDescArchive = allArchives.filter(data => data.category?.includes(params.path[0]))
    }

    return {
        props: { filteredDescArchive, currentPaths: params.path, pathObj: items[0].archiveRouteArray },
        revalidate: 1,
    }
}