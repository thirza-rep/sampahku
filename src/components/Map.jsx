import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Search } from 'lucide-react';

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Komponen Pembantu untuk Pencarian Peta
function MapSearch({ setMapCenter }) {
  const [query, setQuery] = useState('');
  const map = useMap();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        map.flyTo(newCenter, 14, { duration: 1.5 });
        if (setMapCenter) setMapCenter(newCenter);
      } else {
        alert("Lokasi tidak ditemukan!");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mencari lokasi.");
    }
  };

  return (
    <div style={{
      position: 'absolute', top: '10px', right: '10px', zIndex: 1000,
      background: 'var(--bg-card)', padding: '5px', borderRadius: '8px',
      display: 'flex', alignItems: 'center', boxShadow: '0 4px 6px var(--shadow-color)',
      border: '1px solid var(--border-glass)'
    }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Cari lokasi..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ border: 'none', padding: '0.5rem', outline: 'none', background: 'transparent', width: '150px', color: 'var(--text-main)' }}
        />
        <button type="submit" style={{ background: 'var(--primary-color)', border: 'none', padding: '0.4rem', borderRadius: '6px', color: 'white', cursor: 'pointer', display: 'flex' }}>
          <Search size={16} />
        </button>
      </form>
    </div>
  );
}

// Komponen Pembantu untuk Pick Location
function LocationPicker({ onLocationSelect, setPickedLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPickedLocation([lat, lng]);
      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }
    }
  });
  return null;
}

export default function MapViewer({ markers = [], onLocationSelect, isSelectingLocation }) {
  const defaultCenter = [-6.200000, 106.816666];
  const [pickedLocation, setPickedLocation] = useState(null);

  const mapCenter = markers.length > 0 && markers[0].lat && markers[0].lng 
    ? [markers[0].lat, markers[0].lng] 
    : defaultCenter;

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%', cursor: isSelectingLocation ? 'crosshair' : 'grab' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapSearch />
        
        {isSelectingLocation && (
          <LocationPicker onLocationSelect={onLocationSelect} setPickedLocation={setPickedLocation} />
        )}

        {/* Render Temporary Marker if picking */}
        {isSelectingLocation && pickedLocation && (
          <Marker position={pickedLocation}>
            <Popup>Lokasi Dipilih</Popup>
          </Marker>
        )}
        
        {/* Render Markers */}
        {markers.map((marker, index) => {
          if (!marker.lat || !marker.lng) return null;
          
          // Membedakan Marker Sampah biasa vs Marker Warga (Oversight Admin)
          const isOversight = !!marker.warga_id && !marker.sampah_id;
          const key = marker.sampah_id || marker.warga_id || index;

          return (
            <Marker key={key} position={[marker.lat, marker.lng]}>
              <Popup>
                {isOversight ? (
                  <div style={{ padding: '0.2rem' }}>
                    <strong style={{ fontSize: '1.1em', color: '#8b5cf6' }}>Rumah: {marker.nama_warga}</strong><br/>
                    Alamat: {marker.alamat}<br/>
                    Status Iuran: <span style={{ 
                      fontWeight: 'bold',
                      color: marker.status_bayar === 'Sudah' ? '#10b981' : '#f59e0b'
                    }}>{marker.status_bayar}</span>
                  </div>
                ) : (
                  <div style={{ padding: '0.2rem' }}>
                    <strong style={{ fontSize: '1.1em', color: '#0ea5e9' }}>{marker.jenis_sampah}</strong><br/>
                    Berat: {marker.berat_kg} kg<br/>
                    Pelapor: {marker.nama_warga}<br/>
                    Alamat: {marker.alamat}<br/>
                    <span style={{ 
                      display: 'inline-block', 
                      marginTop: '5px', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8em',
                      background: marker.status === 'Selesai' ? '#d1fae5' : marker.status === 'Dibatalkan' ? '#fee2e2' : '#fef3c7',
                      color: marker.status === 'Selesai' ? '#059669' : marker.status === 'Dibatalkan' ? '#991b1b' : '#d97706'
                    }}>
                      {marker.status}
                    </span>
                  </div>
                )}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      
      {isSelectingLocation && (
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#38bdf8', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', pointerEvents: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
          Klik pada peta untuk memilih lokasi penjemputan
        </div>
      )}
    </div>
  );
}
