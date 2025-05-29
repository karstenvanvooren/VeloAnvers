import useImage from '@/data/image';
import styles from './stationimage.module.css';
import Image from 'next/image';

export default function StationImage(props) {
  const station = props.station;
  
  const { image, isLoading, isError } = useImage(station);

  if (!station) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>Geen stationgegevens beschikbaar</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading station image...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>📷</div>
          <p className={styles.errorText}>Unable to load image</p>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className={styles.container}>
        <div className={styles.noImageState}>
          <div className={styles.noImageIcon}>🏢</div>
          <p className={styles.noImageText}>No street view available</p>
          <p className={styles.noImageSubtext}>This station doesn&apos;t have street imagery</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Image
        src={image}
        alt={`Street view of ${station.name || 'station'}`}
        className={styles.stationImage}
        width={400}
        height={300}
        loading="lazy"
        unoptimized={true}
        priority={false}
      />
      <div className={styles.imageOverlay}>
        <div className={styles.imageLabel}>
          Street View
        </div>
      </div>
    </div>
  );
}