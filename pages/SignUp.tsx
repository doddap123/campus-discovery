import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    Radio,
    RadioGroup,
    Text,
    VStack
} from '@chakra-ui/react';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { ConfirmationProps } from './Confirmation';

interface SignUpProps {
    setUser: React.Dispatch<React.SetStateAction<ConfirmationProps | undefined>>
}

const SignUp: FunctionComponent<SignUpProps> = _ => {
    let router = useRouter();
    const [name, setName] = React.useState('')
    const [category, setCategory] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('');
    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setName(e.target.value);
    }

    const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(e.target.value);
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault();
        if (error) return;

        fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, category, email, password })
        }).then(async _ => {
            await router.push('/events');
        }).catch(console.error);
    }

    const nameError = name === '' || name.trim() === '';
    const emailError = email === '' || email.trim() === '';
    const error = name === '' || name.trim() === '' || !category;
    const passwordError = password === '' || password.trim() === '';

    return (
        <form onSubmit={ handleSubmit }>
            <VStack spacing={ 3 }>
                <Text fontSize='5xl'>Create an Account</Text>
                <VStack>
                    <FormControl isInvalid={ nameError } isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input width='200' value={ name } onChange={ handleChange }/>
                        { !nameError ? (<FormHelperText>Enter your name</FormHelperText>) : (
                            <FormHelperText color='red'>Invalid name</FormHelperText>
                        ) }
                    </FormControl>
                    <FormControl isInvalid={ nameError } isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input type='email' width='200' value={ email } onChange={ handleEmailChange }/>
                        { !emailError ? (<FormHelperText>Enter your email</FormHelperText>) : (
                            <FormHelperText color='red'>Invalid email</FormHelperText>
                        ) }
                    </FormControl>
                    <FormControl isInvalid={ nameError } isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input type='text' width='200' value={ password } onChange={ handlePasswordChange }/>
                        { !passwordError ? (<FormHelperText>Enter your password</FormHelperText>) : (
                            <FormHelperText color='red'>Invalid password</FormHelperText>
                        ) }
                    </FormControl>
                    <FormControl as='fieldset' isRequired>
                        <FormLabel as='legend'>Category</FormLabel>
                        <RadioGroup
                            defaultValue='Student'
                            onChange={ setCategory }
                            value={ category }
                        >
                            <HStack spacing='24px'>
                                <Radio value='Student'>Student</Radio>
                                <Radio value='Organizer'>Organizer</Radio>
                                <Radio value='Admin'>Admin</Radio>
                            </HStack>
                        </RadioGroup>
                        { category ? (<FormHelperText>Choose your category</FormHelperText>) : (
                            <FormHelperText color='red'>Choose your category</FormHelperText>
                        ) }
                    </FormControl>
                </VStack>
                <Button type='submit' colorScheme='blue'>Submit</Button>
            </VStack>
        </form>
    );
}

export default SignUp;
