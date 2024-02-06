import {FunctionComponent, useEffect, useState} from "react";
import EventCard from "../components/Event/EventCard";
import {EventModel} from "../db/model/Event";
import {Button, Flex, Grid, GridItem, ListItem, Spinner, Text, UnorderedList} from "@chakra-ui/react";
import EventDetails from "../components/Event/EventDetails";
import {MdArrowLeft, MdArrowRight} from "react-icons/md";
import styles from "./index.module.scss";
import { IUser } from "../db/model/User";
import useAuth from "../lib/useAuth";
import { ObjectId, Types } from "mongoose";

interface RSVPListProps {

}



const rsvplist: FunctionComponent<RSVPListProps> = props => {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<EventModel>();
    const [page, setPage] = useState(0);
    const { user } = useAuth();
    useEffect(() => {
        setSelected(undefined);
    }, [page]);

    const [test, setTest] = useState<any>([]);
    useEffect(() => {
        setLoading(true);
        
        fetch('/api/event')
            .then(async res => {
                const data: EventModel[] = await res.json();
                let count = 0;
                data.forEach(e => {
                    e.startTime = new Date(e.startTime);
                    e.endTime = new Date(e.endTime);
                    e.rsvp.yes.forEach(d => {
                        if (d._id == user?._id) {
                            setTest(test => [...test, e._id]);
                        }
                    })
                });
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user]);

    useEffect(() => {
        if (page * 5 >= events.length && page > 0) {
            setPage(page - 1);
        }
    }, [events]);


    function checkConflict(eventList: EventModel[], eventID: EventModel) {
        eventList.forEach(e => {
            if (eventID._id != e._id) {
                if (e.startTime.getTime() <= eventID.startTime.getTime() && e.endTime.getTime() >= eventID.startTime.getTime()) {
                    alert("Conflict between " + eventID.title + " and " + e.title);
                    return true;
                } else if (e.startTime.getTime() <= eventID.endTime.getTime() && e.endTime.getTime() >= eventID.endTime.getTime()) {
                    alert("Conflict between " + eventID.title + " and " + e.title);
                    return true;
                } else if (e.startTime.getTime() <= eventID.startTime.getTime() && e.endTime.getTime() >= eventID.endTime.getTime()) {
                    alert("Conflict between " + eventID.title + " and " + e.title);
                    return true;
                }
            }
        });
        return false;
    }

    return (
        <div id={styles.grid}>
            {loading || test.length == 0? (
                <div className={styles.spanningContainer}>
                    <Text size='xl'>You're not RSVP'd to any events</Text>
                </div>
            ) : (
                <>
                    {events.length > 0 ? (<>
                        <div id={styles.eventListContainer}>
                            <UnorderedList listStyleType={'none'} ml={0} my={4} id={styles['events-list']}>
                                {events.slice(page * 5, page * 5 + 5).map((event, i) => {
                                    console.log(test);
                                    return (<ListItem key={event._id.toString()}
                                              onClick={() => setSelected(selected != event ? event : undefined)}
                                              className={`${styles.eventCardContainer} ${event == selected ? styles.selected : ''}`}>
                                        {(test.includes(event._id) && (!checkConflict(events, event) || true)) && <EventCard
                                            event={event}
                                            selected={event == selected}
                                            onDelete={() => {
                                                setSelected(undefined);
                                                setEvents(events.filter(e => e._id != event._id));
                                            }}
                                            onUpdate={(newEvent: EventModel) => {
                                                events[i] = {...event, ...newEvent};
                                                setEvents(events.map(e => {
                                                    e.startTime = new Date(e.startTime);
                                                    e.endTime = new Date(e.endTime);
                                                    return e;
                                                }));
                                                setSelected(events[i]);
                                            }}/> }
                                    </ListItem>);
                                }
                                )}
                            </UnorderedList>
                            {events.length > 5 ? (
                                <Flex flexDirection={'row'} justifyContent={'space-between'}>
                                    <Button disabled={page <= 0} onClick={() => {
                                        if (page > 0) {
                                            setPage(page - 1);
                                        }
                                    }}>
                                        <MdArrowLeft/>
                                    </Button>
                                    <Button disabled={events.length <= (page + 1) * 5} onClick={() => {
                                        if (events.length > (page + 1) * 5) {
                                            setPage(page + 1)
                                        }
                                    }}>
                                        <MdArrowRight/>
                                    </Button>
                                </Flex>
                            ) : ''}
                        </div>
                        <GridItem colSpan={2} zIndex={-1} className={selected ? '' : styles.noEventsContainer}>
                            {selected ? <EventDetails event={selected}/> : (
                                <div className={styles.noStuffContainer}>
                                    <Text fontSize={{base: 'xl', sm: '2xl', md: '3xl', lg: '4xl'}}>
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

export default rsvplist;