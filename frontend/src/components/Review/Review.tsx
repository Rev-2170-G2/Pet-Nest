import { useState } from 'react';
import Rating from '@mui/material/Rating';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import { Pet } from '../../types/Pet';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
interface ReviewProps {
  pet: Pet;
  onReviewSubmit: (review: { rating: number; reviewText: string; createdAt: string }) => void;
}

function Review({ pet, onReviewSubmit } : ReviewProps){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState('');

  const handleClick = async () => {
    if (user?.id === pet.PK){
      toast("Users cannot give ratings to their own pets.🐾")
      return null;
    }
    const reviewData = {
      rating,
      reviewText,
    };

    try {
      const response = await axios.patch(
        `${baseUrl}/pets/${pet.id}/reviews`,
        reviewData,
        {
          headers: 
            {Authorization: `Bearer ${user?.token}`},
        }
      );

      console.log('Update success:', response.data);

      if (response){
        const reviewArray = response.data.data.review;
        console.log(reviewArray[reviewArray.length - 1])
        onReviewSubmit(reviewArray[reviewArray.length - 1]);

        toast("Great - your review was sent!")
        setRating(0);
        setReviewText('');
      } else {
        toast("Sorry, we were unable to update your review. Please contact admin for support.")
      }
    } catch (error: any) {
      console.error('Update failed:', error.response?.data || error.message);
    }
  };
  
    return (
        <Box >
          <FormControl>
            <Typography variant="h5" sx={{ mt: 1, mb: 2, fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontSize: 31, color: "black" }}>
              How was {pet.name}'s service? 
            </Typography>
            <Rating  
              name="custom-size"
              value={rating}
              onChange={(_, newValue) => setRating(newValue)} 
              sx={{ mt: 1, mb: 6, fontSize: 40 }}
            />

            <Typography variant="h5" sx={{ mt: 1, fontFamily: "Roboto, Helvetica, Arial, sans-serif", fontSize: 26, color: "black" }}>
              Write a review.
            </Typography>
            <TextField
              multiline
              rows={4}
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              fullWidth
            />

      </FormControl>
      <div>
        <Button
          onClick={handleClick}
          type="submit"
          variant="contained"
          color="success"
          size="large"
          sx={{ mt: 2, px: 4, fontSize: 20, textTransform: "none" }}
        >
          Submit
        </Button>
      </div>
      </Box>
    )
}

export default Review;