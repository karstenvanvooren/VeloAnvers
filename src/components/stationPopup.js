import styles from './stationpopup.module.css';
import Link from 'next/link';

export default function StationPopup({ station, onClose }) {
  const totalSlots = station.free_bikes + station.empty_slots;
  const availabilityRatio = station.free_bikes / totalSlots;
  
  const getStatusColor = () => {
    if (availabilityRatio > 0.7) return '#00ff88';
    if (availabilityRatio > 0.3) return '#ffd700';
    return '#ff4757';
  };

  const getStatusText = () => {
    if (availabilityRatio > 0.7) return 'Excellent availability';
    if (availabilityRatio > 0.3) return 'Moderate availability';
    return 'Limited availability';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.stationInfo}>
            <h3 className={styles.stationName}>
              {station.name.replace('velo-antwerpen - ', '')}
            </h3>
            
            <div 
              className={styles.statusIndicator}
              style={{ backgroundColor: getStatusColor() }}
            >
              <span className={styles.statusText}>{getStatusText()}</span>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>🚲</div>
              <div className={styles.statValue}>{station.free_bikes}</div>
              <div className={styles.statLabel}>Available bikes</div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statIcon}>🅿️</div>
              <div className={styles.statValue}>{station.empty_slots}</div>
              <div className={styles.statLabel}>Empty slots</div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statValue}>{totalSlots}</div>
              <div className={styles.statLabel}>Total capacity</div>
            </div>
          </div>

          {station.distance > 0 && (
            <div className={styles.distanceInfo}>
              <span className={styles.distanceIcon}>📍</span>
              <span className={styles.distanceText}>
                {station.distance.toFixed(1)}km away
              </span>
            </div>
          )}

          <div className={styles.actions}>
            <Link 
              href={`/stations/${station.id}`}
              className={styles.detailButton}
            >
              View Station Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}