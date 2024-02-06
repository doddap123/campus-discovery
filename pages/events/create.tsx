import React, { FunctionComponent, useState } from 'react';
import { Box, Button, Checkbox, Divider, Flex, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import useAuth from "../../lib/useAuth";
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePlacesWidget } from "react-google-autocomplete";

export const getStaticProps = async () => {
    return {
        props: {
            mapsAPIKey: process.env.GOOGLE_MAPS_API_KEY
        }
    }
};

interface CreateProps {
    getUser: React.Dispatch<React.SetStateAction<CreateProps | undefined>>,
    mapsAPIKey: string
}

type EventFields = {
    title: string,
    description: string,
    location: string,
    capacity: number,
    startTime: any,
    endTime: any,
    requireInvites: boolean,
    invited: string | undefined
};

const Create: FunctionComponent<CreateProps> = props => {
    let router = useRouter();
    const { register, handleSubmit, watch } = useForm<EventFields>();
    const [location, setLocation] = useState<string>();

    const { ref: locationInput } = usePlacesWidget({
        apiKey: props.mapsAPIKey,
        options: {
            // Not working for whatever reason
            bounds: { east: -84.383141, north: 33.786367, south: 33.763598, west: -84.417487 },
            types: [],

        },
        onPlaceSelected: place => {
            setLocation(place?.place_id ?? location);
        },
    });

    const { user } = useAuth();

    const onSubmit: SubmitHandler<any> = async data => {
        if (!location) return;
        const allUsers = await fetch('/api/user')
            .then(response => response.json());
        const userIds = data?.invited
            ?.split(',')
            ?.map((e: string) => allUsers.find((u: any) => u.email == e.trim()))
            ?.filter((e: string) => !!e);
        const { requireInvites, location: _, ...body } = data;
        debugger;
        fetch('/api/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creator: user._id,
                ...body,
                location,
                invitedUsers: requireInvites ? userIds : undefined
            })
        })
            .then(async rawResponse => {
                console.log("Worked!");
                // props.setUser(response);
                await router.push('/events');
                await router.reload();
            })
            .catch(error => {
                console.error(error);
                alert(`There was an error: ${ error }`)
            });
    }

    return (
        <div>
            <Flex width="full" align="center" justifyContent="center">
                <Box p={ 1 }>
                    <Box textAlign="center">
                        <Heading>Create Event</Heading>
                    </Box>
                    <Box my={ 4 } textAlign="left">
                        <form onSubmit={ handleSubmit(onSubmit) }>
                            <Divider mt={ 4 } mb={ 2 }/>
                            <FormItem label={ 'Title' } isRequired>
                                <Input { ...register('title', { required: true }) } />
                            </FormItem>

                            <FormItem label={ 'Event Description' } isRequired>
                                <Input { ...register('description', { required: true }) }/>
                            </FormItem>

                            <FormItem label={ 'Location' } isRequired>
                                <Input isRequired ref={ locationInput }/>
                            </FormItem>

                            <FormItem label={ 'Capacity' } isRequired>
                                <Input
                                    type="number"
                                    { ...register('capacity', { required: true, min: 0 }) }/>
                            </FormItem>

                            <FormItem label={ 'Start Time' } isRequired>
                                <Input type="datetime-local" { ...register('startTime', { required: true }) }/>
                            </FormItem>

                            <FormItem label={ 'End Time' } isRequired>
                                <Input type="datetime-local" { ...register('endTime', { required: true }) }/>
                            </FormItem>

                            <FormItem label={ 'Require invites?' }>
                                <Checkbox { ...register('requireInvites') }/>
                            </FormItem>

                            { watch('requireInvites') ? (
                                <FormItem label={ 'Invited (comma-separated emails):' }>
                                    <Input { ...register('invited') }/>
                                </FormItem>
                            ) : undefined }

                            <Button width="text" mt={ 4 } type="submit">
                                Submit
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Flex>
        </div>
    );
}

const FormItem = (
    props: {
        isRequired?: boolean, label: string, children: React.ReactElement
    }
) => {
    return (
        <FormControl mt={ 4 } isRequired={ props.isRequired ?? false }>
            <FormLabel fontSize={ 14 }>{ props.label }</FormLabel>
            { props.children }
        </FormControl>
    );
};

export default Create;
