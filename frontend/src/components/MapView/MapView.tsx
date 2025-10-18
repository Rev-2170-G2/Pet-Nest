import { Map, ControlPosition } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import AutoCompleteControl from './AutoComplete/AutoCompleteControl';
import AutoCompleteResult from './AutoComplete/AutoCompleteResult';
import CustomMarker from './CustomMarkers/CustomMarkers';
import geocoder from '../../util/geocoder';
import { Pet } from '../../types/Pet';
import { Event } from '../../types/Event';
import './AutoComplete/AutoCompleteControl.css';

type Props = {
  showAutoComplete?: boolean;
  selectedPlace?: google.maps.places.Place | null;
  setSelectedPlace?: (  place: google.maps.places.Place | null) => void;
  height: string;
  width: string;
  positions?: Pet[] | Event[];
  markerType?: string | null;
}

export default function MapView({showAutoComplete, setSelectedPlace, selectedPlace, height, width, positions, markerType}: Props) {
  const [spots, setSpots] = useState<
    { item: Pet | Event; location: google.maps.LatLng }[]
    >([]);
  
    useEffect(() => {
      const getLocations = async () => {
        if (positions) {
          const validSpots = positions
          .filter(i => i.location && i.location.trim().length > 0);

            const locations = await geocoder(validSpots.map(i => i.location!));
            setSpots(positions.map((item, i) => ({
                item,
                location: locations[i],
            })));
        };
      }
      getLocations();
  }, [positions])

  return (
    <>
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

      {positions && markerType && (
        <CustomMarker markerSpots={spots} markerType={markerType} />
      )}
      </Map>
    </>
  )
}