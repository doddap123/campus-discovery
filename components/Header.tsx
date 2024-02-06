import React, { ReactNode } from 'react';
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import styles from './Header.module.scss';
import useAuth from "../lib/useAuth";
import { useRouter } from "next/router";

const Links = [
    { label: 'Events', link: '/events' },
    { label: 'Map', link: '/map'},
    { label: 'Create Event', link: '/events/create' },
    { label: 'Your RSVPs', link: '/rsvplist'}
];

const NavLink = ({ href, children }: { href: string, children: ReactNode }) => (
    <Link
        px={ 2 }
        py={ 1 }
        rounded={ 'md' }
        _hover={ {
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        } }
        href={ href }>
        { children }
    </Link>
);


export default function Simple() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, refreshToken, logout } = useAuth();
    const router = useRouter();

    async function handleLogOut(e: any) {
        e?.preventDefault();
        await logout();
        await router.reload();
    }

    return (
        <>
            <Box id={ styles.headerContainer } px={ 4 }>
                <Flex h={ 16 } alignItems={ 'center' } justifyContent={ 'space-between' }>
                    <IconButton
                        size={ 'md' }
                        icon={ isOpen ? <CloseIcon/> : <HamburgerIcon/> }
                        aria-label={ 'Open Menu' }
                        display={ { md: 'none' } }
                        onClick={ isOpen ? onClose : onOpen }
                    />
                    <HStack spacing={ 8 } alignItems={ 'center' }>
                        <NavLink href={ '/' }><Box>Home</Box></NavLink>
                        <HStack
                            as={ 'nav' }
                            spacing={ 4 }
                            display={ { base: 'none', md: 'flex' } }>
                            { Links.map(({ label, link }) =>
                                (label != 'Create Event' || user) ? (
                                    <NavLink href={ link } key={ label }>{ label }</NavLink>
                                ) : ''
                            ) }
                        </HStack>
                    </HStack>
                    <Flex alignItems={ 'center' }>
                        { user ?
                            <Menu>
                                <MenuButton
                                    as={ Button }
                                    rounded={ 'full' }
                                    variant={ 'link' }
                                    cursor={ 'pointer' }
                                    boxShadow={ 'base' }
                                    minW={ 0 }>
                                    <Avatar
                                        size={ 'sm' }
                                        bg={ 'gray.700' }
                                    />
                                </MenuButton>
                                <MenuList>
                                    {/*
                                <MenuItem>Link 1</MenuItem>
                                <MenuItem>Link 2</MenuItem>
                                <MenuDivider/>
                                */ }
                                    <Link onClick={ handleLogOut }
                                          _hover={ { 'textDecoration': 'none' } }><MenuItem
                                        color={ 'red.700' }>Sign out</MenuItem></Link>
                                </MenuList>
                            </Menu> : <NavLink href={ '../Login' }>Sign in</NavLink> }
                    </Flex>
                </Flex>

                { isOpen ? (
                    <Box pb={ 4 } display={ { md: 'none' } }>
                        <Stack as={ 'nav' } spacing={ 4 }>
                            { Links.map(({ label, link }) => (
                                <NavLink href={ link } key={ label }>{ label }</NavLink>
                            )) }
                        </Stack>
                    </Box>
                ) : null }
            </Box>
        </>
    );
}
