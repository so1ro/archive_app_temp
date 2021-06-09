import { useState, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import { useArchiveState } from '@/context/useArchiveState';

import { format, parseISO } from "date-fns"
import TimeFormat from 'hh-mm-ss'
import { arrayProceedHandler } from '@/utils/helpers'

import {
    Box, Grid, List, ListItem, HStack, Link, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useColorModeValue
} from '@chakra-ui/react'
import { highlight_color } from '@/styles/colorModeValue';

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

    const router = useRouter()

    // Find Video
    const currentId = router.query.id as string
    const currentDisplayArchive = selectedArchive.find(archive => archive.sys.id === currentId)

    // Hook
    const { isAutoplay, setIsAutoplay, setIsVideoMode, } = useArchiveState()

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
                return <Link href={node.data.uri} color={highlight_color} isExternal>{children}</Link>
            },
        }
    }

    // Initial position of Thumbnail in Video
    const thumbnailWrap = useRef(null)
    const scrollThumbnailRef = useRef(null)
    useLayoutEffect(() => {
        thumbnailWrap.current.scrollLeft = scrollThumbnailRef.current.offsetLeft - thumbnailWrap.current.offsetLeft
    }, [])

    // Functions
    const routerPushHandler = () => {
        const nextVideoId = arrayProceedHandler(selectedArchive, currentDisplayArchive).sys.id
        setSkipTime({ skipTime: 0 })
        isAutoplay && router.push(`${currentRoot}/?id=${nextVideoId}`, null, { shallow: true })
    }


    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)

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
                    onRouterPush={routerPushHandler} />
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
                                <VideoThumbnail
                                    archive={archive}
                                    inVideoCompo={true}
                                    currentRoot={currentRoot}
                                    setSkipTime={setSkipTime}
                                    key={archive.sys.id} />
                            </ListItem>
                        )
                    })}
                </List>
                {/* <Flex flexGrow={1} direction='row'></Flex> */}
            </Box>
        </>
    )
}

const accordionCss = css`
    .chakra-accordion__item:last-of-type {
        border-bottom-width: 0;
    }
`