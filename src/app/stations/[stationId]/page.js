'use client';

import styles from './page.module.css';
import useNetwork from '@/data/network';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StationImage from '@/components/StationImage';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Station() {
  const { network, isLoading, isError } = useNetwork();
  const params = useParams();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
    
    // Load IBM Plex Sans font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const toggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fav) => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

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

  const isFavorited = favorites.includes(station.id);

  return (
    <div className={styles.container}>
      <Head>
        <title>Station Details | Velo Antwerpen</title>
      </Head>

      <div className={styles.headerBlack}>
        <Link href="/" className={styles.backButton}>
          ← Back
        </Link>
        <h1 className={styles.title}>Station Details</h1>
      </div>

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

        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            Station Capacity: {station.free_bikes}/{totalSlots}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${(station.free_bikes / totalSlots) * 100}%`,
                backgroundColor: getStatusColor(),
              }}
            ></div>
          </div>
          <div className={styles.progressPercentage}>
            {Math.round((station.free_bikes / totalSlots) * 100)}% occupied
          </div>
        </div>

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

      <div className={styles.imageSection}>
        <h3 className={styles.imageTitle}>Station View</h3>
        <StationImage station={station} />
      </div>

      <div className={styles.actions}>
        <a
          className={styles.actionButton}
          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🧭 Navigate with Google Maps
        </a>
        <button
          className={styles.actionButton}
          onClick={() => toggleFavorite(station.id)}
        >
          {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
        </button>
      </div>
    </div>
  );
}

