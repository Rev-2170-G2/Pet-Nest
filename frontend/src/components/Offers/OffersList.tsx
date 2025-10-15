import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Offer } from "../../types/Offer";

export default function OffersList({ url }: {url: string}) {
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState<Offer[]>([]);

useEffect(() => {
  axios.get(url, {headers: { Authorization: `Bearer ${user?.token }`}})
    .then(res => setOffers(Array.isArray(res.data) ? res.data : []))
    .catch(err => console.error(err));
})

  if (!offers.length) return <p>No offers</p>;

  return (
    <div>
      {offers.map((offer) => (
        <div key={offer.id}>
          <p>ID: {offer.id}</p>
          <p>Description: {offer.description}</p>
          {offer.services?.length > 0 && (
            <ul>
              {offer.services.map((service, index) => (
                <li key={index}>
                  {service.service} 
                  {/* missing price? */}
                </li>
              ))}
            </ul>
          )}
          <p>Status: {offer.status}</p>
          <p>Created at: {new Date(offer.createdAt).toLocaleString()}</p>
        </div>
      ))}
      {/* add buttons to approved/denied */}
    </div>
  );
}