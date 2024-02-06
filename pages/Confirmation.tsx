import { Text } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import WelcomePanel from '../components/Confirmation/WelcomePanel';

export interface ConfirmationProps {
    name?: string,
    category?: string
}

const Confirmation: FunctionComponent<ConfirmationProps | undefined> = props => {
    return (
        <div>
            {
                props ? (
                    <div>
                        <WelcomePanel {...props} />
                        <Text fontSize={'xl'}>
                            You are {[...'aeiou'].includes((props.category || '').toLowerCase()?.charAt(0)) ? 'an' : 'a'} {props.category?.charAt(0) + (props.category || '').substring(1).toLowerCase()}.
                        </Text>
                    </div>
                ) : (
                    <div>
                        Please sign up or sign in.
                    </div>
                )}
        </div >

    );
}

export default Confirmation;
