import { Box, Flex, Heading, Image, SimpleGrid, Stack, Text, useColorModeValue, } from '@chakra-ui/react';
import React, { FunctionComponent } from 'react';
import { EventModel } from "../../db/model/Event";
import { MdCheck, MdClose, MdEvent, MdGroup, MdPerson, MdPlace } from "react-icons/md";
import FormatDate from "../../lib/FormatDate";
import styles from "./EventDetails.module.scss";
import { BiQuestionMark } from "react-icons/bi";
import { IAttendee } from "../../db/model/Attendee";
import { IUser } from "../../db/model/User";

interface EventDetailsProps {
    event: EventModel
}

const EventDetails: FunctionComponent<EventDetailsProps> = ({ event: event }) => {
    return (
        <div className={ styles.container }>
            <SimpleGrid
                columns={ { base: 1, xl: 2 } }
                spacing={ { base: 2, md: 3 } }>
                <Flex>
                    <Image
                        rounded={ 'md' }
                        alt={ 'product image' }
                        src={
                            event.location.toLowerCase().includes('culc')
                                ? 'culc.jpg'
                                : 'gt-generic.jpg'
                        }
                        fit={ 'cover' }
                        align={ 'center' }
                        w={ '100%' }
                        h={ { base: '100%', sm: '240px', xl: '360px' } }
                    />
                </Flex>
                <Stack spacing={ { base: 6, md: 4, lg: 6, xl: 10 } }>
                    <Box as={ 'header' }>
                        <InfoRow>
                            <Heading
                                lineHeight={ 1.1 }
                                fontWeight={ 600 }
                                fontSize={ { base: 'xl', sm: '2xl', md: '4xl', xl: '5xl' } }
                                pb={ { base: 2, sm: 4, xl: 8 } }>
                                { event.title }
                            </Heading>
                        </InfoRow>
                        <InfoRow>
                            <Text
                                color={ useColorModeValue('gray.500', 'gray.400') }
                                fontSize={ 'xl' }>
                                { event.description }
                            </Text>
                        </InfoRow>
                    </Box>

                    <Stack
                        spacing={ { base: 2, sm: 4, xl: 6 } }
                        direction={ 'column' }>
                        <InfoRow icon={ <MdEvent/> }>
                            <Text
                                color={ useColorModeValue('gray.900', 'gray.400') }
                                fontWeight={ 300 }
                                fontSize={ '2xl' }>
                                { FormatDate.long(event) }
                            </Text>
                        </InfoRow>
                        { event.creator ? (
                            <InfoRow icon={ <MdPerson/> }>
                                <Text>
                                    { event.creator.name }
                                </Text>
                            </InfoRow>) : '' }
                        <InfoRow icon={ <MdPlace/> }>
                            <Text>
                                { event.location }
                            </Text>
                        </InfoRow>
                        <InfoRow icon={ <MdGroup/> }>
                            <Text>
                                { `${ event.rsvp?.yes.length } / ${ event.capacity }` }
                            </Text>
                        </InfoRow>
                        <InfoRow icon={ <MdCheck color={ 'green' }/> }>
                            <Text>
                                { attendeesString(event.rsvp.yes) }
                            </Text>
                        </InfoRow>
                        <InfoRow icon={ <BiQuestionMark/> }>
                            <Text>
                                { attendeesString(event.rsvp.maybe) }
                            </Text>
                        </InfoRow>
                        <InfoRow icon={ <MdClose color={ 'red' }/> }>
                            <Text>
                                { attendeesString(event.rsvp.no) }
                            </Text>
                        </InfoRow>
                        {/*TODO: Attendees*/ }
                    </Stack>
                </Stack>
            </SimpleGrid>
        </div>
    );
}

const attendeesString = (attendees: IUser[]): string => {
    console.log(attendees);
    if (!attendees || attendees.length == 0) return '';
    return `${ attendees
        .map(e => e.name)
        .slice(0, attendees.length - 1)
        .join(', ') }${
        attendees.length > 1
            ? `${ attendees.length < 3 ? ',' : '' } and `
            : ''
    }${ attendees[attendees.length - 1].name }`;
}

export default EventDetails;

interface InfoRowProps {
    icon?: React.ReactElement | undefined,
    children: React.ReactElement
}

const InfoRow: FunctionComponent<InfoRowProps> = ({ icon, children }) => {
    return (
        <Flex flexDirection={ 'row' }>
            <Box
                w={ '40px' }
                display={ 'flex' }
                alignItems={ 'center' }
                justifyContent={ 'center' }>
                { icon }
            </Box>
            <Box as={ 'div' } flex={ '1' }>
                { children }
            </Box>
        </Flex>
    );
}
