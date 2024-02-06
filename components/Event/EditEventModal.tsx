import {
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FunctionComponent, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { EventModel } from "../../db/model/Event";
import { IAttendee } from "../../db/model/Attendee";
import { MdClose } from "react-icons/md";
import useAuth from "../../lib/useAuth";
import { useRouter } from 'next/router';

export interface EditEventModalProps {
    initialEvent: EventModel,
    onUpdate: (event: EventModel) => void
}

const EditEventModal: FunctionComponent<EditEventModalProps> = ({ initialEvent, onUpdate, ...props }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [event, setEvent] = useState<EventModel>(initialEvent);

    const toast = useToast();
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    useEffect(() => {
        if (event) {
            reset({
                title: event.title,
                description: event.description,
                location: event.location,
            });
        }
    }, [event]);

    const { user } = useAuth();

    let canEdit = (user: any) => user?.category?.toUpperCase() == 'ADMIN' || (event?.creator?._id && event?.creator?._id == user?._id);

    const handleFormSubmit = async (values: any) => {
        console.log("fired")
        fetch(`/api/event/${ event?._id }`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: values.title,
                description: values.description,
                location: values.location,
                rsvp: event.rsvp
            })
        })
            .then(async rawResponse => {
                onClose();
                toast({
                    title: "Success!",
                    description: "Event Editted",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onUpdate(await rawResponse.json());
                console.log("worked");
                await router.reload();
            })
            .catch(error => {
                console.error(error);
                alert(`There was an error: ${ error }`)
            });
    };
    return (
        <>
            { canEdit(user) && <Button onClick={ onOpen }>Edit Event</Button> }

            <Modal isOpen={ isOpen } onClose={ onClose }>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Edit Event</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <div>
                            <Flex width="full" align="center" justifyContent="center">
                                <Box p={ 1 }>
                                    <Box>
                                        <Box textAlign="center">
                                        </Box>
                                    </Box>
                                    <Box my={ 4 } textAlign="left">
                                        <form onSubmit={ handleSubmit(handleFormSubmit) }>
                                            <Divider mt={ 4 } mb={ 2 }/>
                                            <FormControl>
                                                <FormLabel fontSize={ 14 }>Title</FormLabel>
                                                <Input { ...register("title") } type="text" size="sm"/>
                                            </FormControl>
                                            <FormControl mt={ 4 }>
                                                <FormLabel fontSize={ 14 }>Event Description</FormLabel>
                                                <Input { ...register("description") } type="text"/>
                                            </FormControl>
                                            <FormControl mt={ 4 }>
                                                <FormLabel fontSize={ 14 }>Location</FormLabel>
                                                <Input { ...register("location") } type="text"/>
                                            </FormControl>
                                            <FormControl mt={ 4 }>
                                                <Text fontSize={ 14 }>Attendees: </Text>
                                                {
                                                    Object.entries(event?.rsvp).map(([k, v]) => {
                                                        return (
                                                            <>
                                                                <Text fontSize={ 12 } key={ k }>
                                                                    { [...k].map((c, i) => i == 0 ? c.toUpperCase() : c).join('') }:
                                                                </Text>
                                                                { event?.rsvp[k].map((a: any) =>
                                                                    <Button key={ a._id } onClick={ () => {
                                                                        event.rsvp[k] = event?.rsvp[k]
                                                                            .filter((e: any) => e._id != a._id);
                                                                        setEvent(event);
                                                                    } }><MdClose/></Button>
                                                                ) }
                                                            </>
                                                        );
                                                    })
                                                }
                                            </FormControl>
                                            {/* <FormControl mt={4}>
              <FormLabel fontSize={14}>Date</FormLabel>
              <Input type="date"/>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel fontSize={14}>Time</FormLabel>
              <Input type="time"/>
            </FormControl> */ }
                                            <Button colorScheme='blue' width="text" mt={ 4 } type="submit">
                                                Submit Changes
                                            </Button>
                                        </form>
                                    </Box>
                                </Box>
                            </Flex>
                        </div>

                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}
export default EditEventModal;
