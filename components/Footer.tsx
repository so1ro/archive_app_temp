import React from 'react';
import { Flex, Grid, GridItem, Stack, VStack, Heading, Text } from '@chakra-ui/react';
import { bg_color, text_color } from '@/styles/colorModeValue';
import SnsIcons from '@/components/SnsIcons';
import NavLinks from '@/components/NavLinks';

const date = new Date();
const year = date.getFullYear();

export default function Footer() {
    return (
        <Grid
            templateRows="repeat(2, 1fr)"
            justifyItems="center"
            alignItems="center"
            bg={bg_color}
            color={text_color}
            gap={2}
            p={4}
        // templateAreas={{
        //     base: `'1st_Row' '2nd_Row'`,
        // }}
        >
            <GridItem rowStart={2}>
                <VStack spacing={0} alignItems="center" >
                    <Text fontSize="xl" isTruncated>カスブラ</Text>
                    <Text fontSize="xs">&#xA9; {year} カスミブラザーズ All rights reserved.</Text>
                </VStack>
            </GridItem>
            <GridItem rowStart={1}>
                <Grid
                    justifyItems="center"
                    alignItems="center"
                    gap={2}
                    templateRows="repeat(2, 1fr)"
                >
                    <NavLinks />
                    <SnsIcons animation={false} type={'footer'} />
                </Grid>
            </GridItem>
        </Grid>
    );
}