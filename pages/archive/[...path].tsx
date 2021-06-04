import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from "next"
import { query_archiveRoute, query_allArchives } from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful'
import Image from "next/image"
import { format, parseISO, compareAsc, compareDesc } from "date-fns"

import { VStack, Box, Flex, Grid, List, ListItem, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useColorModeValue, baseStyle, HStack, Center } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChevronRightIcon } from '@chakra-ui/icons'
import ArchiveDrawer from "@/components/ArchiveDrawer"
import ArchiveSideNav from '@/components/ArchiveSideNav'

import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import LodingSpinner from '@/components/Spinner'
import { highlight_color } from '@/styles/colorModeValue'
import ArchiveSearch from '@/components/ArchiveSearch';

export default function ArchiveRoute({
    filteredDescArchive,
    currentPaths,
    pathObj }: {
        filteredDescArchive: AllArchivesInterface[],
        currentPaths: string[],
        pathObj: ArchivePath[]
    }) {

    const { user, error, isLoading } = useUser()
    const { User_Detail, isMetadataLoading, subscription_state, Stripe_Customer_Detail, error_metadata } = useUserMetadata()
    const router = useRouter()

    // State
    const isVideoMode = !!router.query.v
    const [{ isArchiveDesc }, setIsArchiveDesc] = useState<{ isArchiveDesc: boolean }>({ isArchiveDesc: true })
    const [{ searchedArchiveResult }, setSearchedArchiveResult] = useState<{ searchedArchiveResult: SearchedArchiveResultInterface[] }>({ searchedArchiveResult: [] })
    const [{ isSeaching }, setIsSeaching] = useState<{ isSeaching: boolean }>({ isSeaching: false })

    // Archive Filtering
    const filteredAscArchive = [...filteredDescArchive].sort((a, b) => compareDesc(parseISO(b.publishDate), parseISO(a.publishDate)))
    const filteredArchive = isArchiveDesc ? filteredDescArchive : filteredAscArchive
    const searchedArchive = searchedArchiveResult?.map(archive => archive.item)
    const selectedArchive = !isSeaching ? filteredArchive : searchedArchive

    // Effect
    useEffect(() => {
        console.log('router.query.v:', router.query.v)
    }, [router.query.v])

    // Functions
    const sortHandler = async (direction) => {
        direction === 'desc' ? setIsArchiveDesc({ isArchiveDesc: true }) : setIsArchiveDesc({ isArchiveDesc: false })
    }

    // miscellaneous
    const currentRoot = currentPaths.join('/')
    const breadCrumbPaths = () => {
        if (currentPaths.length === 2) return [pathObj.find(obj => obj.id === currentPaths[0]).categoryName, currentPaths[1]]
        return currentPaths
    }
    const arrowSize = { base: 6, md: 8 }


    if (user && (subscription_state === 'subscribe')) {
        return (
            <>
                {!isVideoMode && <ArchiveDrawer pathObj={pathObj} />}
                {!isVideoMode &&
                    <Flex flexGrow={1} direction='row'>
                        <Grid templateColumns={{ base: '1fr', lg: '240px 1fr', xl: '300px 1fr' }} w='full'>
                            <Box
                                p={8}
                                display={{ base: 'none', lg: 'block' }}
                            // bg={useColorModeValue(archiveSideNav_bg_color.l, archiveSideNav_bg_color.d)}
                            >
                                <ArchiveSideNav pathObj={pathObj} onCloseDrawer={null} />
                            </Box>
                            {/* Contennt */}
                            <VStack spacing={8} p={{ base: 4, md: 8 }} >
                                <Flex justify={{ base: 'none', sm: 'space-between' }} flexDirection={{ base: 'column', sm: 'row' }} w='full' align='center'>
                                    <Breadcrumb
                                        spacing="8px"
                                        separator={<ChevronRightIcon color="gray.500" />}
                                        fontSize='md'
                                        mb={{ base: 3, sm: 0 }}>
                                        {breadCrumbPaths().map((path, i) => (
                                            <BreadcrumbItem key={i}>
                                                <BreadcrumbLink textDecoration='none' cursor='default'>{path}</BreadcrumbLink>
                                            </BreadcrumbItem>
                                        ))}
                                    </Breadcrumb>
                                    <HStack spacing={{ base: 3, sm: 6, md: 8 }}>
                                        <HStack>
                                            <ChevronDownIcon
                                                onClick={() => sortHandler('desc')}
                                                w={arrowSize} h={arrowSize}
                                                color={isArchiveDesc && useColorModeValue(highlight_color.l, highlight_color.d)} />
                                            <ChevronUpIcon
                                                onClick={() => sortHandler('asc')}
                                                w={arrowSize} h={arrowSize}
                                                mr={8}
                                                color={!isArchiveDesc && useColorModeValue(highlight_color.l, highlight_color.d)} />
                                        </HStack>
                                        <ArchiveSearch
                                            filteredArchive={filteredArchive}
                                            setSearchedArchiveResult={setSearchedArchiveResult}
                                            setIsSeaching={setIsSeaching} />
                                    </HStack>
                                </Flex>
                                {!!selectedArchive.length ?
                                    <Grid
                                        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', '2xl': 'repeat(3, 1fr)' }}
                                        gap={{ base: 4, md: 6 }}>
                                        {selectedArchive.map((archive) => (
                                            <Grid
                                                key={archive.sys.id}
                                                templateColumns={{ base: "repeat(2, 1fr)", md: "1fr" }}
                                                gap={{ base: 4, md: 1 }}
                                                onClick={() => { router.push(`${currentRoot}/?v=${archive.vimeoUrl}`, null, { shallow: true }) }}
                                            >
                                                <Box overflow="hidden">
                                                    <Image
                                                        src={archive.thumbnail.url}
                                                        alt="Picture of the author"
                                                        width={640}
                                                        height={360}
                                                    />
                                                </Box>
                                                <Box>
                                                    <List m={0} p={0} fontSize={['xs', 'sm', 'md']}>
                                                        <ListItem>{archive.title}</ListItem>
                                                        <ListItem color="#585858" size="10px">
                                                            {format(parseISO(archive.publishDate), "yyyy/MM/dd")}
                                                        </ListItem>
                                                    </List>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid> :
                                    <Flex flexGrow={1}><Center>該当する動画は見つかりませんでした。</Center></Flex>
                                }
                            </VStack>
                        </Grid>
                    </Flex>}
            </>
        )

    } else if (typeof window !== 'undefined') {
        router.push(`/archive`)
        return <LodingSpinner />
    }
    return <LodingSpinner />
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