'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useNetwork from '@/data/network';
import GradientMap from '@/components/gradientmap';

export default function Home() {
  const [filter, setFilter] = useState('');
  const [location, setLocation] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);

  const { network, isLoading, isError } = useNetwork();
  const router = useRouter();

  // Geolocatie en favorieten laden
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
    }

    // Favorieten laden bij opstart en bij focus
    function loadFavorites() {
      const stored = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(stored);
    }

    loadFavorites();
    window.addEventListener('focus', loadFavorites);

    return () => {
      window.removeEventListener('focus', loadFavorites);
    };
  }, []);

  function handleFilterChange(e) {
    setFilter(e.target.value);
  }

  function toggleDropdown() {
    setDropdownOpen((prev) => !prev);
  }

  function handleStationClick(id) {
    setSelectedStationId(id);
    setDropdownOpen(false);
  }

  const favoriteStations = network?.stations?.filter((station) =>
    favorites.includes(station.id)
  ) || [];

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Unable to load stations</div>
      </div>
    );
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

        <div className={styles.favoriteWrapper}>
          <div className={styles.favoriteIcon} onClick={toggleDropdown}>
            ❤️
          </div>
          {dropdownOpen && (
            <ul className={styles.dropdownMenu}>
              {favoriteStations.length === 0 ? (
                <li className={styles.dropdownItem}>No favorites</li>
              ) : (
                favoriteStations.map((station) => (
                  <li
                    key={station.id}
                    className={styles.dropdownItem}
                    onClick={() => handleStationClick(station.id)}
                  >
                    {station.name.replace('velo-antwerpen - ', '')}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Map */}
      <GradientMap 
        stations={network.stations} 
        selectedStationId={selectedStationId}
      />

      {/* Bottom Nav */}
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

