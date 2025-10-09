import React from 'react'
import './styles.css'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const cards = Array(4).fill(1);

function PetCard() {

  return (
    <div className="petcard-containter">
        {cards.map((_,index) => (
            <div key={index}>
                <Card sx={{ maxWidth: 250 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image="https://cdn.pixabay.com/photo/2016/09/07/23/10/cat-1652880_1280.jpg"
                    title="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    Jedi Master Cat
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Known across the galaxy, Jedi Master Cat Forhire is as cunning as she is powerful.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Pick Me</Button>
                </CardActions>
                </Card>
            </div>
            )
        )}
    </div>
  );
}

export default PetCard