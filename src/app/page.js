'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useNetwork from '@/data/network';
import GradientMap from '@/components/gradientmap';

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

  function handleFilterChange(e) {
    setFilter(e.target.value);
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

      {/* Gradient Map */}
      <GradientMap stations={network.stations} />

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
