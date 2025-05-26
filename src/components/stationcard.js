import styles from './stationcard.module.css';

export default function StationCard({ station, onClick }) {
  // Calculate status based on available bikes and empty slots
  const totalSlots = station.free_bikes + station.empty_slots;
  const availabilityRatio = station.free_bikes / totalSlots;
  
  // Determine gradient based on availability
  const getGradient = () => {
    if (availabilityRatio > 0.7) {
      return 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)'; // Green - Good
    } else if (availabilityRatio > 0.3) {
      return 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)'; // Yellow - Medium
    } else {
      return 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)'; // Red - Low
    }
  };

  const getStatusText = () => {
    if (availabilityRatio > 0.7) return 'Good';
    if (availabilityRatio > 0.3) return 'Medium';
    return 'Low';
  };

  return (
    <div 
      className={styles.card}
      style={{ background: getGradient() }}
      onClick={onClick}
    >
      <div className={styles.cardContent}>
        <div className={styles.stationNumber}>
          {station.id.slice(-2)}
        </div>
        <div className={styles.bikeCount}>
          🚲 {station.free_bikes}
        </div>
        <div className={styles.status}>
          {getStatusText()}
        </div>
        {station.distance > 0 && (
          <div className={styles.distance}>
            {station.distance.toFixed(1)}km
          </div>
        )}
      </div>
      <div className={styles.cardOverlay}>
        <div className={styles.stationName}>
          {station.name.replace('velo-antwerpen - ', '')}
        </div>
      </div>
    </div>
  );
}