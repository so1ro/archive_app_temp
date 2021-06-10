import { extendTheme } from "@chakra-ui/react"
import { text_color } from '@/styles/colorModeValue'
import { createBreakpoints } from "@chakra-ui/theme-tools"

const breakpoints = createBreakpoints({
    sm: "480px",
    md: "768px",
    lg: "992px",
    xl: "1280px",
    "2xl": "1480px",
    "3xl": "1536px",
    "4xl": "1680px",
})

const theme = extendTheme({
    breakpoints,
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
                color: props.colorMode === "dark" ? text_color.d : text_color.l,
                padding: 0,
                margin: 0,
            },
            "a": {
                color: "inherit",
                textDecoration: "none"
            },
            "a.active": {
                color: props.colorMode === "dark" ? "#F79F22" : "#E63946",
            },
            "a:hover": {
                textDecoration: "none!important",
            }
        }),
    },
    fonts: {
        body: `"RocknRollOne-Regular"`,
        heading: `"RocknRollOne-Regular"`,
    },
    fontWeights: {
        normal: 400,
        medium: 600,
        bold: 700
    },
});

export default theme;

//// FontSize Basic /////
// fontSize={{ base: 'md', lg: 'xl' }}