import React, { useState, useEffect, useRef } from 'react';
import { Map, Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "pk.eyJ1IjoidGhxemltIiwiYSI6ImNtcDhubnF1YzBlc2ozNHBvaWVyNzJrMTQifQ.ZeFHJHA7JQhwwruoIRVvgw";

const getStatusColor = (status) => {
  switch(status) {
    case 'CRITICAL': return '#ef4444';
    case 'LOW': return '#f59e0b';     
    case 'DONOR': return '#3b82f6';   
    case 'OK': default: return '#22c55e';
  }
};

const LOCAL_DUMMY_DATA = [
  { id: "h1", name: "Chicago Mercy", status: "CRITICAL", location: { latitude: 41.8494, longitude: -87.6244 }, inventory: { bloodBags: 12, pharmaceuticals: 45, devices: 8 } },
  { id: "h2", name: "Northwestern Memorial", status: "OK", location: { latitude: 41.8950, longitude: -87.6210 }, inventory: { bloodBags: 98, pharmaceuticals: 312, devices: 54 } },
  { id: "h3", name: "Rush University", status: "DONOR", location: { latitude: 41.8744, longitude: -87.6690 }, inventory: { bloodBags: 200, pharmaceuticals: 480, devices: 91 } },
  { id: "h4", name: "Mount Sinai", status: "LOW", location: { latitude: 41.8610, longitude: -87.6946 }, inventory: { bloodBags: 31, pharmaceuticals: 87, devices: 19 } }
];

export default function MapViewer() {
  const mapRef = useRef(null);
  const [hospitals, setHospitals] = useState([]); 
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false); // New safety lock state
  
  const [routeOrigin, setRouteOrigin] = useState(null);
  const [routeDest, setRouteDest] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [etaMins, setEtaMins] = useState(null);

  useEffect(() => {
    setHospitals(LOCAL_DUMMY_DATA);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (routeOrigin && routeDest) {
      const fetchRoute = async () => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${routeOrigin.location.longitude},${routeOrigin.location.latitude};${routeDest.location.longitude},${routeDest.location.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes[0]) {
          setRouteGeoJSON(data.routes[0].geometry);
          setEtaMins(Math.round(data.routes[0].duration / 60)); 
        }
      };
      fetchRoute();
    } else {
      setRouteGeoJSON(null);
      setEtaMins(null);
    }
  }, [routeOrigin, routeDest]);

  // Handle forcing layout boundary refresh safely
  const handleMapLoad = () => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
    setIsMapReady(true); // Release the interaction lock
  };

  if (isLoading) {
    return <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111', color: '#fff' }}>Loading Map Components...</div>;
  }

  const closeSidebar = () => setSelectedHospital(null);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: '#111' }}>

      {/* Sidebar */}
      {selectedHospital && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '320px', height: '100%', background: '#1e293b', zIndex: 10010, display: 'flex', flexDirection: 'column', boxShadow: '4px 0 20px rgba(0,0,0,0.5)' }}>
          {/* Hospital image placeholder */}
          <div style={{ width: '100%', height: '180px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <button onClick={closeSidebar} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            {/* Name and status */}
            <div>
              <h2 style={{ margin: '0 0 6px 0', color: '#f1f5f9', fontSize: '20px', fontWeight: '700' }}>{selectedHospital.name}</h2>
              <span style={{ fontSize: '12px', fontWeight: '600', color: getStatusColor(selectedHospital.status), textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedHospital.status}</span>
            </div>

            {/* Inventory */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '8px', overflow: 'hidden' }}>
              {[
                { label: 'Blood Bags', value: selectedHospital.inventory.bloodBags, icon: '🩸' },
                { label: 'Pharmaceuticals', value: selectedHospital.inventory.pharmaceuticals, icon: '💊' },
                { label: 'Devices', value: selectedHospital.inventory.devices, icon: '🏥' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: '#0f172a', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>{icon} {label}</span>
                  <span style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '18px' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Route buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedHospital.status === 'DONOR' && (
                <button onClick={() => { setRouteOrigin(selectedHospital); closeSidebar(); }} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>Set as Supply Origin</button>
              )}
              {(selectedHospital.status === 'CRITICAL' || selectedHospital.status === 'LOW') && (
                <button onClick={() => { setRouteDest(selectedHospital); closeSidebar(); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>Set as Destination</button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {etaMins && (
        <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.9)', color: '#fff', padding: '15px 25px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 10005 }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Est. Transfer Time</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8' }}>{etaMins} mins</div>
          </div>
          <button onClick={() => { setRouteOrigin(null); setRouteDest(null); setSelectedHospital(null); }} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
            Clear Route
          </button>
        </div>
      )}

      <Map 
        ref={mapRef}
        onLoad={handleMapLoad} // Triggers safely when everything is mounted
        initialViewState={{ longitude: -87.6298, latitude: 41.8781, zoom: 11 }} 
        mapStyle="mapbox://styles/mapbox/dark-v11" 
        mapboxAccessToken={MAPBOX_TOKEN}
        cursor={isMapReady ? 'auto' : 'wait'} // Sets explicit loading cursor states
      >
        {/* Only evaluate internal visual layers once the engine is ready */}
        {isMapReady && routeGeoJSON && (
          <Source id="route-source" type="geojson" data={{ type: 'Feature', properties: {}, geometry: routeGeoJSON }}>
            <Layer id="route-line" type="line" paint={{ 'line-color': '#38bdf8', 'line-width': 5, 'line-opacity': 0.8 }} />
          </Source>
        )}

        {isMapReady && hospitals.map(hospital => {
          if (!hospital.location) return null;
          const pinColor = getStatusColor(hospital.status);
          const isOrigin = routeOrigin?.id === hospital.id;
          const isDest = routeDest?.id === hospital.id;
          
          return (
            <React.Fragment key={hospital.id}>
              <Marker longitude={hospital.location.longitude} latitude={hospital.location.latitude} anchor="bottom">
                <div onClick={(e) => { e.stopPropagation(); setSelectedHospital(hospital); }} style={{ backgroundColor: pinColor, width: hospital.status === 'DONOR' ? '28px' : '22px', height: hospital.status === 'DONOR' ? '28px' : '22px', borderRadius: '50%', border: (isOrigin || isDest) ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)', boxShadow: (isOrigin || isDest) ? `0 0 15px ${pinColor}` : `0 0 8px ${pinColor}`, cursor: 'pointer' }} />
              </Marker>

            </React.Fragment>
          );
        })}
      </Map>
    </div>
  );
}