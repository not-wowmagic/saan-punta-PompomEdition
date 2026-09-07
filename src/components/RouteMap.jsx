import React, { useEffect, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Lock, Unlock, MapPin } from 'lucide-react';
import { MODE_LABELS } from '../utils/constants';
import { CLINICAL_HOSPITALS } from '../data/clinicalHospitals';

const hospitalIdSet = new Set(CLINICAL_HOSPITALS.map(h => h.id));

// Fix Vite asset loader resolving for Leaflet marker icon images
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const createPompomOriginMarker = () => {
  return L.divIcon({
    html: `
      <div class="custom-pompom-pin-wrapper origin-pin">
        <div class="pompom-origin-pin-container">
          <div class="pompom-pin-circle-frame">
            <img src="/mascot.png" alt="Start" class="pompom-pin-mascot-img" />
          </div>
          <div class="pompom-pin-pointer-triangle"></div>
          <span class="pompom-pin-start-badge">START</span>
        </div>
      </div>
    `,
    className: 'custom-pompom-div-icon',
    iconSize: [48, 56],
    iconAnchor: [24, 54],
    popupAnchor: [0, -54]
  });
};

const createPuddingDestMarker = () => {
  return L.divIcon({
    html: `
      <div class="custom-pompom-pin-wrapper dest-pin">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 48" width="38" height="44" class="pompom-map-svg">
          <path d="M 21 46 C 21 46 5 32 5 19 A 16 16 0 0 1 37 19 C 37 32 21 46 21 46 Z" fill="#B45309" />
          <path d="M 21 43 C 21 43 7 30 7 19 A 14 14 0 0 1 35 19 C 35 30 21 43 21 43 Z" fill="#F59E0B" />
          <circle cx="21" cy="18" r="8.5" fill="#FFFFFF" />
          <circle cx="21" cy="18" r="4" fill="#B45309" />
        </svg>
      </div>
    `,
    className: 'custom-pompom-div-icon',
    iconSize: [38, 44],
    iconAnchor: [19, 44],
    popupAnchor: [0, -44]
  });
};

const createHospitalMarker = (isHighlighted) => {
  const pinFill = isHighlighted ? "#E11D48" : "#EF4444";
  const borderFill = isHighlighted ? "#9F1239" : "#B91C1C";

  return L.divIcon({
    html: `
      <div class="custom-pompom-pin-wrapper hospital-pin ${isHighlighted ? 'highlighted-pin' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="32" height="40" class="hospital-map-svg">
          <path d="M 18 42 C 18 42 4 28 4 18 A 14 14 0 0 1 32 18 C 32 28 18 42 18 42 Z" fill="${borderFill}" />
          <path d="M 18 39 C 18 39 6 26 6 18 A 12 12 0 0 1 30 18 C 30 26 18 39 18 39 Z" fill="#FFFFFF" />
          <rect x="15" y="10" width="6" height="16" rx="1.5" fill="${pinFill}" />
          <rect x="10" y="15" width="16" height="6" rx="1.5" fill="${pinFill}" />
        </svg>
      </div>
    `,
    className: 'custom-pompom-div-icon',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40]
  });
};

const createTransferMarker = () => {
  return L.divIcon({
    html: `
      <div class="custom-pompom-pin-wrapper transfer-pin">
        <div class="transfer-pin-bubble">
          <div class="transfer-dot-inner"></div>
        </div>
      </div>
    `,
    className: 'custom-pompom-div-icon',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });
};

const POMPOM_ORIGIN_ICON = createPompomOriginMarker();
const PUDDING_DEST_ICON = createPuddingDestMarker();
const HIGHLIGHTED_HOSPITAL_ICON = createHospitalMarker(true);
const REGULAR_HOSPITAL_ICON = createHospitalMarker(false);
const TRANSFER_ICON = createTransferMarker();

// Component to handle auto-fitting map view boundaries to the active route
function MapBoundsUpdater({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
        animate: true,
        duration: 1.2
      });
    }
  }, [bounds, map]);

  return null;
}

// Invalidate Leaflet sizing when switching tabs or viewports on mobile
function MapResizeHandler({ isVisible, bounds }) {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    const triggerResize = () => {
      map.invalidateSize();
      if (bounds && bounds.length > 0) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          animate: false
        });
      }
    };

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        triggerResize();
      });
      observer.observe(container);
    }

    if (isVisible) {
      triggerResize();
      const timer1 = setTimeout(triggerResize, 100);
      const timer2 = setTimeout(triggerResize, 350);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        if (observer) observer.disconnect();
      };
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [map, isVisible, bounds]);

  return null;
}

// Module-level cache that persists in localStorage, capped at 200 entries to protect quota limits
const MAX_CACHE_SIZE = 200;
const roadCoordsCache = new Map();
try {
  const cached = localStorage.getItem('saan_punta_road_coords_cache');
  if (cached) {
    const parsed = JSON.parse(cached);
    const entries = Array.isArray(parsed) ? parsed : Object.entries(parsed);
    for (const [k, v] of entries) {
      roadCoordsCache.set(k, v);
    }
  }
} catch (e) {
  console.warn("Failed to load road coords cache from localStorage", e);
}

function saveCoordsCache() {
  try {
    if (roadCoordsCache.size > MAX_CACHE_SIZE) {
      const keysToEvict = Array.from(roadCoordsCache.keys()).slice(0, roadCoordsCache.size - MAX_CACHE_SIZE);
      for (const key of keysToEvict) {
        roadCoordsCache.delete(key);
      }
    }
    localStorage.setItem('saan_punta_road_coords_cache', JSON.stringify(Array.from(roadCoordsCache.entries())));
  } catch (e) {
    console.warn("Failed to save road coords cache to localStorage", e);
  }
}

function MapInteractionController({ isLocked }) {
  const map = useMap();
  useEffect(() => {
    if (isLocked) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      if (map.tap) map.tap.disable();
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      if (map.tap) map.tap.enable();
    }
  }, [isLocked, map]);
  return null;
}

function RouteMap({ activeRoute, nodesById, allNodes = [], isVisible = false }) {
  const defaultCenter = [14.6574, 120.9842]; // Monumento / Metro Manila north
  const [mapCenter] = useState(defaultCenter);
  const [routeSegments, setRouteSegments] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRoadSegments() {
      if (!activeRoute || !activeRoute.legs || activeRoute.legs.length === 0) {
        setRouteSegments([]);
        setBounds(null);
        return;
      }

      const segments = [];
      const allPoints = [];

      for (let i = 0; i < activeRoute.legs.length; i++) {
        const step = activeRoute.legs[i];
        const fromNode = nodesById[step.fromNode];
        const toNode = nodesById[step.toNode];

        if (!fromNode || !toNode) continue;

        const straightLine = [
          [fromNode.lat, fromNode.lng],
          [toNode.lat, toNode.lng]
        ];

        allPoints.push([fromNode.lat, fromNode.lng]);
        allPoints.push([toNode.lat, toNode.lng]);

        const cacheKey = `${fromNode.id}_${toNode.id}`;
        let coordinates = roadCoordsCache.get(cacheKey);

        if (!coordinates) {
          try {
            const url = `https://router.project-osrm.org/route/v1/driving/${fromNode.lng},${fromNode.lat};${toNode.lng},${toNode.lat}?overview=full&geometries=geojson`;
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              if (data.routes && data.routes[0] && data.routes[0].geometry) {
                coordinates = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                roadCoordsCache.set(cacheKey, coordinates);
                saveCoordsCache();
              }
            }
          } catch (e) {
            console.warn("OSRM road routing failed, falling back to straight line:", e);
          }
        }

        const finalCoords = coordinates || straightLine;
        segments.push({
          step,
          coordinates: finalCoords,
          fromNode,
          toNode
        });

        if (finalCoords) {
          finalCoords.forEach(pt => allPoints.push(pt));
        }
      }

      if (isMounted) {
        setRouteSegments(segments);
        if (allPoints.length > 0) {
          setBounds(allPoints);
        }
      }
    }

    fetchRoadSegments();

    return () => {
      isMounted = false;
    };
  }, [activeRoute, nodesById]);

  // Extract start, end, and transfer nodes for the active route
  const startNodeId = activeRoute && activeRoute.legs.length > 0 ? activeRoute.legs[0].fromNode : null;
  const endNodeId = activeRoute && activeRoute.legs.length > 0 ? activeRoute.legs[activeRoute.legs.length - 1].toNode : null;

  const routeNodeIds = new Set();
  if (activeRoute && activeRoute.legs) {
    activeRoute.legs.forEach(leg => {
      routeNodeIds.add(leg.fromNode);
      routeNodeIds.add(leg.toNode);
    });
  }

  return (
    <div className="map-wrapper" id="pompom-map-container">
      <div className="map-toolbar">
        <div className="map-badge">
          <MapPin size={13} className="map-badge-icon" />
          <span className="map-badge-text">Route Map</span>
        </div>

        {activeRoute && activeRoute.legs && activeRoute.legs.length > 0 && (
          <div className="map-active-steps-preview">
            {activeRoute.legs.map((step, sIdx) => {
              const toNodeObj = nodesById[step.toNode];
              const toName = toNodeObj?.name?.split(' (')[0] || step.toNode;
              return (
                <span key={sIdx} className="map-step-pill">
                  <span className="step-pill-mode">{MODE_LABELS[step.leg.mode] || step.leg.mode}</span>
                  <span className="step-pill-arrow">&rarr; {toName}</span>
                </span>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className={`lock-toggle-btn ${isLocked ? 'locked' : 'unlocked'}`}
          onClick={() => setIsLocked(!isLocked)}
          title={isLocked ? "Unlock map movement" : "Lock map movement"}
          aria-label={isLocked ? "Unlock map" : "Lock map"}
        >
          {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
          <span>{isLocked ? "Map Locked" : "Map Unlocked"}</span>
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={12}
        className="leaflet-map"
        scrollWheelZoom={!isLocked}
      >
        <MapInteractionController isLocked={isLocked} />
        <MapResizeHandler isVisible={isVisible} bounds={bounds} />
        {bounds && <MapBoundsUpdater bounds={bounds} />}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {routeSegments.map((seg, idx) => (
          <Polyline
            key={`casing-${idx}`}
            positions={seg.coordinates}
            pathOptions={{
              color: '#FFFFFF',
              weight: 8,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        ))}

        {routeSegments.map((seg, idx) => {
          const mode = seg.step.leg.mode;
          const isWalk = mode === 'walk';
          const routeColor = isWalk ? '#78350F' : '#D97706';
          return (
            <Polyline
              key={`route-${idx}`}
              positions={seg.coordinates}
              pathOptions={{
                color: routeColor,
                weight: isWalk ? 4 : 5,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: isWalk ? '6, 8' : undefined
              }}
            >
              <Popup className="pompom-leaflet-popup">
                <div className="popup-content">
                  <div className="popup-badge">
                    <span>{MODE_LABELS[mode]} {seg.step.leg.route_name ? `(${seg.step.leg.route_name})` : ''}</span>
                  </div>
                  <div className="popup-route">
                    <strong>{seg.fromNode.name}</strong> &rarr; <strong>{seg.toNode.name}</strong>
                  </div>
                  <div className="popup-fare">
                    Fare: <strong>{seg.step.fareDetails.text}</strong> ({seg.step.distance.toFixed(1)} km)
                  </div>
                  {seg.step.leg.notes && (
                    <div className="popup-notes">
                      <strong>Tip:</strong> {seg.step.leg.notes}
                    </div>
                  )}
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Render markers for active route nodes or affiliated hospital nodes */}
        {allNodes.map(node => {
          const isStart = node.id === startNodeId;
          const isEnd = node.id === endNodeId;
          const isInRoute = routeNodeIds.has(node.id);
          const isHospital = hospitalIdSet.has(node.id);

          // If there's an active route, only render route nodes + hospitals
          // If no active route, render all hospitals and key transit nodes
          if (activeRoute && !isInRoute && !isHospital) return null;

          let icon = TRANSFER_ICON;
          if (isStart) {
            icon = POMPOM_ORIGIN_ICON;
          } else if (isEnd) {
            icon = PUDDING_DEST_ICON;
          } else if (isHospital) {
            const hospMeta = CLINICAL_HOSPITALS.find(h => h.id === node.id);
            icon = hospMeta?.highlighted ? HIGHLIGHTED_HOSPITAL_ICON : REGULAR_HOSPITAL_ICON;
          }

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={icon}
            >
              <Popup className="pompom-leaflet-popup">
                <div className="popup-content">
                  <div className="popup-title">
                    <span className="popup-type-prefix">
                      {isHospital ? 'Hospital: ' : isStart ? 'Origin: ' : isEnd ? 'Destination: ' : 'Stop: '}
                    </span>
                    {node.name}
                  </div>
                  {isHospital && (
                    <div className="popup-hospital-info">
                    <span className="badge-hospital-tag">Hospital</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default memo(RouteMap);
