import Document, { Html, Head, Main, NextScript } from 'next/document'
import theme from '@/styles/themes';
import { ColorModeScript } from "@chakra-ui/react"

class MyDocument extends Document {

    render() {
        return (
            <Html>
                <Head >
                    {/* <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' /> */}
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    {/* PWA */}
                    <meta name='application-name' content='Archive App' />
                    <meta name='apple-mobile-web-app-capable' content='yes' />
                    <meta name='apple-mobile-web-app-status-bar-style' content='default' />
                    <meta name='apple-mobile-web-app-title' content='Arvhice App' />
                    <meta name='description' content="Author's Archive app" />
                    <meta name='format-detection' content='telephone=no' />
                    <meta name='mobile-web-app-capable' content='yes' />
                    <meta name='msapplication-config' content='/public/icons/browserconfig.xml' />
                    <meta name='msapplication-TileColor' content='#da532c' />
                    <meta name='msapplication-tap-highlight' content='no' />
                    <meta name='theme-color' content='#FFFFFF' />

                    <link rel="apple-touch-icon" href="public/icons/apple-touch-icon.png" />
                    <link rel="apple-touch-icon" sizes="57x57" href="public/icons/apple-touch-icon-57x57.png" />
                    <link rel="apple-touch-icon" sizes="72x72" href="public/icons/apple-touch-icon-72x72.png" />
                    <link rel="apple-touch-icon" sizes="76x76" href="public/icons/apple-touch-icon-76x76.png" />
                    <link rel="apple-touch-icon" sizes="114x114" href="public/icons/apple-touch-icon-114x114.png" />
                    <link rel="apple-touch-icon" sizes="120x120" href="public/icons/apple-touch-icon-120x120.png" />
                    <link rel="apple-touch-icon" sizes="144x144" href="public/icons/apple-touch-icon-144x144.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="public/icons/apple-touch-icon-152x152.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="public/icons/apple-touch-icon-180x180.png" />

                    <link rel='shortcut icon' href='/favicon.ico' />
                    <link rel='icon' type='image/png' sizes='32x32' href='/public/icons/favicon-32x32.png' />
                    <link rel='icon' type='image/png' sizes='16x16' href='/public/icons/favicon-16x16.png' />
                    <link rel='manifest' href='/manifest.json' />
                    <link rel='mask-icon' href='/public/icons/safari-pinned-tab.svg' color='#bf5555' />

                    {/* <meta name='twitter:card' content='summary' />
                    <meta name='twitter:url' content='https://yourdomain.com' />
                    <meta name='twitter:title' content='PWA App' />
                    <meta name='twitter:description' content='Best PWA App in the world' />
                    <meta name='twitter:image' content='https://yourdomain.com/public/icons/android-chrome-192x192.png' />
                    <meta name='twitter:creator' content='@DavidWShadow' />
                    <meta property='og:type' content='website' />
                    <meta property='og:title' content='PWA App' />
                    <meta property='og:description' content='Best PWA App in the world' />
                    <meta property='og:site_name' content='PWA App' />
                    <meta property='og:url' content='https://yourdomain.com' />
                    <meta property='og:image' content='https://yourdomain.com/public/icons/apple-touch-icon.png' /> */}
                    {/* PWA */}
                </Head>
                <meta name='application-name' content='PWA App' />
                <body>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument