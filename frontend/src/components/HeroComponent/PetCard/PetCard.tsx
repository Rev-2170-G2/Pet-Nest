import React, { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import './styles.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

interface Pet {
    id: string;
    entity: string;
    photos: string;
    name: string;
    location: string;
    description: string;
}

function PetCard() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) return <p>Loading...</p>

  return (
    <div className="petcard-container">
        {pets.map((pet, index) => (
            <div key={index} className="pet-card">
                <Card className="card-root">
                <CardMedia className="card-media"
                    image={pet.photos}
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
            )
        )}
    </div>
  );
}

export default PetCard;