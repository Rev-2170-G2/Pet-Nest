import { Map, ControlPosition } from '@vis.gl/react-google-maps';
import { Container } from 'react-bootstrap';
import { useState, useEffect, CSSProperties } from 'react';
import AutoCompleteControl from './AutoComplete/AutoCompleteControl';
import AutoCompleteResult from './AutoComplete/AutoCompleteResult';
import PetMarker from './PetMarkers/PetMarkers';
import './AutoComplete/AutoCompleteControl.css';

type Props = {
  showAutoComplete: boolean;
  selectedPlace?: google.maps.places.Place | null;
  setSelectedPlace?: (  place: google.maps.places.Place | null) => void;
  height: string;
  width: string;
  positions?: any;
  markerType?: string | null;
}

export default function MapView({showAutoComplete, setSelectedPlace, selectedPlace, height, width, positions, markerType}: Props) {
  

  return (
    <>
    <Container>
      <Map
        mapId={'DEMO_MAP_ID'}
        style={{height: height, width: width}}
        defaultCenter={{lat: 37, lng: -80}}
        defaultZoom={4}
        gestureHandling='greedy'
        disableDefaultUI
      >
      {showAutoComplete && setSelectedPlace &&(
        <AutoCompleteControl
          controlPosition={ControlPosition.TOP_LEFT}
          onPlaceSelect={setSelectedPlace}
      />
      )}

      {selectedPlace && (
        <AutoCompleteResult place={selectedPlace} />
      )}

      {positions && markerType === 'pets' ? (
        <PetMarker markerSpots={positions}></PetMarker>
      ) : (
        <></>
      )}
      </Map>
    </Container>
    </>
  )
}
