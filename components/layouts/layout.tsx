import React from "react";
import Header from "../Header";
import {Flex} from "@chakra-ui/react";
import styles from './layout.module.scss';
import {Roboto_Flex} from '@next/font/google';

const roboto = Roboto_Flex({subsets: ['latin']});

const Layout = ({children}: React.PropsWithChildren) => {
    return (
        <>
            <Flex direction={'column'} height={'100%'} width={'100%'}>
                <Header/>
                <main id={styles.mainContent} className={roboto.className}>{children}</main>
            </Flex>
        </>
    )
}

export default Layout;
