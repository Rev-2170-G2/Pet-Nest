import {useEffect, useState} from 'react';
import {AdvancedMarker} from '@vis.gl/react-google-maps';
import classNames from 'classnames';
import geocoder from '../../../util/geocoder';
import { Pet } from '../../../types/Pet';
import { Event } from '../../../types/Event';
import PetDetails from '../../Pet/PetDetails';
import EventDetails from '../../Event/EventDetails';
import PetListingDetails from '../ListingDetails/ListingDetails';

type Props = { 
    markerSpots: Pet[] | Event[];
    markerType: string;
}

export default function CustomMarker({markerSpots, markerType}: Props) {
    const [positions, setPositions] = useState<
    { item: Pet | Event; location: google.maps.LatLng }[]
    >([]);
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const getLocations = async () => {
          
          const validSpots = markerSpots
          .filter(i => i.location && i.location.trim().length > 0);

            const locations = await geocoder(validSpots.map(i => i.location!));
            console.log(locations);
            setPositions(markerSpots.map((item, i) => ({
                item,
                location: locations[i],
            })));
        };
        getLocations();
    }, [markerSpots])


     const renderCustomPin = (item: Pet | Event) => {
        return (
        <>
            <div className="custom-pin">
            <button className="close-button">
                <span className="material-symbols-outlined"> close </span>
            </button>
            {markerType === 'pets' ? (
                <PetListingDetails details={item as Pet}/>
            ) : (
                <EventDetails event={item as Event}/>
            )}
            </div>

            <div className="tip" />
        </>
        );
    };


    return (
    <>
      {positions.map(({ item, location }, i) => (
        <AdvancedMarker
          key={item.id}
          position={location}
          title={`${item.name}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={classNames('pets-items-marker', { 
            activeMarker: activeMarker === item.id, 
            hovered })}
          onClick={() => setActiveMarker(activeMarker === item.id ? null : item.id )}
        >
          {activeMarker === item.id
          ? renderCustomPin(item)
          : <div className='custom-pin'><div className='icon'>📍</div></div>}
          {/* <div>something is gonna go here</div> */}
        </AdvancedMarker>
      ))}
    </>
  );
}