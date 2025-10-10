import { Map, ControlPosition } from '@vis.gl/react-google-maps';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import AutoCompleteControl from './AutoCompleteControl';
import AutoCompleteResult from './AutoCompleteResult';
import './AutoCompleteControl.css';

type Props = {
  selectedPlace: google.maps.places.Place | null;
  setSelectedPlace: (  place: google.maps.places.Place | null) => void;
  style?: ({width: number, height: number} | null);
}

export default function MapView({setSelectedPlace, selectedPlace}: Props) {

  return (
    <>
    <div id='map-container'>
      <Map
        mapId={'DEMO_MAP_ID'}
        style={{width: '50vw', height: '35vh'}}
        defaultCenter={{lat: 37, lng: -80}}
        defaultZoom={4}
        gestureHandling='greedy'
        disableDefaultUI
      >
      <AutoCompleteControl
        controlPosition={ControlPosition.TOP_LEFT}
        onPlaceSelect={setSelectedPlace}
      />

      <AutoCompleteResult place={selectedPlace} />

      </Map>
    </div>
    </>
  )
}
