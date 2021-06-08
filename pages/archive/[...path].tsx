import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from "next"
import NextLink from 'next/link'

import { query_archiveRoute, query_allArchives } from "@/hook/contentful-queries"
import { fetchContentful } from '@/hook/contentful'
import Image from "next/image"
import { format, parseISO, compareAsc, compareDesc } from "date-fns"
import TimeFormat from 'hh-mm-ss'

import {
    VStack, Box, Flex, Grid, List, ListItem, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useColorModeValue, baseStyle, HStack, Center, Link, Stack, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
} from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, RepeatIcon } from '@chakra-ui/icons'
import { ChevronRightIcon } from '@chakra-ui/icons'
import ArchiveDrawer from "@/components/ArchiveDrawer"
import ArchiveSideNav from '@/components/ArchiveSideNav'

import { useUser } from "@auth0/nextjs-auth0"
import { useUserMetadata } from "@/context/useUserMetadata"
import { useArchiveState } from "@/context/useArchiveState"
import LodingSpinner from '@/components/Spinner'
import { highlight_color } from '@/styles/colorModeValue'
import ArchiveSearch from '@/components/ArchiveSearch'
import VideoVimeo from '@/components/VideoVimeo'
import { css } from "@emotion/react"

//Contentful
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'


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
    const [{ isVideoMode }, setIsVideoMode] = useState<{ isVideoMode: boolean }>({ isVideoMode: false })
    const [{ isArchiveDesc }, setIsArchiveDesc] = useState<{ isArchiveDesc: boolean }>({ isArchiveDesc: true })
    const [{ searchedArchiveResult }, setSearchedArchiveResult] = useState<{ searchedArchiveResult: SearchedArchiveResultInterface[] }>({ searchedArchiveResult: [] })
    const [{ isSeaching }, setIsSeaching] = useState<{ isSeaching: boolean }>({ isSeaching: false })

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

    // miscellaneous
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


    const VideoThumnail = ({ archive, inVideoCompo }) => (
        <Grid
            templateColumns={!inVideoCompo ? { base: "repeat(2, 1fr)", md: "1fr" } : { base: "1fr" }}
            gap={{ base: 4, md: 1 }}
            onClick={() => {
                router.push(`${currentRoot}/?id=${archive.sys.id}`, null, { shallow: true })
            }}
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
                    <ListItem fontSize={inVideoCompo && 'xs'}>{archive.title}</ListItem>
                    {!inVideoCompo && <ListItem color="#585858" size="10px">
                        {format(parseISO(archive.publishDate), "yyyy/MM/dd")}
                    </ListItem>}
                </List>
            </Box>
        </Grid>
    )


    const ErrowMessage = () => (
        <Center w='full' px={6}>
            <Box>アーカイブのご購入を確認できませんでした。ご購入は<NextLink href='/archive' passHref><Link className='active'>こちら</Link></NextLink>から。</Box>
        </Center>
    )

    const Video = () => {

        // Find Video
        const currentId = router.query.id as string
        const currentDisplayArchive = selectedArchive.find(archive => archive.sys.id === currentId)

        // Hook
        const { isAutoplay, setIsAutoplay } = useArchiveState()

        //State
        const [{ skipTime }, setSkipTime] = useState<{ skipTime: number }>({ skipTime: 0 })
        const [{ isQuitVideo }, setIsQuitVideo] = useState<{ isQuitVideo: boolean }>({ isQuitVideo: false })
        const publishedDate = format(parseISO(currentDisplayArchive.publishDate), "yyyy/MM/dd")

        // Contentful
        const richtext_options = {
            renderNode: {
                [BLOCKS.PARAGRAPH]: (node, children) => {
                    return <Text whiteSpace='pre-wrap' mb={4}>{children}</Text>
                },
                [INLINES.HYPERLINK]: (node, children) => {
                    return <Link href={node.data.uri} color={highLightColor} isExternal>{children}</Link>
                },
            }
        }

        // Initial position of Thumbnail in Video
        const thumbnailWrap = useRef(null);
        const scrollThumbnailRef = useRef(null);
        useEffect(() => { thumbnailWrap.current.scrollLeft = scrollThumbnailRef.current.offsetLeft - thumbnailWrap.current.offsetLeft }, []);

        // Function
        const arrayProceedHandler = (arr: AllArchivesInterface[], currentData: AllArchivesInterface) => {
            const index = arr.indexOf(currentData);
            let nextData
            if (index >= 0 && index < arr.length - 1) return nextData = arr[index + 1]
            else return nextData = arr[0]
        }

        return (
            <>
                <HStack mb={2}>
                    <ChevronLeftIcon
                        w={8} h={8}
                        onClick={() => {
                            const paths = router.query.path as string[]
                            router.push(`/archive/${encodeURI(paths.join('/'))}`)
                            setIsVideoMode({ isVideoMode: false })
                        }} />
                </HStack>
                <Grid templateColumns={{ base: '1fr' }}>
                    <VideoVimeo
                        vimeoId={currentDisplayArchive?.vimeoUrl}
                        aspect={null}
                        autoplay={true}
                        borderRadius={0}
                        skipTime={skipTime}
                        isQuitVideo={isQuitVideo}
                        isAutoplay={isAutoplay}
                        nextVideoId={arrayProceedHandler(selectedArchive, currentDisplayArchive).sys.id}
                        currentRoot={currentRoot} />
                </Grid>

                <Box px={4} py={4}>
                    <Grid
                        templateColumns={{ base: "auto 40px" }}
                        gap={{ base: 4, md: 1 }}
                        pb={4}
                    >
                        <Box>
                            <List m={0} p={0}>
                                <ListItem fontSize={['xl']}>{currentDisplayArchive.title}</ListItem>
                                <ListItem color="#585858" size="10px" fontSize={['sm']} >
                                    {publishedDate}
                                </ListItem>
                            </List>
                        </Box>
                        <Box overflow="hidden" textAlign='right' >
                            {/* Heart */}
                            <RepeatIcon
                                width={5} height={5} mt={1}
                                onClick={() => setIsAutoplay({ isAutoplay: !isAutoplay })}
                                color={isAutoplay && highLightColor} />
                        </Box>
                    </Grid>
                    {currentDisplayArchive.timestamp && <Box pb={4}>
                        {currentDisplayArchive.timestamp.map((stamp, i) => (
                            <List fontSize={['md']} key={i}>
                                <ListItem>
                                    <Link
                                        mr={2}
                                        color={highLightColor}
                                        onClick={async () => {
                                            setIsQuitVideo({ isQuitVideo: true })
                                            await setSkipTime({ skipTime: TimeFormat.toS(stamp.time) })
                                            setIsQuitVideo({ isQuitVideo: false })
                                        }}
                                    >{stamp.time}</Link>
                                    {stamp.indexText}
                                </ListItem>
                            </List>
                        ))}
                    </Box>}
                    {/* Contentful */}
                    {currentDisplayArchive.description?.json && <Accordion css={accordionCss} allowToggle>
                        <AccordionItem mb={4} borderTopWidth={0} borderBottomWidth={0} >
                            <h2><AccordionButton p={0} justifyContent='center'><AccordionIcon /></AccordionButton></h2>
                            <AccordionPanel pb={4} px={0}>
                                {documentToReactComponents(currentDisplayArchive.description.json, richtext_options)}
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>}
                    {/* Thumbnails in Category */}
                    <List overflowX='auto' whiteSpace='nowrap' pb={4} borderTopWidth='0' ref={thumbnailWrap}>
                        {selectedArchive.map((archive) => {
                            let refFlag = null
                            if (archive.sys.id === currentDisplayArchive.sys.id) refFlag = scrollThumbnailRef
                            return (
                                <ListItem d='inline-block' w='180px' whiteSpace='pre-wrap' mr={3} _last={{ marginRight: 0 }} ref={refFlag} key={archive.sys.id}>
                                    <VideoThumnail archive={archive} inVideoCompo={true} key={archive.sys.id} />
                                </ListItem>
                            )
                        })}
                    </List>
                    {/* <Flex flexGrow={1} direction='row'></Flex> */}
                </Box>
            </>
        )
    }


    // Main Component
    if (user && (subscription_state === 'subscribe')) {
        return (
            <>
                {!isVideoMode && <ArchiveDrawer pathObj={pathObj} />}
                {!isVideoMode &&
                    <Flex flexGrow={1} direction='row'>
                        <Grid templateColumns={{ base: '1fr', lg: '240px 1fr', xl: '300px 1fr' }} w='full'>
                            <Box p={8} display={{ base: 'none', lg: 'block' }}>
                                <ArchiveSideNav pathObj={pathObj} onCloseDrawer={null} />
                            </Box>
                            <VStack spacing={8} p={{ base: 4, md: 8 }} >
                                <Flex justify={{ base: 'none', sm: 'space-between' }} flexDirection={{ base: 'column', sm: 'row' }} w='full' align='center'>
                                    <BreadcrumbNav paths={breadCrumbPaths()} />
                                    <HStack spacing={{ base: 3, sm: 6, md: 8 }}>
                                        <SortArrow />
                                        <ArchiveSearch
                                            filteredArchive={filteredArchive}
                                            setSearchedArchiveResult={setSearchedArchiveResult}
                                            isSeaching={isSeaching}
                                            setIsSeaching={setIsSeaching} />
                                    </HStack>
                                </Flex>
                                {!!selectedArchive.length ?
                                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', '2xl': 'repeat(3, 1fr)' }} gap={{ base: 4, md: 6 }}>
                                        {selectedArchive.map((archive) => <VideoThumnail archive={archive} inVideoCompo={false} key={archive.sys.id} />)}
                                    </Grid>
                                    : <Flex flexGrow={1}><Center>該当する動画は見つかりませんでした。</Center></Flex>
                                }
                            </VStack>
                        </Grid>
                    </Flex>}
                {isVideoMode && <Video />}
            </>
        )
    }
    else if (isLoading || isMetadataLoading) {
        return (
            <LodingSpinner />
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

const accordionCss = css`
    .chakra-accordion__item:last-of-type {
        border-bottom-width: 0;
    }
`