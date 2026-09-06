import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Stethoscope, Navigation, Map as MapIcon, List as ListIcon } from 'lucide-react';
import routesData from './data/routes.json';
import { findRouteAlternatives } from './utils/k-shortest';
import { DEFAULT_PROFILE_ID } from './utils/profiles';
import DisclaimerBanner from './components/DisclaimerBanner';
import DisclaimerModal from './components/DisclaimerModal';
import RouteSearch from './components/RouteSearch';
import RouteList from './components/RouteList';
import DutyCommuteGuide from './components/DutyCommuteGuide';

const RouteMap = lazy(() => import('./components/RouteMap'));

export default function App() {
  const { nodes, legs } = routesData;

  const [startNode, setStartNode] = useState('monumento'); // Central transit hub default
  const [destinationNode, setDestinationNode] = useState('east_ave_med_ctr'); // Default to East Avenue Medical Center
  const [isDiscounted, setIsDiscounted] = useState(true); // Default to student discount enabled for clinical duties!
  
  // Transport preferences
  const [tricycleMode, setTricycleMode] = useState('shared');
  const [busPreference, setBusPreference] = useState('aircon');
  const [trainPreference, setTrainPreference] = useState('svc');
  const [profileId, setProfileId] = useState(DEFAULT_PROFILE_ID);
  
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('planner'); // 'planner' | 'dutyGuide'

  // Pre-build O(1) index map for node lookups
  const nodesById = useMemo(() => {
    return Object.fromEntries(nodes.map(n => [n.id, n]));
  }, [nodes]);

  // Memoize route computation
  const allRoutes = useMemo(() => {
    if (!startNode || !destinationNode || startNode === destinationNode) {
      return [];
    }
    return findRouteAlternatives(legs, startNode, destinationNode, isDiscounted, {
      profileId,
      tricycleMode,
      busPreference,
      trainPreference
    });
  }, [legs, startNode, destinationNode, isDiscounted, profileId, tricycleMode, busPreference, trainPreference]);

  // Limit display to top 15 routes
  const routes = useMemo(() => allRoutes.slice(0, 15), [allRoutes]);

  // Reset selected route index when routing inputs change
  useEffect(() => {
    setSelectedRouteIndex(0);
  }, [startNode, destinationNode, isDiscounted, profileId, tricycleMode, busPreference, trainPreference]);

  const activeRoute = routes[selectedRouteIndex] || null;

  // Handle hospital selection from the duty commute guide
  const handleSelectHospital = (hospitalId) => {
    setDestinationNode(hospitalId);
    setActiveTab('planner');
  };

  return (
    <div className="app-container pompom-theme">
      {/* Warm Custard Header */}
      <header className="app-header pompom-header">
        <div className="header-content">
          <div className="brand">
            <div className="pompom-mascot-badge">
              <img src="/mascot.png" alt="Mascot" className="header-mascot-img" />
            </div>
            
            <div className="brand-text">
              <div className="brand-title-row">
                <h1>Saan Punta</h1>
              </div>
              <p>Commute Route Finder & Clinical Hospital Duty Guide</p>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="header-nav-pills">
            <button
              type="button"
              className={`nav-pill-btn ${activeTab === 'planner' ? 'active' : ''}`}
              onClick={() => setActiveTab('planner')}
            >
              <Navigation size={15} />
              <span className="pill-label-desktop">Route Planner</span>
              <span className="pill-label-mobile">Routes</span>
            </button>
            <button
              type="button"
              className={`nav-pill-btn mobile-only-pill ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <MapIcon size={15} />
              <span>Map</span>
            </button>
            <button
              type="button"
              className={`nav-pill-btn ${activeTab === 'dutyGuide' ? 'active' : ''}`}
              onClick={() => setActiveTab('dutyGuide')}
            >
              <Stethoscope size={15} />
              <span className="pill-label-desktop">Clinical Hospital Guide</span>
              <span className="pill-label-mobile">Duties</span>
              <span className="badge-count">14</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className={`main-content tab-${activeTab}`}>
        {activeTab === 'dutyGuide' ? (
          /* Dedicated Duty Guide Full View with Quick Route Launch */
          <div className="duty-guide-full-view">
            <DutyCommuteGuide
              onSelectHospital={handleSelectHospital}
              selectedHospitalId={destinationNode}
              startNode={startNode}
              setStartNode={setStartNode}
            />
          </div>
        ) : (
          /* Split Screen on Desktop / Tabbed Switch on Mobile */
          <>
            <section className="sidebar-panel">
              {/* Quick duty memo banner shortcut (desktop) */}
              <div className="quick-duty-banner" onClick={() => setActiveTab('dutyGuide')}>
                <div className="quick-banner-left">
                  <img src="/mascot.png" alt="Mascot" className="quick-banner-mascot-img" />
                  <div className="quick-banner-text">
                    <strong>Clinical Hospital Duty?</strong>
                    <span>Check all 14 hospital commute notes & tips &rarr;</span>
                  </div>
                </div>
                <button type="button" className="btn-view-hospitals">
                  View Guide
                </button>
              </div>

              <RouteSearch
                nodes={nodes}
                startNode={startNode}
                setStartNode={setStartNode}
                destinationNode={destinationNode}
                setDestinationNode={setDestinationNode}
                isDiscounted={isDiscounted}
                setIsDiscounted={setIsDiscounted}
                tricycleMode={tricycleMode}
                setTricycleMode={setTricycleMode}
                busPreference={busPreference}
                setBusPreference={setBusPreference}
                trainPreference={trainPreference}
                setTrainPreference={setTrainPreference}
                profileId={profileId}
                setProfileId={setProfileId}
              />

              <RouteList
                routes={routes}
                totalRoutesCount={allRoutes.length}
                selectedRouteIndex={selectedRouteIndex}
                setSelectedRouteIndex={setSelectedRouteIndex}
                nodesById={nodesById}
                startNode={startNode}
                destinationNode={destinationNode}
                onSwitchToMap={() => setActiveTab('map')}
              />
            </section>

            {/* Interactive Map Panel */}
            <section className="map-panel">
              <Suspense fallback={
                <div className="status-placeholder glass-pompom-card animate-fade-in" style={{ height: '100%' }}>
                  <div className="placeholder-mascot">🍮</div>
                  <h3>Loading Interactive Map...</h3>
                </div>
              }>
                <RouteMap
                  activeRoute={activeRoute}
                  nodesById={nodesById}
                  allNodes={nodes}
                  isVisible={activeTab === 'map'}
                />
              </Suspense>

              {/* Mobile Floating Bottom Route Bar */}
              <div className="mobile-map-floating-bar-wrapper">
                {activeRoute ? (
                  <div className="mobile-map-route-bar glass-pompom-card animate-slide-up">
                    <div className="mobile-map-route-info">
                      <div className="mobile-map-route-title-row">
                        <span className="mobile-route-index">Route {selectedRouteIndex + 1} of {routes.length}</span>
                        <span className="mobile-route-fare-badge">{activeRoute.fareText}</span>
                      </div>
                      <div className="mobile-map-route-meta">
                        <span>{activeRoute.legCount === 1 ? '1 ride' : `${activeRoute.legCount} rides`}</span>
                        <span>•</span>
                        <span>{activeRoute.totalDistance.toFixed(1)} km</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-mobile-switch-steps"
                      onClick={() => setActiveTab('planner')}
                    >
                      <ListIcon size={14} />
                      <span>Steps</span>
                    </button>
                  </div>
                ) : (
                  <div className="mobile-map-route-bar glass-pompom-card animate-slide-up">
                    <div className="mobile-map-route-info">
                      <span className="mobile-route-index">Interactive Map Mode</span>
                      <span className="mobile-map-route-meta">Pick origin & destination in Routes</span>
                    </div>
                    <button
                      type="button"
                      className="btn-mobile-switch-steps"
                      onClick={() => setActiveTab('planner')}
                    >
                      <Navigation size={14} />
                      <span>Routes</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Persistent Disclaimer Footer */}
      <DisclaimerBanner onOpenModal={() => setIsDisclaimerOpen(true)} />

      {/* Acknowledgment Modal */}
      <DisclaimerModal
        isOpenOverride={isDisclaimerOpen ? true : undefined}
        onCloseOverride={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
