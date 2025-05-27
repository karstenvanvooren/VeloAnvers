import fetcher from './_fetcher';
import useSWR from 'swr';

export default function useImage(station) {
  const isValid = station && typeof station.latitude === 'number' && typeof station.longitude === 'number';

  const shouldFetch = isValid;

  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `https://graph.mapillary.com/images?access_token=${process.env.NEXT_PUBLIC_MAPILLARY_TOKEN}&fields=id,thumb_1024_url&bbox=${station.longitude - 0.0001},${station.latitude - 0.0001},${station.longitude + 0.0001},${station.latitude + 0.0001}&limit=1`
      : null,
    fetcher
  );

  return {
    image: data?.data?.[0]?.thumb_1024_url || null,
    isLoading,
    isError: error || !isValid
  };
}
