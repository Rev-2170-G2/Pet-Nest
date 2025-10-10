export interface Pet {
  id: string;
  name: string;
  type: string;
  description: string;
  services: { service: string; price: number; }[];
  eventsCompleted: number;
  review: number;
  photos?: string[];
  location?: string;
}