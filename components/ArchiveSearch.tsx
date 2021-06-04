import React, { useState, useRef } from 'react'
import { Input, InputGroup, InputLeftElement, InputRightElement, useColorModeValue } from "@chakra-ui/react"
import { CloseIcon, SearchIcon } from "@chakra-ui/icons"
import { highlight_color, text_color } from '@/styles/colorModeValue'
import Fuse from 'fuse.js'

export default function ArchiveSearch(
    { filteredArchive,
        setSearchedArchiveResult,
        setIsSeaching }
    // :{
    //     filteredArchive: AllArchivesInterface[],
    //     setSearchedArchive: () => void
    // }

) {

    // useState
    const [{ hits }, setHits] = useState<{ hits: AllArchivesInterface[] | {} }>({ hits: {} })

    // useRef
    const searchInput = React.useRef<HTMLInputElement>(null)

    // Fuse-search
    const handleSearch = ({ currentTarget: { value: input } }) => {

        input ? setIsSeaching({ isSeaching: true }) : setIsSeaching({ isSeaching: false })
        const options = {
            // isCaseSensitive: false,
            // includeScore: false,
            // shouldSort: true,
            includeMatches: true,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            // threshold: 0.6,
            // distance: 100,
            // useExtendedSearch: false,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            keys: [
                "title",
                "publishDate",
                "vimeoUrl",
                "category",
                "keyword",
                "releasedYear",
                "casts",
                "place",
                "season",
            ]
        };

        const fuse = new Fuse(filteredArchive, options);
        setSearchedArchiveResult({ searchedArchiveResult: fuse.search(input) })
    }

    const clear = () => {
        searchInput.current.value = ""
        setHits({ hits: {} })
        setIsSeaching({ isSeaching: false })
    }

    return (
        <InputGroup ml={6}>
            <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color={useColorModeValue(text_color.l, text_color.d)} />} />
            <Input
                variant="filled"
                placeholder="このカテゴリーから検索"
                borderRadius='full'
                w={{ base: '220px', sm: '240px', md: '280px' }} fontSize={{ base: 'xs', md: 'sm' }}
                borderWidth='1px'
                bg={useColorModeValue('gray.200', '#172128')}
                focusBorderColor={useColorModeValue(highlight_color.l, highlight_color.d)}
                // Fuction
                onChange={handleSearch}
                ref={searchInput}
            />
            <InputRightElement
                cursor='pointer'
                children={<CloseIcon color={useColorModeValue(text_color.l, text_color.d)}
                    onClick={clear}
                    w={3} h={3}
                />} />
        </InputGroup>
    )
}