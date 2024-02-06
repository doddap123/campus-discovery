import React, { FunctionComponent, RefObject, useState } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    useDisclosure
} from "@chakra-ui/react";
import EditEventModal from './EditEventModal';
import EventRSVP from './EventRSVP';
import { EventModel } from "../../db/model/Event";
import FormatDate from "../../lib/FormatDate";
import styles from "./EventCard.module.scss";
import useAuth from "../../lib/useAuth";

export interface EventCardProps {
    event: EventModel,
    selected: boolean,
    onUpdate: (event: EventModel) => void,
    onDelete: () => void
}

const EventCard: FunctionComponent<EventCardProps> = (
    {event, selected, onUpdate, onDelete, ...props}
) => {
    const {user} = useAuth();
    const canDelete = (user: any) => user?.category.toUpperCase() == 'ADMIN' || (event?.creator && event?.creator?._id == user?._id);
    const canRSVP = (user: any) => {
        return !event?.invitedUsers || event?.invitedUsers.length == 0 || event?.invitedUsers.includes(user);
    }

    return (
        <>

            <div
                className={`${styles.cardContainer} ${selected ? styles.selected : ''}`}>
                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={1}
                    className={styles.cardContent}>
                    <Flex flexDirection='row' justifyContent='space-between'>
                        {event.title}
                        <EditEventModal initialEvent={event} onUpdate={newEvent => {
                            event = newEvent;
                            onUpdate(newEvent);
                        }}/>
                    </Flex>
                </Box>

                <Box>
                    <Flex
                        flexDirection='row'
                        justifyContent='space-between'
                        mt='1vh'
                    >
                        {FormatDate.short(event as unknown as EventModel)}
                        {canDelete(user) && <DeleteButton event={event} onDelete={onDelete}/>}
                        {canRSVP(user) ?
                            (<EventRSVP event={event}/>)
                            : (<div></div>)
                        }
                    </Flex>
                </Box>
            </div>
        </>
    )
}

const DeleteButton: FunctionComponent<{ event: EventModel, onDelete: () => void }> =
    ({
         event,
         onDelete
     }) => {
        const {isOpen, onOpen, onClose} = useDisclosure();
        const cancelRef = React.useRef();

        const deleteEvent = async () => {
            console.log("delete fired");
            onClose();
            fetch(`/api/event/${event._id}`, {
                method: 'DELETE'
            })
                .then(res => res.text())
                .then(res => console.log(res))
                .finally(onDelete);
        };

        return (
            <>
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef as RefObject<any>}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Event
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure? You can&apos;t undo this action afterwards.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' onClick={deleteEvent} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
                <Button
                    // isLoading
                    // loadingText='Deleting'
                    colorScheme='red'
                    onClick={onOpen}
                >
                    Delete Event
                </Button>

            </>
        );
    }

export default EventCard;
