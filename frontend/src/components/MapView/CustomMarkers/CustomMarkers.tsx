import {useEffect, useState} from 'react';
import {AdvancedMarker} from '@vis.gl/react-google-maps';
import classNames from 'classnames';
import geocoder from '../../../util/geocoder';

type Props = { 
    markerSpots: string[];
    markerType: string;
}

export default function CustomMarker({markerSpots, markerType}: Props) {
    const [positions, setPositions] = useState<google.maps.LatLng[]>([]);
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const getLocations = async () => {
            setPositions(await geocoder(markerSpots));
        } 
        getLocations();
        console.log(positions);
    }, [markerSpots])


    //  const renderCustomPin = () => {
    //     return (
    //     <>
    //         <div className="custom-pin">
    //         <button className="close-button">
    //             <span className="material-symbols-outlined"> close </span>
    //         </button>

    //         <div className="image-container">
    //             <Gallery
    //             images={pet.photos}
    //             isExtended={clicked}
    //             />
    //             <span className="icon">
    //             <h3>something goes here</h3>
    //             </span>
    //         </div>

    //         <PetListingDetails details={pet.name, pet.description, pet.location, pet.services} />
    //         </div>

    //         <div className="tip" />
    //     </>
    //     );
    // };


    return (
    <>
      {positions.map((position, i) => (
        <AdvancedMarker
          key={i}
          position={position}
          title="AdvancedMarker with custom html content."
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={classNames('real-estate-marker', { clicked, hovered })}
          onClick={() => setClicked(!clicked)}
        >
          {/* {renderCustomPin()} */}
        </AdvancedMarker>
      ))}
    </>
  );
}