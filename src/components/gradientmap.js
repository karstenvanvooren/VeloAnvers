import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './gradientmap.module.css';

export default function GradientMap({ stations }) {
  const router = useRouter();
  const [selectedStations, setSelectedStations] = useState([]);

  useEffect(() => {
    // Selecteer de eerste 3 stations voor de demo
    if (stations && stations.length > 0) {
      setSelectedStations(stations.slice(0, 3));
    }
  }, [stations]);

  const getStationColor = (station) => {
    const totalSlots = station.free_bikes + station.empty_slots;
    const availabilityRatio = station.free_bikes / totalSlots;
    
    if (availabilityRatio >= 0.7) {
      return '#2d5016'; // Donker groen - veel fietsen
    } else if (availabilityRatio >= 0.4) {
      return '#e65100'; // Oranje - matige beschikbaarheid
    } else if (availabilityRatio > 0) {
      return '#b71c1c'; // Rood - weinig fietsen
    } else {
      return '#1a0000'; // Donkerrood - geen fietsen
    }
  };

  const handleStationClick = (station) => {
    router.push(`/stations/${station.id}`);
  };

  if (selectedStations.length === 0) {
    return <div className={styles.loading}>Loading stations...</div>;
  }

  // Genereer gradient stops gebaseerd op de 3 stations
  const gradientStops = selectedStations.map((station, index) => {
    const color = getStationColor(station);
    const position = (index / (selectedStations.length - 1)) * 100;
    return `${color} ${position}%`;
  }).join(', ');

  const gradientStyle = {
    background: `linear-gradient(135deg, ${gradientStops})`
  };

  return (
    <div className={styles.container} style={gradientStyle}>
      {selectedStations.map((station, index) => {
        // Positioneer de klikbare gebieden op verschillende plekken
        const positions = [
          { top: '20%', left: '25%' }, // Station 1 - linksboven
          { top: '50%', left: '50%' }, // Station 2 - midden
          { top: '75%', left: '75%' }  // Station 3 - rechtsonder
        ];

        const position = positions[index];
        const totalSlots = station.free_bikes + station.empty_slots;
        const availabilityRatio = station.free_bikes / totalSlots;

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
                {station.name.replace('velo-antwerpen - ', '').substring(0, 20)}...
              </div>
              <div className={styles.bikeCount}>
                🚲 {station.free_bikes}
              </div>
              <div className={styles.statusText}>
                {availabilityRatio >= 0.7 ? 'Veel beschikbaar' :
                 availabilityRatio >= 0.4 ? 'Matig beschikbaar' :
                 availabilityRatio > 0 ? 'Weinig beschikbaar' : 'Geen beschikbaar'}
              </div>
            </div>
            <div className={styles.ripple}></div>
          </div>
        );
      })}
      
      <div className={styles.legend}>
        <div className={styles.legendTitle}>Beschikbaarheid</div>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#2d5016'}}></div>
            <span>Veel (70%+)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#e65100'}}></div>
            <span>Matig (40-70%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#b71c1c'}}></div>
            <span>Weinig (1-40%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{backgroundColor: '#1a0000'}}></div>
            <span>Geen (0%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}