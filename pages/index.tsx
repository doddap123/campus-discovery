import styles from './index.module.scss';
import { Flex } from '@chakra-ui/react';
import { FunctionComponent, useEffect } from 'react';
import { StyledButton } from "../components/StyledButton";
import { useRouter } from "next/router";
import useAuth from "../lib/useAuth";

interface LandingProps {

}

export async function getServerSideProps(context: any) {
    // Serverside redirect
    const token =
        context.req.headers.cookie
            ?.split(';')
            .map((c: string) => c.split('='))
            .find(([k, _]: any) => k == 'token')
            ?.map(([_, v]: any) => v) || context.req.headers.Authorization?.split(' ')[1];
    if (token) {
        return {
            redirect: {
                permanent: false,
                destination: '/events'
            },
            props: {}
        };
    }
    return { props: {} };
}

const Index: FunctionComponent<LandingProps> = () => {
    const router = useRouter();

    const { user } = useAuth();

    // Clientside redirect
    useEffect(() => {
        (async function () {
            if (user) {
                await router.push('/events');
            }
        })();
    }, [user, router]);

    return (
        <div id={ styles.landingOuterContainer }>
            <video autoPlay muted loop id={ styles.landingVideo }>
                <source src={ 'gatech-video-1080.webm' } type={ '' }/>
            </video>
            <div>
                <Flex flexDirection={ 'column' }>
                    <h1 id={ styles.landingTitle }>
                        Georgia Tech Events
                    </h1>
                    <h2 id={ styles.landingSubtitle }>
                        There&apos;s always something going down on campus. Just find it.
                    </h2>
                </Flex>
                <Flex flexDirection={ 'row' } gap={ 8 }>
                    <StyledButton href='SignUp'>
                        Sign up
                    </StyledButton>
                    <StyledButton href='Login'>
                        Log in
                    </StyledButton>
                </Flex>
            </div>
        </div>
    );
}

export default Index;
