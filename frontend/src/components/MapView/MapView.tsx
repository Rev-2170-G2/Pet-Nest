import { Map, ControlPosition } from '@vis.gl/react-google-maps';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import AutoCompleteControl from './AutoCompleteControl';
import AutoCompleteResult from './AutoCompleteResult';
import './AutoCompleteControl.css';
type Props = {}

export type AutocompleteMode = {id: string; label: string};

export default function MapView({}: Props) {

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.Place | null>(null);

  return (
    <>
    <Container>
      <Map
      mapId={'DEMO_MAP_ID'}
        style={{width: '40vw', height: '40vh'}}
        defaultCenter={{lat: 0, lng: 0}}
        defaultZoom={3}
        gestureHandling='greedy'
        disableDefaultUI
        >
        <AutoCompleteControl
          controlPosition={ControlPosition.TOP_LEFT}
          onPlaceSelect={setSelectedPlace}
        />

        <AutoCompleteResult place={selectedPlace} />

      </Map>
    </Container>
    </>
  )
}
