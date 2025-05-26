import useImage from '@/data/image';
import styles from './stationimage.module.css';

export default function StationImage(props) {
  const { image, isLoading, isError } = useImage(props.station);
 
  if (isLoading) return (
    <div className={styles.container}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingText}>Loading station image...</p>
    </div>
  );
  
  if (isError) return (
    <div className={styles.container}>
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>📷</div>
        <p className={styles.errorText}>Unable to load image</p>
      </div>
    </div>
  );
  
  if (!image) return (
    <div className={styles.container}>
      <div className={styles.noImageState}>
        <div className={styles.noImageIcon}>🏢</div>
        <p className={styles.noImageText}>No street view available</p>
        <p className={styles.noImageSubtext}>This station doesn't have street imagery</p>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <img 
        src={image} 
        alt={`Street view of ${props.station.name}`}
        className={styles.stationImage}
        loading="lazy"
      />
      <div className={styles.imageOverlay}>
        <div className={styles.imageLabel}>
          Street View
        </div>
      </div>
    </div>
  );
}