import { Button, FormControl, FormHelperText, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { ConfirmationProps } from './Confirmation';

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<ConfirmationProps | undefined>>
}

const Login: FunctionComponent<LoginProps> = props => {
    let router = useRouter();
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(e.target.value);
    }

    const login = async (e: { preventDefault: () => void; }) => {
        e?.preventDefault();
        try {
            /*
            const user = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(user)
             */
            const tokens = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            }).then(response => response.json());
            localStorage['accessToken'] = tokens.accessToken;
            localStorage['refreshToken'] = tokens.refreshToken;
            await router.push('/events');
            await router.reload();
        } catch (error) {
            console.log(error);
            alert(error);

        }
    }

    const emailError = email === '' || email.trim() === '';
    const passwordError = password === '' || password.trim() === '';
    return (
        <form onSubmit={login}>
            <VStack spacing={3}>
                <Text fontSize='5xl'>Login</Text>
                <VStack>
                    <FormControl isInvalid={emailError} isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input type='email' width='200' value={email} onChange={handleEmailChange}/>
                        {!emailError ? (<FormHelperText>Enter your email</FormHelperText>) : (
                            <FormHelperText color='red'>Invalid email</FormHelperText>
                        )}
                    </FormControl>
                    <FormControl isInvalid={passwordError} isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input type='text' width='200' value={password} onChange={handlePasswordChange}/>
                        {!passwordError ? (<FormHelperText>Enter your password</FormHelperText>) : (
                            <FormHelperText color='red'>Invalid password</FormHelperText>
                        )}
                    </FormControl>
                </VStack>
                <Button type='submit' colorScheme='blue'>Submit</Button>
            </VStack>
        </form>
    );
}

export default Login;
