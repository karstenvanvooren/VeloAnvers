'use client';

import styles from './page.module.css';
import useNetwork from '@/data/network';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StationImage from '@/components/StationImage';

export default function Station() {
  const { network, isLoading, isError } = useNetwork();
  const params = useParams();

  if (isLoading) return (
    <div className={styles.container}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
  
  if (isError) return (
    <div className={styles.container}>
      <div className={styles.error}>Unable to load station details</div>
    </div>
  );

  const station = network.stations.find(
    (station) => station.id === params.stationId
  );

  if (!station) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Station not found</div>
      </div>
    );
  }

  const totalSlots = station.free_bikes + station.empty_slots;
  const availabilityRatio = station.free_bikes / totalSlots;
  
  const getStatusColor = () => {
    if (availabilityRatio > 0.7) return '#00ff88';
    if (availabilityRatio > 0.3) return '#ffd700';
    return '#ff4757';
  };

  const getStatusText = () => {
    if (availabilityRatio > 0.7) return 'Excellent';
    if (availabilityRatio > 0.3) return 'Moderate';
    return 'Limited';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back
        </Link>
        <h1 className={styles.title}>Station Details</h1>
      </div>

      {/* Station Info Card */}
      <div className={styles.stationCard}>
        <div className={styles.stationHeader}>
          <h2 className={styles.stationName}>
            {station.name.replace('velo-antwerpen - ', '')}
          </h2>
          <div 
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor() }}
          >
            {getStatusText()}
          </div>
        </div>

        {/* Main Stats */}
        <div className={styles.mainStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🚲</div>
            <div className={styles.statNumber}>{station.free_bikes}</div>
            <div className={styles.statLabel}>Available Bikes</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🅿️</div>
            <div className={styles.statNumber}>{station.empty_slots}</div>
            <div className={styles.statLabel}>Empty Slots</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            Station Capacity: {station.free_bikes}/{totalSlots}
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${(station.free_bikes / totalSlots) * 100}%`,
                backgroundColor: getStatusColor()
              }}
            ></div>
          </div>
          <div className={styles.progressPercentage}>
            {Math.round((station.free_bikes / totalSlots) * 100)}% occupied
          </div>
        </div>

        {/* Additional Info */}
        <div className={styles.additionalInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Station ID:</span>
            <span className={styles.infoValue}>{station.id}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Total Capacity:</span>
            <span className={styles.infoValue}>{totalSlots} slots</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Coordinates:</span>
            <span className={styles.infoValue}>
              {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Station Image */}
      <div className={styles.imageSection}>
        <h3 className={styles.imageTitle}>Station View</h3>
        <StationImage station={station} />
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.actionButton}>
          📍 Get Directions
        </button>
        <button className={styles.actionButton}>
          ⭐ Add to Favorites
        </button>
      </div>
    </div>
  );
}
