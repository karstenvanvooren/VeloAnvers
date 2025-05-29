import fetcher from './_fetcher';
import useSWR from 'swr';

export default function useImage(station) {
  const isValid = station && typeof station.latitude === 'number' && typeof station.longitude === 'number';

  const shouldFetch = isValid;

  const lat = station?.latitude;
  const lon = station?.longitude;

  // Grotere bounding box van ±100 meter (was ±10 meter)
  const delta = 0.001; // ~100 meter

  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `https://graph.mapillary.com/images?access_token=${process.env.NEXT_PUBLIC_MAPILLARY_TOKEN}&fields=id,thumb_1024_url&bbox=${lon - delta},${lat - delta},${lon + delta},${lat + delta}&limit=1`
      : null,
    fetcher
  );

  return {
    image: data?.data?.[0]?.thumb_1024_url || null,
    isLoading,
    isError: error || !isValid
  };
}


