import _ from 'lodash'
import { useRouter } from 'next/router'
import { useArchiveState } from "@/context/useArchiveState"
import ArchiveActiveLink from '@/components/ArchiveActiveLink';
import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Link,
    useColorModeValue
} from "@chakra-ui/react"
import { css } from "@emotion/react"
import { highlight_color, text_color } from '@/styles/colorModeValue';

export default function ArchiveSideNav({ pathObj, onCloseDrawer }: { pathObj: ArchivePath[], onCloseDrawer: () => void | null }) {

    const router = useRouter()
    const { setSearchKeyword } = useArchiveState()

    // For routes which need Accordion to be opened.
    let defaultIndex: number | null = null
    if (router.query.path.length === 2) {
        const indexOfRouteMatchPath = _.findIndex(pathObj, (o) => router.query.path[0] === o.id)
        const indexOfFisrtAccordion = _.findIndex(pathObj, (o) => !!o.paths)
        defaultIndex = indexOfRouteMatchPath - indexOfFisrtAccordion
    }

    const highLightColor = useColorModeValue(highlight_color.l, highlight_color.d)

    return (
        <Accordion allowToggle css={accordionCss} defaultIndex={defaultIndex}>
            {pathObj.map((obj, i) => {
                // ex: archive/名人
                if (!obj.paths) return (
                    <ArchiveActiveLink href={`/archive/${obj.categoryName}`} key={i}>
                        <Link onClick={() => {
                            if (onCloseDrawer !== null) onCloseDrawer()
                            setSearchKeyword({ searchKeyword: '' })
                        }}>
                            <Box pb={5}>{obj.categoryName}</Box>
                        </Link>
                    </ArchiveActiveLink>)

                // ex: archive/season/春
                else return (
                    <AccordionItem borderTopWidth={0} borderBottomWidth={0} key={i}>
                        <h2>
                            <AccordionButton px={0} pt={0} pb={5} _expanded={{ color: highLightColor }}>
                                <Box
                                    flex="1"
                                    textAlign="left"
                                    color={useColorModeValue(text_color.l, text_color.d)}>
                                    {obj.categoryName}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        {obj.paths.map(p => (
                            <ArchiveActiveLink href={`/archive/${obj.id}/${p}`} key={`${obj.id}/${p}`}>
                                <Link onClick={() => {
                                    if (onCloseDrawer !== null) onCloseDrawer()
                                    setSearchKeyword({ searchKeyword: '' })
                                }}>
                                    <AccordionPanel pt={0} pb={5} isTruncated>{p}</AccordionPanel>
                                </Link>
                            </ArchiveActiveLink>))}
                    </AccordionItem>)
            })}
        </Accordion>
    );
}

const accordionCss = css`
    .chakra-accordion__item:last-of-type {
        border-bottom-width: 0;
    }
`