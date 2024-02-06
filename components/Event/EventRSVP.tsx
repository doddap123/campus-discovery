import React, { FunctionComponent } from 'react';
import { EventModel } from "../../db/model/Event";
import {
    Button,
    FormControl,
    FormHelperText,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    useDisclosure,
    useToast,
    VStack
} from '@chakra-ui/react';
import useAuth from "../../lib/useAuth";
import { IUser } from "../../db/model/User";

export interface EventRSVPProps {
    event: EventModel
}

const EventRSVP: FunctionComponent<EventRSVPProps> = ({ event }) => {
    const toast = useToast();
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [attendeeType, setAttendeeType] = React.useState('')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault();

        const users = await fetch('/api/user', { method: 'GET' })
            .then(response => response.json())
            .catch(error => console.log('error', error));
        console.log("fired");
        if (!user) throw new Error('Not signed in');
        //let rsvp = event.rsvp;
        let rsvp: any = {
            'rsvp.yes': event.rsvp.yes.filter((u: IUser) => u._id != user._id),
            'rsvp.maybe': event.rsvp.maybe.filter((u: IUser) => u._id != user._id),
            'rsvp.no': event.rsvp.no.filter((u: IUser) => u._id != user._id)
        };
        if (attendeeType == 'nemesis') return;
        ['yes', 'maybe', 'no'].forEach(e => {
            if (attendeeType == e) {
                debugger;
                rsvp[`rsvp.${ e }`].push(user._id);
            }
        });

        fetch(`/api/event/${ event._id }`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rsvp)
        })
            .then(async rawResponse => {
                onClose();
                toast({
                    title: "Success!",
                    description: "RSVPed",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                // onUpdate(await rawResponse.json());
                console.log("worked")
            })
            .catch(error => {
                console.error(error);
                alert(`There was an error: ${ error }`)
            });
    }
    return (
        <>
            <Button onClick={ onOpen }>RSVP</Button>

            <Modal isOpen={ isOpen } onClose={ onClose } isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Confirm RSVP</ModalHeader>
                    <ModalCloseButton/>
                    <form onSubmit={ handleSubmit }>
                        <FormControl>
                            <ModalBody>
                                {/* <Select
                        defaultValue='Will Attend'
                        onChange= {setAttendeeType}
                        value={attendeeType}
                    >
                        <option value='option1'>Will Attend</option>
                        <option value='option2'>Maybe</option>
                        <option value='option3'>Won't Attend</option>
                        <option value='option4'>I'm Your Nemesis</option>
                    </Select> */ }
                                <RadioGroup
                                    defaultValue='Student'
                                    onChange={ setAttendeeType }
                                    value={ attendeeType }
                                >
                                    <VStack spacing='24px'>
                                        <Radio value='yes'>Will Attend</Radio>
                                        <Radio value='maybe'>Maybe</Radio>
                                        <Radio value="no">Wo&apos;t Attend</Radio>
                                        <Radio value="nemesis">I&apos;m Your Nemesis</Radio>
                                    </VStack>
                                </RadioGroup>
                                { attendeeType ? (<FormHelperText></FormHelperText>) : (
                                    <FormHelperText color='red' alignContent='center'
                                    >Choose your RSVP type</FormHelperText>
                                ) }
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    type='submit'
                                    colorScheme='blue'>
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </FormControl>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}
export default EventRSVP;
