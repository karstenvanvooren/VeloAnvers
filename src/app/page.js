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
  }, []);

  // Favorieten laden en cleanen wanneer network data beschikbaar is
  useEffect(() => {
    if (!network?.stations) return;

    // Alleen deze 5 stations zijn toegestaan
    const allowedStationNames = [
      '017- Groenplaats',
      '002- Centraal Station - Astrid 2',
      '060- Grote Markt',
      '005- Centraal Station / Kievit',
      '081- Justitiepaleis'
    ];

    function loadAndCleanFavorites() {
      const stored = JSON.parse(localStorage.getItem('favorites')) || [];
      
      // Filter alleen stations die in de toegestane lijst staan
      const allowedStations = network.stations.filter(station => 
        allowedStationNames.some(allowedName => 
          station.name.includes(allowedName)
        )
      );
      
      const allowedStationIds = allowedStations.map(station => station.id);
      const cleanedFavorites = stored.filter(favoriteId => 
        allowedStationIds.includes(favoriteId)
      );
      
      // Update localStorage als er invalid favorites waren
      if (cleanedFavorites.length !== stored.length) {
        localStorage.setItem('favorites', JSON.stringify(cleanedFavorites));
        console.log(`Cleaned ${stored.length - cleanedFavorites.length} invalid favorites from non-allowed stations`);
      }
      
      setFavorites(cleanedFavorites);
    }

    loadAndCleanFavorites();
    
    // Event listener voor wanneer window focus krijgt
    window.addEventListener('focus', loadAndCleanFavorites);

    return () => {
      window.removeEventListener('focus', loadAndCleanFavorites);
    };
  }, [network?.stations]); // Dependency op network.stations

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

  // Alleen toegestane stations als favorieten
  const allowedStationNames = [
    '017- Groenplaats',
    '002- Centraal Station - Astrid 2',
    '060- Grote Markt',
    '005- Centraal Station / Kievit',
    '081- Justitiepaleis'
  ];

  const favoriteStations = network?.stations?.filter((station) =>
    favorites.includes(station.id) && 
    allowedStationNames.some(allowedName => 
      station.name.includes(allowedName)
    )
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