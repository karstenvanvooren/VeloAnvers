// gradientmap.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './gradientmap.module.css';

export default function GradientMap({ stations }) {
  const router = useRouter();
  const [selectedStations, setSelectedStations] = useState([]);

  useEffect(() => {
    if (stations && stations.length > 0) {
      setSelectedStations(stations.slice(0, 5));
    }
  }, [stations]);

  const getStationColor = (station) => {
    const totalSlots = station.free_bikes + station.empty_slots;
    const availabilityRatio = station.free_bikes / totalSlots;

    if (availabilityRatio >= 0.7) return '#2d5016';
    if (availabilityRatio >= 0.4) return '#e65100';
    if (availabilityRatio > 0) return '#b71c1c';
    return '#1a0000';
  };

  const handleStationClick = (station) => {
    router.push(`/stations/${station.id}`);
  };

  if (selectedStations.length === 0) {
    return <div className={styles.loading}>Loading stations...</div>;
  }

  // Genereer radiale gradientlagen per station
  const radialGradients = selectedStations.map((station, index) => {
    const color = getStationColor(station);
    const positions = [
      { x: '25%', y: '20%' },
      { x: '75%', y: '20%' },
      { x: '50%', y: '50%' },
      { x: '25%', y: '75%' },
      { x: '75%', y: '75%' },
    ];
    const pos = positions[index];
    return `radial-gradient(circle at ${pos.x} ${pos.y}, ${color} 0%, transparent 40%)`;
  });

  const backgroundStyle = {
    backgroundImage: radialGradients.join(', ')
  };

  return (
    <div className={styles.container} style={backgroundStyle}>
      {selectedStations.map((station, index) => {
        const positions = [
          { top: '20%', left: '25%' },
          { top: '20%', left: '75%' },
          { top: '50%', left: '50%' },
          { top: '75%', left: '25%' },
          { top: '75%', left: '75%' }
        ];

        const position = positions[index];

        return (
          <div
            key={station.id}
            className={styles.stationZone}
            style={{
              top: position.top,
              left: position.left,
            }}
            onClick={() => handleStationClick(station)}
          >
            <div className={styles.stationInfo}>
              <div className={styles.stationName}>
                {station.name.replace('velo-antwerpen - ', '').substring(0, 20)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
