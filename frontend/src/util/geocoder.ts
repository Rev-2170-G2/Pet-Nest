const geocodeAddress = async (addresses: string[]) => {
  if (!addresses) return [];
  console.log(addresses);

  const geocoder = new google.maps.Geocoder();

  // Helper that wraps geocoder.geocode in a Promise
  const geocode = (address: string): Promise<google.maps.LatLng | null> =>
    new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          console.error('Geocoding failed for', address, status);
          resolve(null);
        }
      });
    });

  // Wait for all geocoding results
  const results = await Promise.all(addresses.map(geocode));

  // Filter out nulls
  const positions = results.filter((pos): pos is google.maps.LatLng => !!pos);

  console.log(positions); // ✅ Now this shows the filled array
  return positions;
};


export default geocodeAddress;