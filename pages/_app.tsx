import '../styles/globals.css';
import '../styles/_mixins.scss';
import type {AppProps} from 'next/app';
import {ChakraProvider} from "@chakra-ui/react";
import Layout from "../components/layouts/layout";

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
    return (
        <ChakraProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ChakraProvider>
    );
}
