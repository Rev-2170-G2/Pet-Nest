import { Pet } from "./Pet";

export interface Offer {
  requesterSK: string | Pet | Event;
  requestedSK: string;
  requestedOwnerId: string;
  services: string[];
  description: string;
}

export interface IndividualUser{
  name: string | undefined;
  id: string;
}