import { useState } from "react";
import OffersList from "./OffersList";

export default function Offers() {
  const [tab, setTab] = useState<"sent" | "received">("sent");

  const olive = "#6B8E23";

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group w-50" role="group">
          <button
            type="button"
            className="btn flex-fill"
            onClick={() => setTab("sent")}
            style={{
              backgroundColor: tab === "sent" ? olive : "transparent",
              color: tab === "sent" ? "white" : olive,
              borderColor: olive
            }}
          >
            Sent
          </button>
          <button
            type="button"
            className="btn flex-fill"
            onClick={() => setTab("received")}
            style={{
              backgroundColor: tab === "received" ? olive : "transparent",
              color: tab === "received" ? "white" : olive,
              borderColor: olive
            }}
          >
            Received
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="w-100 w-md-75">
          <OffersList url={tab === "sent" ? "/api/offers/sent" : "/api/offers/received"} />
        </div>
      </div>
    </div>
  );
}