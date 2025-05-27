'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './gradientmap.module.css';

export default function GradientMap({ stations }) {
  const router = useRouter();
  const [selectedStations, setSelectedStations] = useState([]);

  useEffect(() => {
    if (stations && stations.length > 0) {
      const shuffled = [...stations].sort(() => 0.5 - Math.random());
      setSelectedStations(shuffled.slice(0, 5));
    }
  }, [stations]);

  const getStationColor = (station) => {
    const total = station.free_bikes + station.empty_slots;
    const ratio = station.free_bikes / total;

    if (ratio >= 0.7) return '#2d5016'; // veel
    if (ratio >= 0.4) return '#e65100'; // matig
    if (ratio > 0) return '#b71c1c'; // weinig
    return '#1a0000'; // geen
  };

  const handleStationClick = (station) => {
    router.push(`/stations/${station.id}`);
  };

  if (selectedStations.length === 0) {
    return <div className={styles.loading}>Loading stations...</div>;
  }

  const positions = [
    { top: '20%', left: '25%' },
    { top: '35%', left: '60%' },
    { top: '50%', left: '30%' },
    { top: '65%', left: '70%' },
    { top: '75%', left: '40%' },
  ];

  const radialGradients = selectedStations.map((station, i) => {
    const color = getStationColor(station);
    const { top, left } = positions[i];
    return `radial-gradient(circle at ${left} ${top}, ${color} 0%, transparent 35%)`;
  });

  const gradientStyle = {
    backgroundImage: radialGradients.join(', ')
  };

  return (
    <div className={styles.container} style={gradientStyle}>
      {selectedStations.map((station, index) => {
        const { top, left } = positions[index];
        return (
          <div
            key={station.id}
            className={styles.stationZone}
            style={{ top, left }}
            onClick={() => handleStationClick(station)}
            title={station.name} // bij hover naam tonen
          />
        );
      })}

      <div className={styles.legend}>
        <div className={styles.legendTitle}>Beschikbaarheid</div>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#2d5016' }}></div>
            <span>Veel (70%+)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#e65100' }}></div>
            <span>Matig (40–70%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#b71c1c' }}></div>
            <span>Weinig (1–40%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#1a0000' }}></div>
            <span>Geen (0%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}








