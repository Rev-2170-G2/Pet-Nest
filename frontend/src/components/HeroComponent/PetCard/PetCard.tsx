import { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import './styles.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Pet } from "../../../types/Pet";
import PetFilter from "../PetFilter/PetFilter";
import MapView from '../../MapView/MapView';
import MapPopup from '../../MapView/MapPopup/MapPopup';

function PetCard() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMap, setShowMap] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/pets");
                console.log(response.data);
                setPets(response.data.data.Items);
            } catch (error) {
                console.error("Error fetching pets: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPets();
    }, [])

    const getPetsByType = async (type: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/pets/type/${type}`);
            setPets(response.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading...</p>

  return (
    <div className="d-flex flex-column">
        <div className="mb-2 mx-3 d-flex flex-row">
            <PetFilter onSelectType={(type: string) => getPetsByType(type)} />
            <button className='btn btn-info h-75 my-auto' onClick={() => setShowMap(true)}>Show Map</button>
            <MapPopup
            isOpen={showMap}
            onClose={() => setShowMap(false)}
            positions={pets}
            markerType='pets' />
        </div>

        <div className="petcard-container">
            {pets.map((pet, index) => (
            <div key={index} className="pet-card">
                <Card className="card-root">
                <CardMedia className="card-media"
                    image={Array.isArray(pet.photos) ? pet.photos?.[0] : pet.photos}
                    title={pet.entity}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {pet.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {"Location: " + pet.location}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {pet.description}
                    </Typography>
                </CardContent>
                <CardActions className="card-actions">
                    <Button size="small" onClick={() => navigate(`/pets/${pet.id}`)}>Pick Me</Button>
                </CardActions>
                </Card>
            </div>
            ))}
        </div>
    </div>
  );
}

export default PetCard;