import styles from './stationcard.module.css';

export default function StationCard({ station, onClick }) {
  // Calculate status based on available bikes and empty slots
  const totalSlots = station.free_bikes + station.empty_slots;
  const availabilityRatio = station.free_bikes / totalSlots;
  
  // Determine gradient based on availability
  const getGradient = () => {
    if (availabilityRatio >= 0.7) {
      // Donker groen - veel fietsen beschikbaar (70%+)
      return 'linear-gradient(135deg, #2d5016 0%, #4caf50 100%)';
    } else if (availabilityRatio >= 0.4) {
      // Oranje/geel - matige beschikbaarheid (40-70%)
      return 'linear-gradient(135deg, #e65100 0%, #ff9800 100%)';
    } else if (availabilityRatio > 0) {
      // Rood - weinig fietsen beschikbaar (1-40%)
      return 'linear-gradient(135deg, #b71c1c 0%, #f44336 100%)';
    } else {
      // Donkerrood - geen fietsen beschikbaar (0%)
      return 'linear-gradient(135deg, #1a0000 0%, #d32f2f 100%)';
    }
  };

  const getStatusText = () => {
    if (availabilityRatio >= 0.7) return 'Veel';
    if (availabilityRatio >= 0.4) return 'Matig';
    if (availabilityRatio > 0) return 'Weinig';
    return 'Geen';
  };

  const getStatusIcon = () => {
    if (availabilityRatio >= 0.7) return '🟢';
    if (availabilityRatio >= 0.4) return '🟡';
    if (availabilityRatio > 0) return '🟠';
    return '🔴';
  };

  return (
    <div 
      className={styles.card}
      style={{ background: getGradient() }}
      onClick={onClick}
    >
      <div className={styles.cardContent}>
        <div className={styles.stationHeader}>
          <div className={styles.stationNumber}>
            {station.id.slice(-2)}
          </div>
          <div className={styles.statusIndicator}>
            {getStatusIcon()}
          </div>
        </div>
        
        <div className={styles.bikeInfo}>
          <div className={styles.bikeCount}>
            🚲 {station.free_bikes}
          </div>
          <div className={styles.slotsCount}>
            🅿️ {station.empty_slots}
          </div>
        </div>
        
        <div className={styles.status}>
          {getStatusText()} beschikbaar
        </div>
        
        {station.distance > 0 && (
          <div className={styles.distance}>
            📍 {station.distance.toFixed(1)}km
          </div>
        )}
      </div>
      
      <div className={styles.cardOverlay}>
        <div className={styles.stationName}>
          {station.name.replace('velo-antwerpen - ', '')}
        </div>
        <div className={styles.availabilityBar}>
          <div 
            className={styles.availabilityFill}
            style={{ 
              width: `${Math.max(availabilityRatio * 100, 5)}%`,
              backgroundColor: availabilityRatio >= 0.7 ? '#4caf50' : 
                             availabilityRatio >= 0.4 ? '#ff9800' : '#f44336'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}