import { useState, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import { useArchiveState } from '@/context/useArchiveState';

import { format, parseISO } from "date-fns"
import TimeFormat from 'hh-mm-ss'
import { arrayProceedHandler } from '@/utils/helpers'

import {
    Box, Grid, List, ListItem, HStack, Link, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useColorModeValue, Stack,
} from '@chakra-ui/react'
import { highlight_color, bg_color } from '@/styles/colorModeValue';

import VideoVimeo from '@/components/VideoVimeo'
import VideoThumbnail from '@/components/VideoThumbnail';
import { ChevronLeftIcon, RepeatIcon } from '@chakra-ui/icons'

//Contentful
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { css } from "@emotion/react"

export default function Video({
    selectedArchive,
    currentRoot,
}) {

    // Hook
    const router = useRouter()
    const {
        isAutoplay,
        setIsAutoplay,
        setIsVideoMode,
        currentDisplayArchive,
        setCurrentDisplayArchive,
    } = useArchiveState()

    // When refreshing browser, currentDisplayArchive is missing. 
    // Fallback here with router query.
    const currentId = router.query.id as string
    const displayingArchive = currentDisplayArchive ?? selectedArchive.find(archive => archive.sys.id === currentId)

    //State
    const [{ skipTime }, setSkipTime] = useState<{ skipTime: number }>({ skipTime: 0 })
    const [{ isQuitVideo }, setIsQuitVideo] = useState<{ isQuitVideo: boolean }>({ isQuitVideo: false })
    const publishedDate = format(parseISO(displayingArchive.publishDate), "yyyy/MM/dd")

    // Contentful
    const richtext_options = {
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node, children) => {
                return <Text whiteSpace='pre-wrap' mb={4}>{children}</Text>
            },
            [INLINES.HYPERLINK]: (node, children) => {
                return <Link href={node.data.uri} color={highlight_color} isExternal>{children}</Link>
            },
        }
    }

    // Initial position of Thumbnail in Video
    const thumbnailWrap = useRef(null)
    const scrollThumbnailRef = useRef(null)
    useLayoutEffect(() => {
        thumbnailWrap.current.scrollLeft = scrollThumbnailRef.current.offsetLeft - thumbnailWrap.current.offsetLeft
    }, [displayingArchive])

    // Functions
    const routerPushHandler = () => {
        const nextVideo = arrayProceedHandler(selectedArchive, displayingArchive)
        const nextVideoId = arrayProceedHandler(selectedArchive, displayingArchive).sys.id
        setSkipTime({ skipTime: 0 })
        if (isAutoplay) {
            setCurrentDisplayArchive({ currentDisplayArchive: nextVideo })
            router.push(`${currentRoot}/?id=${nextVideoId}`, null, { shallow: true })
        }
    }

    // Miscellaneous
    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const bgColor = useColorModeValue(bg_color.l, bg_color.d)
    const accordionCss = css`
        .chakra-accordion__item:last-of-type {
        border-bottom-width: 0;
        }
    `
    const thumbnailAreaScrollCss = css`
        /* height */
        ::-webkit-scrollbar {
            height: 4px;
        }
        
        /* Track */
        ::-webkit-scrollbar-track {
            background:  ${bgColor};
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius : 4px
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: ${highLightColor};
        }
    `


    return (
        <>
            <HStack
                mb={2} spacing='0' align='center' cursor='pointer'
                onClick={() => {
                    const paths = router.query.path as string[]
                    router.push(`/archive/${encodeURI(paths.join('/'))}`)
                    setIsVideoMode({ isVideoMode: false })
                }}>
                <ChevronLeftIcon w={8} h={8} />
                <Text d={{ base: 'none', xl: 'inline-block' }}>戻る</Text>
            </HStack>
            <Stack direction={{ base: 'column' }} align='center' >
                <Box w='full' maxW={{ base: '1280px' }}>
                    {/* <Grid> */}
                    <VideoVimeo
                        vimeoId={displayingArchive?.vimeoUrl}
                        aspect={null}
                        autoplay={true}
                        borderRadius={0}
                        skipTime={skipTime}
                        isQuitVideo={isQuitVideo}
                        onRouterPush={routerPushHandler} />
                    {/* </Grid> */}

                    <Box px={{ base: 4, 'xl': 0 }} py={4}>
                        <Grid
                            templateColumns={{ base: "auto 40px" }}
                            gap={{ base: 4, md: 1 }}
                            pb={4}
                        >
                            <Box>
                                <List m={0} p={0}>
                                    <ListItem fontSize={{ base: 'xl', lg: '2xl' }}>{displayingArchive.title}</ListItem>
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
                        {/* Timestamps */}
                        {displayingArchive.timestamp && <Box pb={4}>
                            {displayingArchive.timestamp.map((stamp, i) => (
                                <List fontSize={['md']} key={i} >
                                    <ListItem fontSize={{ base: 'sm', lg: 'md' }}>
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
                        {/* Description with Contentful */}
                        {displayingArchive.description?.json && <Accordion css={accordionCss} allowToggle>
                            <AccordionItem mb={8} borderTopWidth={0} borderBottomWidth={0} >
                                <h2><AccordionButton p={0} justifyContent='center'><AccordionIcon /></AccordionButton></h2>
                                <AccordionPanel pb={4} px={0} fontSize={{ base: 'sm', lg: 'md' }}>
                                    {documentToReactComponents(displayingArchive.description.json, richtext_options)}
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>}
                        {/* Thumbnails in Category ROW*/}
                        <List overflowX='auto' whiteSpace='nowrap' mt={8} pb={4} borderTopWidth='0' ref={thumbnailWrap} css={thumbnailAreaScrollCss}>
                            {selectedArchive.map((archive) => {
                                let refFlag = null
                                if (archive.sys.id === displayingArchive.sys.id) refFlag = scrollThumbnailRef
                                return (
                                    <ListItem d='inline-block' w='180px' whiteSpace='pre-wrap' mr={3} _last={{ marginRight: 0 }} ref={refFlag} key={archive.sys.id}>
                                        <VideoThumbnail
                                            archive={archive}
                                            inVideoCompo={true}
                                            currentRoot={currentRoot}
                                            setSkipTime={setSkipTime}
                                            key={archive.sys.id} />
                                    </ListItem>)
                            })}
                        </List>
                    </Box>
                </Box>
                {/* Thumbnails in Category ROW*/}
                {/* <Box d={{ base: 'none', xl: 'block' }}>
                    <List overflowY='auto' whiteSpace='nowrap' pb={4} borderTopWidth='0' ref={thumbnailWrapColumn}>
                        {selectedArchive.map((archive) => {
                            let refFlag = null
                            if (archive.sys.id === displayingArchive.sys.id) refFlag = scrollThumbnailColumnRef
                            return (
                                <ListItem d='block' w='full' ref={refFlag} key={archive.sys.id}>
                                    <VideoThumbnail
                                        archive={archive}
                                        inVideoCompo={true}
                                        currentRoot={currentRoot}
                                        setSkipTime={setSkipTime}
                                        key={archive.sys.id} />
                                </ListItem>)
                        })}
                    </List>
                </Box> */}
            </Stack>
        </>
    )
}