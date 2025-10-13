export interface Pet {
  PK: string
  entity: string;
  id: string;
  name: string;
  type: string;
  description: string;
  services: { service: string; price: number; }[];
  eventsCompleted: number;
  review: number;
  // photos?: string[];
  photos: string;
  location?: string;
}

export interface PetOfferFormProps {
  pet: Pet;
}