export interface Pet {
  entity: string;
  id: string;
  name: string;
  type: string;
  description: string;
  services: { service: string; price: number; }[];
  eventsCompleted: number;
  review: { createdAt: string; rating: number; reviewText: string; }[];
  photos: string[] | string;
  location?: string;
  PK: string;
}

export interface PetOfferFormProps {
  pet: Pet;
  handleClose: () => void;
}