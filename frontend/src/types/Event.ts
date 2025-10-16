import { Pet } from './Pet'

export interface Event {
  entity: string;
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  status?: string;
  photos?: string;
  PK: string;
  approved: boolean;
}

export interface EventOfferFormProps {
  event: Event;
  userPets: Pet[]
  handleClose: () => void;
}