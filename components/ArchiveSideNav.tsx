import _ from 'lodash'
import { useRouter } from 'next/router'
import ArchiveActiveLink from '@/components/ArchiveActiveLink';
import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Link,
} from "@chakra-ui/react"
import { css } from "@emotion/react"

export default function ArchiveSideNav({ pathObj, onClose }: { pathObj: ArchivePath[], onClose: () => void } | null) {

    const router = useRouter()
    const indexOfFisrtAccordion = _.findIndex(pathObj, (o) => !!o.paths)
    const indexOfRouteMatchPath = _.findIndex(pathObj, (o) => router.query.path[0] === o.id)
    const defaultIndex = indexOfRouteMatchPath - indexOfFisrtAccordion

    return (
        <Accordion allowToggle css={accordingCss} defaultIndex={defaultIndex}>
            {pathObj.map((obj, i) => {
                // ex: archive/名人
                if (!obj.paths) return (
                    <ArchiveActiveLink href={`/archive/${obj.categoryName}`} key={i}>
                        <Link onClick={onClose}>
                            <Box pb={1}>{obj.categoryName}</Box>
                        </Link>
                    </ArchiveActiveLink>)

                // ex: archive/season/春
                else return (
                    <AccordionItem borderTopWidth={0} borderBottomWidth={0} key={i}>
                        <h2>
                            <AccordionButton px={0} py={1} >
                                <Box flex="1" textAlign="left"> {obj.categoryName} </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        {obj.paths.map(p => (
                            <ArchiveActiveLink href={`/archive/${obj.id}/${p}`} key={`${obj.id}/${p}`}>
                                <Link onClick={onClose}>
                                    <AccordionPanel py={2}>{p}</AccordionPanel>
                                </Link>
                            </ArchiveActiveLink>))}
                    </AccordionItem>)
            })}
        </Accordion>
    );
}

const accordingCss = css`
    .chakra-accordion__item:last-of-type {
        border-bottom-width: 0;
    }
`