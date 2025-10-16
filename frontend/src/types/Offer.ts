export interface Offer {
  id: string;
  requesterPK: string;
  requesterSK: string;
  requestedPK: string;
  requestedSK: string;
  services: { service: string; price: number }[];
  description?: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}

export interface IndividualUser{
  name: string | undefined;
  id: string;
}

export interface OfferCardProps {
  url: string;
  tab: "sent" | "received";
}