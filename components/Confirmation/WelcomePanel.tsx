import { FunctionComponent } from 'react';
import { Text } from '@chakra-ui/react';

interface WelcomePanelProps {
    name?: string
}

const WelcomePanel: FunctionComponent<WelcomePanelProps> = props => {
    return (
        <Text fontSize='xl'>
            Your name is: {props.name}.
        </Text>
    );
}

export default WelcomePanel;
