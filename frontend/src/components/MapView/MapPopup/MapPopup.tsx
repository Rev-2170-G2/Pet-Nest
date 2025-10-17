// MapPopup.tsx
import { useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import MapView from "../MapView";
import './MapPopup.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  showAutoComplete?: boolean;
  selectedPlace?: google.maps.places.Place | null;
  setSelectedPlace?: (place: google.maps.places.Place | null) => void;
  positions?: any;
  markerType?: string | null;
};

export default function MapPopup({
  isOpen,
  onClose,
  positions,
  markerType,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Force Google Map to resize when popup opens
  useEffect(() => {
    if (isOpen && mapContainerRef.current) {
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
    }
  }, [isOpen]);

  if (!isOpen) return null; // Only render when open

  return (
    <div className="map-overlay">
      <Box className="map-popup" ref={mapContainerRef}>
        <IconButton
          onClick={onClose}
          className="close-btn"
          size="large"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <MapView
          height="100vh"
          width="100vw"
          positions={positions}
          markerType={markerType}
        />
      </Box>
    </div>
  );
}
