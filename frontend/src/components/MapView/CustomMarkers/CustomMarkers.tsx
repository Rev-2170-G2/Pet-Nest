import React, { useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import classNames from 'classnames';
import { Pet } from '../../../types/Pet';
import { Event } from '../../../types/Event';
import RoomIcon from '@mui/icons-material/Room';
import PetListingDetails from '../ListingDetails/PetListingDetails';
import EventListingDetails from '../ListingDetails/EventListingDetails';

type Props = { 
    markerSpots: { item: Pet | Event; location: google.maps.LatLng}[];
    markerType: string;
}

function CustomMarker({markerSpots, markerType}: Props) {
    // const [positions, setPositions] = useState<
    // { item: Pet | Event; location: google.maps.LatLng }[]
    // >([]);
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
    const [hovered, setHovered] = useState(false);

    // useEffect(() => {
    //     const getLocations = async () => {
          
    //       const validSpots = markerSpots
    //       .filter(i => i.location && i.location.trim().length > 0);

    //         const locations = await geocoder(validSpots.map(i => i.location!));
    //         setPositions(markerSpots.map((item, i) => ({
    //             item,
    //             location: locations[i],
    //         })));
    //     };
    //     getLocations();
    // }, [markerSpots])


     const renderCustomPin = (item: Pet | Event) => {
        return (
        <>
            <div className="custom-pin"
              style={{
                border: '2px solid 12271e',
                borderRadius: '12px',
                background: '#f4f4f4',
                boxShadow: '0 2px 8px rgba(0,0,0,0,2)',
              }}
              >
            <button className="close-button">
                <span className="material-symbols-outlined"> close </span>
            </button>
            {markerType === 'pets' ? (
                <PetListingDetails details={item as Pet}/>
            ) : (
                <EventListingDetails details={item as Event}/>
            )}
            </div>

            <div className="tip" />
        </>
        );
    };


    return (
    <>
      {markerSpots.map(({ item, location }) => (
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
          zIndex={activeMarker === item.id ? 9999 : 1}
          borderColor
        >
          {activeMarker === item.id
          ? renderCustomPin(item)
          : <div className='custom-pin'><RoomIcon className='icon' color='info' fontSize='large'/></div>}
        </AdvancedMarker>
      ))}
    </>
  );
}

export default React.memo(CustomMarker); //thought this might reduce lag