import React, { useEffect, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Lock, Unlock } from 'lucide-react';
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

// Custom Custard & Pudding SVG Markers
// Origin: Beret mascot pin cleanly contained inside circle frame!
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

// Destination: Caramel Custard Flan / Pudding!
const createPuddingDestMarker = () => {
  return L.divIcon({
    html: `
      <div class="custom-pompom-pin-wrapper dest-pin">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 54" width="42" height="48" class="pompom-map-svg">
          <!-- Outer pin drop shadow & shape -->
          <path d="M 24 53 C 24 53 6 36 6 22 A 18 18 0 0 1 42 22 C 42 36 24 53 24 53 Z" fill="#B45309" />
          <path d="M 24 50 C 24 50 8 34 8 22 A 16 16 0 0 1 40 22 C 40 34 24 50 24 50 Z" fill="#FEF3C7" />
          
          <!-- Flan pudding body -->
          <path d="M 16 28 L 19 16 L 29 16 L 32 28 Z" fill="#FDE047" stroke="#78350F" stroke-width="1.2" />
          <!-- Caramel topping -->
          <path d="M 18 17 Q 24 19 30 17 L 29 20 Q 27 22 25 20 Q 23 22 21 20 Q 19 22 18 17 Z" fill="#92400E" />
          <circle cx="24" cy="13" r="2.5" fill="#EF4444" /> <!-- Cherry on top -->
          
          <!-- Destination 'B' or Star -->
          <text x="24" y="32" fill="#78350F" font-size="7" font-family="'Fredoka', sans-serif" font-weight="700" text-anchor="middle">GOAL</text>
        </svg>
      </div>
    `,
    className: 'custom-pompom-div-icon',
    iconSize: [42, 48],
    iconAnchor: [21, 48],
    popupAnchor: [0, -48]
  });
};

// Hospital Marker: Hospital Cross with pastel pink and beret
const createHospitalMarker = (isHighlighted) => {
  const bgFill = isHighlighted ? "#FF8DA1" : "#FEE2E2";
  const crossFill = "#EF4444";
  const borderColor = isHighlighted ? "#BE185D" : "#4A2810";

  return L.divIcon({
    html: `
      <div class="custom-pompom-pin-wrapper hospital-pin ${isHighlighted ? 'highlighted-pin' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 46" width="34" height="42" class="hospital-map-svg">
          <path d="M 19 45 C 19 45 4 30 4 19 A 15 15 0 0 1 34 19 C 34 30 19 45 19 45 Z" fill="${borderColor}" />
          <path d="M 19 42 C 19 42 6 28 6 19 A 13 13 0 0 1 32 19 C 32 28 19 42 19 42 Z" fill="${bgFill}" />
          <!-- Mini beret on hospital pin -->
          <ellipse cx="19" cy="8" rx="6" ry="2.2" fill="#4A2810" />
          <circle cx="19" cy="6" r="1.2" fill="#4A2810" />
          <!-- Red cross -->
          <rect x="16.5" y="13" width="5" height="13" rx="1.5" fill="${crossFill}" />
          <rect x="12.5" y="17" width="13" height="5" rx="1.5" fill="${crossFill}" />
        </svg>
      </div>
    `,
    className: 'custom-pompom-div-icon',
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -42]
  });
};

// Transfer / Node Pin
const createTransferMarker = (labelText) => {
  return L.divIcon({
    html: `
      <div class="custom-pompom-pin-wrapper transfer-pin">
        <div class="transfer-pin-bubble">
          <span>${labelText}</span>
        </div>
      </div>
    `,
    className: 'custom-pompom-div-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const POMPOM_ORIGIN_ICON = createPompomOriginMarker();
const PUDDING_DEST_ICON = createPuddingDestMarker();
const HIGHLIGHTED_HOSPITAL_ICON = createHospitalMarker(true);
const REGULAR_HOSPITAL_ICON = createHospitalMarker(false);
const TRANSFER_ICON = createTransferMarker("🐾");

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
          <span className="pudding-spin">🍮</span>
          <span className="map-badge-text">Interactive Route Map</span>
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
          title={isLocked ? "Unlock map dragging & zoom" : "Lock map to prevent accidental scrolls"}
          aria-label={isLocked ? "Unlock map" : "Lock map"}
        >
          {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
          <span>{isLocked ? "Map Locked" : "Map Active"}</span>
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

        {/* OpenStreetMap Clean Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Unified Route Polyline: Outer High-Contrast Halo Casing */}
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

        {/* Unified Route Polyline: Continuous Golden Amber Route Line (No clashing blue/pink lines) */}
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
                    <span className="popup-icon">🐾</span>
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
                      💡 {seg.step.leg.notes}
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
                    {isHospital ? '🏥 ' : isStart ? '🚩 Origin: ' : isEnd ? '🍮 Destination: ' : '📍 '}
                    {node.name}
                  </div>
                  {isHospital && (
                    <div className="popup-hospital-info">
                      <span className="badge-hospital-tag">Affiliated Hospital</span>
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
