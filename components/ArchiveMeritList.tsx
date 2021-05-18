import { Grid, GridItem, Heading, Text, useColorMode, useColorModeValue, HStack, Icon } from '@chakra-ui/react';
import { CheckIcon } from '@/styles/icons';
import { highlight_color } from '@/styles/colorModeValue';
import { createIcon } from "@chakra-ui/icons"

export default function ArchiveMeritList({ meritListItems }) {

    const [content, functions, merit] = meritListItems
    const meritGroup = [
        { title: 'アーカイブ内容', list: content, emoji: '' },
        { title: '便利な機能', list: functions, emoji: '' },
        { title: 'アーカイブ特典', list: merit, emoji: '&#x1f31f;' },
    ]

    const ic = "<g id='color'> <circle cx='36' cy='36' r='23' fill='#FCEA2B' /> <path fill='#FFFFFF' d='M50.595,41.64c0.012,1.5397-0.2838,3.0662-0.87,4.49c-12.49,3.03-25.43,0.34-27.49-0.13 c-0.5588-1.3852-0.8407-2.8664-0.83-4.36h0.11c0,0,14.8,3.59,28.89,0.07L50.595,41.64z' /> <path fill='#EA5A47' d='M49.7251,46.13c-1.79,4.27-6.35,7.23-13.69,7.23c-7.41,0-12.03-3.03-13.8-7.36 C24.2951,46.47,37.235,49.16,49.7251,46.13z' /> </g> <g id='hair' /> <g id='skin' /> <g id='skin-shadow' /> <g id='line'> <circle cx='36' cy='36' r='23' fill='none' stroke='#000000' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' /> <path fill='none' stroke='#000000' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M50.595,41.64 c0.012,1.5397-0.2838,3.0662-0.87,4.49c-12.49,3.03-25.43,0.34-27.49-0.13c-0.5588-1.3852-0.8407-2.8664-0.83-4.36h0.11 c0,0,14.8,3.59,28.89,0.07L50.595,41.64z' /> <path fill='none' stroke='#000000' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M49.7251,46.13 c-1.79,4.27-6.35,7.23-13.69,7.23c-7.41,0-12.03-3.03-13.8-7.36C24.2951,46.47,37.235,49.16,49.7251,46.13z' /> <path d='M30,31c0,1.6568-1.3448,3-3,3c-1.6553,0-3-1.3433-3-3c0-1.6552,1.3447-3,3-3C28.6552,28,30,29.3448,30,31' /> <path d='M48,31c0,1.6568-1.3447,3-3,3s-3-1.3433-3-3c0-1.6552,1.3447-3,3-3S48,29.3448,48,31' /> </g>"

    const MeritGridItem = ({ title, list, emoji, num }: { title: string, list: string[], emoji: string, num: number }) => {
        const { colorMode } = useColorMode()
        return (
            <GridItem gridColumn={((num === meritGroup.length - 1) && (num % 2 == 0)) && '1 / -1'}>
                <HStack>
                    <Heading as='h3' fontSize='lg' mb={2}>{title}</Heading>
                    {/* <Test2Icon w={8} h={8} /> */}
                    <Icon viewBox="0 0 200 200" w={12} h={12}>
                        {ic}
                    </Icon>
                </HStack>
                {list.map(text => (
                    <HStack align='baseline'>
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
            boxShadow='0px 4px 4px rgba(0, 0, 0, 0.15), 0px -2px 4px rgba(0, 0, 0, 0.15), 4px 0px 4px rgba(0, 0, 0, 0.15);'
            borderRadius='2xl'>
            {meritGroup.map((g, i) => <MeritGridItem title={g.title} list={g.list} emoji={g.emoji} num={i} />)}
        </Grid>
    );
}

// export const Test2Icon = createIcon({
//     displayName: "Test2Icon",
//     viewBox: "0 0 72 72",
//     path: (
//         <>
//             <g id="color">
//                 <circle cx="36" cy="36" r="23" fill="#FCEA2B" />
//                 <path fill="#FFFFFF" d="M50.595,41.64c0.012,1.5397-0.2838,3.0662-0.87,4.49c-12.49,3.03-25.43,0.34-27.49-0.13 c-0.5588-1.3852-0.8407-2.8664-0.83-4.36h0.11c0,0,14.8,3.59,28.89,0.07L50.595,41.64z" />
//                 <path fill="#EA5A47" d="M49.7251,46.13c-1.79,4.27-6.35,7.23-13.69,7.23c-7.41,0-12.03-3.03-13.8-7.36 C24.2951,46.47,37.235,49.16,49.7251,46.13z" />
//             </g>
//             <g id="hair" />
//             <g id="skin" />
//             <g id="skin-shadow" />
//             <g id="line">
//                 <circle cx="36" cy="36" r="23" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
//                 <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M50.595,41.64 c0.012,1.5397-0.2838,3.0662-0.87,4.49c-12.49,3.03-25.43,0.34-27.49-0.13c-0.5588-1.3852-0.8407-2.8664-0.83-4.36h0.11 c0,0,14.8,3.59,28.89,0.07L50.595,41.64z" />
//                 <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M49.7251,46.13 c-1.79,4.27-6.35,7.23-13.69,7.23c-7.41,0-12.03-3.03-13.8-7.36C24.2951,46.47,37.235,49.16,49.7251,46.13z" />
//                 <path d="M30,31c0,1.6568-1.3448,3-3,3c-1.6553,0-3-1.3433-3-3c0-1.6552,1.3447-3,3-3C28.6552,28,30,29.3448,30,31" />
//                 <path d="M48,31c0,1.6568-1.3447,3-3,3s-3-1.3433-3-3c0-1.6552,1.3447-3,3-3S48,29.3448,48,31" />
//             </g>
//         </>
//     ),
// })
