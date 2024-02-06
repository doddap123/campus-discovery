import { FunctionComponent, useEffect, useState } from "react";
import styles from './index.module.scss';
import { Client, PlaceDetailsResponse } from '@googlemaps/google-maps-services-js';
import { PlaceDetailsResponseData } from "@googlemaps/google-maps-services-js/src/places/details";
import GoogleMapReact from 'google-map-react';
import Event from '../../db/model/Event';
import { FaMapPin } from "react-icons/fa";

interface MapProps {
    mapboxAccessToken: string,
    googleMapsAPIKey: string,
    pins: any[]
}

export async function getServerSideProps() {
    const client = new Client({});
    const events = await Event.find();
    const pins =
        await Promise.all(events.map(async event => {
            const response = await client.placeDetails({
                params: {
                    place_id: event.location,
                    key: process.env.GOOGLE_MAPS_API_KEY ?? ''
                }
            });
            return {
                pin: response.data,
                title: event.title
            }
        }));
    return {
        props: {
            mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN ?? '',
            googleMapsAPIKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
            pins
        }
    }
}

const Map: FunctionComponent<MapProps> = ({ mapboxAccessToken, googleMapsAPIKey, pins }) => {
    const [dark, setDark] = useState(false);
    const [popupInfo, setPopupInfo] = useState<any>(null);

    useEffect(() => {
        const listener = (e: any) => setDark(e.matches);
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
    }, []);

    const defaultProps = {
        center: { lat: 33.7755, lng: -84.3963 },
        zoom: 16
    };

    return (
        <div id={ styles.mapbox }>
            <GoogleMapReact
                bootstrapURLKeys={ { key: googleMapsAPIKey } }
                defaultCenter={ defaultProps.center }
                defaultZoom={ defaultProps.zoom }
            >
                { pins.map(({ pin, title }, i) => (
                    <div key={ i } style={ {
                        color: 'white',
                        background: '#003057',
                        padding: '8px 8px',
                        display: 'inline-flex',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '100%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '12px'
                    } } lat={ pin.result.geometry?.location.lat } lng={ pin.result.geometry?.location.lng }>

                        { title }
                    </div>
                )) }
            </GoogleMapReact>
        </div>
    );
};

export default Map;

const Pin = ({ size = 20 }) => {
    const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;
    const pinStyle = {
        cursor: 'pointer',
        fill: '#d00',
        stroke: 'none'
    };
    return (
        <svg height={ size } viewBox="0 0 24 24" style={ pinStyle }>
            <path d={ ICON }/>
        </svg>
    );
};

const ControlPanel = () => {
    return (
        <div className="control-panel">
            <h3>Marker, Popup, NavigationControl and FullscreenControl </h3>
            <p>
                Map showing top 20 most populated cities of the United States. Click on a marker to learn
                more.
            </p>
            <p>
                Data source:{ ' ' }
                <a href="https://en.wikipedia.org/wiki/List_of_United_States_cities_by_population">
                    Wikipedia
                </a>
            </p>
            <div className="source-link">
                <a
                    href="https://github.com/visgl/react-map-gl/tree/7.0-release/examples/controls"
                    target="_new"
                >
                    View Code ↗
                </a>
            </div>
        </div>
    );
};
