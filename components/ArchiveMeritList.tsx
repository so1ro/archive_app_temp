import { Grid, GridItem, Heading, Text, useColorMode, useColorModeValue, HStack, Icon } from '@chakra-ui/react';
import { CheckIcon, LibraryIcon, FunctionsIcon, HeartIcon } from '@/styles/icons';
import { highlight_color } from '@/styles/colorModeValue';
import { createIcon } from "@chakra-ui/icons"

export default function ArchiveMeritList({ meritListItems }) {

    const [content, functions, merit] = meritListItems
    const meritGroup = [
        { title: content.title, list: content.list, icon: 'content' },
        { title: functions.title, list: functions.list, icon: 'functions' },
        { title: merit.title, list: merit.list, icon: 'merit' },
    ]
    const { colorMode } = useColorMode()
    const boxShadowLight = '0px 4px 4px rgba(0, 0, 0, 0.15), 0px -2px 4px rgba(0, 0, 0, 0.15), 4px 0px 4px rgba(0, 0, 0, 0.15);'
    const boxShadowDark = '0px 4px 4px rgba(255, 255, 255, 0.15), 0px -4px 4px rgba(255, 255, 255, 0.15), -4px 0px 4px rgba(255, 255, 255, 0.15), 4px 0px 4px rgba(255, 255, 255, 0.15);'

    const MeritGridItem = ({ title, list, icon, num }: { title: string, list: string[], icon: string, num: number }) => {

        const iconHandler = (icon) => {
            // Add Switch condition here...
            if (icon === 'content') return LibraryIcon(32)
            if (icon === 'functions') return FunctionsIcon(32)
            else return HeartIcon(32)
        }

        return (
            <GridItem gridColumn={((num === meritGroup.length) && (num % 2 != 0)) && '1 / -1'}>
                <HStack align='center' mb={2}>
                    <Heading as='h3' fontSize='lg'>{title}</Heading>
                    {iconHandler(icon)}
                </HStack>
                {list.map((text, j) => (
                    <HStack align='baseline' key={j}>
                        <CheckIcon w={3} h={3} color={useColorModeValue(highlight_color.l, highlight_color.d)} />
                        <Text color={colorMode === 'light' ? '#6c6c6c' : '#fff'}>{text}</Text>
                    </HStack>))}
            </GridItem>
        )
    }

    return (
        <Grid
            w='full'
            p={12}
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={8}
            boxShadow={colorMode === 'light' ? boxShadowLight : boxShadowDark}
            borderRadius='2xl'
            bg={colorMode === 'dark' && '#263743'}>
            {meritGroup.map((g, i) => <MeritGridItem title={g.title} list={g.list} icon={g.icon} num={i + 1} key={i} />)}
        </Grid>
    );
}