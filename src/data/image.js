import useSWR from 'swr';

export default function useImage(station) {
  const isValid = station && typeof station.latitude === 'number' && typeof station.longitude === 'number';
  const shouldFetch = isValid;
  const lat = station?.latitude;
  const lon = station?.longitude;

  const streetViewFetcher = async (key) => {
    const [, lat, lon] = key.split('_');
    
    const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_STREETVIEW_API_KEY}`;
    
    try {
      const response = await fetch(metadataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const metadata = await response.json();
      
      if (metadata.status === 'OK') {
        return `https://maps.googleapis.com/maps/api/streetview?size=400x300&location=${lat},${lon}&heading=151.78&pitch=-0.76&key=${process.env.NEXT_PUBLIC_GOOGLE_STREETVIEW_API_KEY}`;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Street View API error:', err);
      throw new Error('Failed to check Street View availability');
    }
  };

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `streetview_${lat}_${lon}` : null,
    streetViewFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3600000,
    }
  );

  return {
    image: data || null,
    isLoading,
    isError: error || !isValid
  };
}