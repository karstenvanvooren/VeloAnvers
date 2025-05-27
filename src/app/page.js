'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useNetwork from '@/data/network';
import { getDistance } from '@/helpers/get-distance';
import StationCard from '@/components/stationcard';

export default function Home() {
  const [filter, setFilter] = useState('');
  const [location, setLocation] = useState({});
  const { network, isLoading, isError } = useNetwork();
  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  if (isLoading) return (
    <div className={styles.container}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
  
  if (isError) return (
    <div className={styles.container}>
      <div className={styles.error}>Unable to load stations</div>
    </div>
  );

  const stations = network.stations
    .filter((station) => station.name.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, 50);

  // Add distance to stations
  stations.map((station) => {
    if (location.latitude && location.longitude) {
      station.distance =
        getDistance(
          location.latitude,
          location.longitude,
          station.latitude,
          station.longitude
        ).distance / 1000;
    } else {
      station.distance = 0;
    }
  });

  // Sort stations by distance
  stations.sort((a, b) => a.distance - b.distance);

  function handleFilterChange(e) {
    setFilter(e.target.value);
  }

  function handleStationClick(station) {
    router.push(`/stations/${station.id}`);
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>🔍</div>
          <input 
            type="text" 
            placeholder="Search a Velo-station"
            value={filter} 
            onChange={handleFilterChange}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.favoriteIcon}>❤️</div>
      </div>

      {/* Stations Grid */}
      <div className={styles.stationsGrid}>
        {stations.map((station) => (
          <StationCard 
            key={station.id} 
            station={station}
            onClick={() => handleStationClick(station)}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        <div className={styles.navItem}>
          <div className={styles.navIcon}>📍</div>
          <span>Location</span>
        </div>
        <div className={styles.navItem}>
          <div className={styles.navIcon}>💳</div>
          <span>Velo card</span>
        </div>
        <div className={styles.navItem}>
          <div className={styles.navIcon}>⚠️</div>
          <span>Help</span>
        </div>
        <div className={styles.navItem}>
          <div className={styles.navIcon}>👤</div>
          <span>User zone</span>
        </div>
        <div className={styles.navItem}>
          <div className={styles.navIcon}>☰</div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
