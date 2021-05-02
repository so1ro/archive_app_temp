import React from 'react';
// import { theme as chakraTheme } from '@chakra-ui/react';
import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
    initialColorMode: "light",
    useSystemColorMode: false,
    styles: {
        global: (props) => ({
            html: {
                scrollBehavior: "smooth",
            },
            // "#__next": {
            //     display: "flex",
            //     flexDirection: "column",
            //     minHeight: "100vh",
            // },
            body: {
                // background: props.colorMode === "dark" ? "#1D2932" : "#edf2f7",
                color: props.colorMode === "dark" ? "white" : "gray.600",
            },
            "a.active": {
                color: props.colorMode === "dark" ? "#F79F22" : "#E63946",
            }
        }),
    },
    fonts: {
        body: `"RocknRollOne-Regular"`
    },
    fontWeights: {
        normal: 400,
        medium: 600,
        bold: 700
    },
});

export default theme;

{/* Chakra UI Breakpoints
  sm: "30em" :  480px,
  md: "48em" :  768px,
  lg: "62em" :  992px,
  xl: "80em" :  1280px,
  "2xl": "96em":  1536px
*/}