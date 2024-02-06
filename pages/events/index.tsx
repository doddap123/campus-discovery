import { FunctionComponent, useEffect, useState } from "react";
import EventCard from "../../components/Event/EventCard";
import { EventModel } from "../../db/model/Event";
import { Button, Flex, GridItem, ListItem, Spinner, Text, UnorderedList, Box, VStack, HStack, FormControl, FormLabel, Input, FormHelperText } from "@chakra-ui/react";
import EventDetails from "../../components/Event/EventDetails";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import {GrPowerReset} from "react-icons/gr";
import styles from "./index.module.scss";
import useAuth from "../../lib/useAuth";
import { IUser } from "../../db/model/User";

interface EventsProps {

}

const Index: FunctionComponent<EventsProps> = props => {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<EventModel>();
    const [page, setPage] = useState(0);
    const [host, setHost] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    const { user } = useAuth();

    const handleHostChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setHost(e.target.value);
        setSelected(undefined);
    }

    const handleLocationChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setLocation(e.target.value);
        setSelected(undefined);
    }

    const handleDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setDate(e.target.value);
        setSelected(undefined);
        console.log(date);
    }

    useEffect(() => {
        setSelected(undefined);
    }, [page]);

    useEffect(() => {
        setLoading(true);

        fetch('/api/event')
            .then(async res => {
                const data: EventModel[] = await res.json();
                data.forEach(e => {
                    e.startTime = new Date(e.startTime);
                    e.endTime = new Date(e.endTime);
                });
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (page * 5 >= events.length && page > 0) {
            setPage(page - 1);
        }
    }, [events]);

    // var test: IUser;
    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault();
        setHost('');
        setLocation('');
        setDate('');
    }
    return (
        <div id={styles.grid}>
            {loading ? (
                <div className={styles.spanningContainer}>
                    <Spinner size='xl' />
                </div>
            ) : (
                <>
                    <Flex className={styles.filterBox}>
                        <Box>
                            <form onSubmit={handleSubmit}>
                                <HStack>
                                    <FormControl>
                                        <FormLabel>Host Email</FormLabel>
                                        <Input type='email' width='200' value={host} onChange={handleHostChange} />
                                        <FormHelperText>Enter the desired host email.</FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Location</FormLabel>
                                        <Input type='text' width='200' value={location} onChange={handleLocationChange} />
                                        <FormHelperText>Enter the desired location.</FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Date</FormLabel>
                                        <Input type='datetime-local' width='200' value={date} onChange={handleDateChange} />
                                        <FormHelperText>Enter the desired time.</FormHelperText>
                                    </FormControl>
                                    <Button type='submit' colorScheme='blue'><GrPowerReset size='56' style={{filter: 'invert(1)'}} /></Button>
                                </HStack>
                            </form>
                        </Box>
                    </Flex>
                    {events.length > 0 ? (<>
                        <div id={styles.eventListContainer}>
                            <UnorderedList listStyleType={'none'} ml={0} my={4} id={styles['events-list']}>
                                {events.slice(page * 5, page * 5 + 5).map((event, i) =>
                                    <ListItem key={event._id.toString()}
                                        onClick={() => setSelected(selected != event ? event : undefined)}
                                        className={`${styles.eventCardContainer} ${event == selected ? styles.selected : ''}`}>
                                        {(([...host].every((c, i) => c == event.creator.email[i]) || host == '') && 
                                            ([...location].every((c, i) => c == event.location[i]) || location == '') && 
                                            (date == '' || (event.startTime.getTime() <= Date.parse(date) && event.endTime.getTime() >= Date.parse(date)))) && <EventCard
                                            event={event}
                                            selected={event == selected}
                                            onDelete={() => {
                                                setSelected(undefined);
                                                setEvents(events.filter(e => e._id != event._id));
                                            }}
                                            onUpdate={newEvent => {
                                                events[i] = { ...event, ...newEvent };
                                                setEvents(events.map(e => {
                                                    e.startTime = new Date(e.startTime);
                                                    e.endTime = new Date(e.endTime);
                                                    return e;
                                                }));
                                                setSelected(events[i]);
                                            }} />}
                                    </ListItem>
                                )}
                            </UnorderedList>
                            {events.length > 5 ? (
                                <Flex flexDirection={'row'} justifyContent={'space-between'}>
                                    <Button disabled={page <= 0} onClick={() => {
                                        if (page > 0) {
                                            setPage(page - 1);
                                        }
                                    }}>
                                        <MdArrowLeft />
                                    </Button>
                                    <Button disabled={events.length <= (page + 1) * 5} onClick={() => {
                                        if (events.length > (page + 1) * 5) {
                                            setPage(page + 1)
                                        }
                                    }}>
                                        <MdArrowRight />
                                    </Button>
                                </Flex>
                            ) : ''}
                        </div>
                        <GridItem colSpan={2} zIndex={-1} className={selected ? '' : styles.noEventsContainer}>
                            {selected ? <EventDetails event={selected} /> : (
                                <div className={styles.noStuffContainer}>
                                    <Text fontSize={{ base: 'xl', sm: '2xl', md: '3xl', lg: '4xl' }}>
                                        Select an event
                                    </Text>
                                </div>
                            )}
                        </GridItem>
                    </>) : (
                        <div className={styles.spanningContainer}>
                            <div className={styles.noStuffContainer}>
                                <Text fontSize={'4xl'}>
                                    No events found
                                </Text>
                            </div>
                        </div>
                    )}
                </>
            )
            }
        </div>
    );
}

export default Index;
