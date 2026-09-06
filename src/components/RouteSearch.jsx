import React, { useState, memo } from 'react';
import { ArrowUpDown, GraduationCap, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { PROFILE_LIST } from '../utils/profiles';
import SearchableDropdown from './SearchableDropdown';
import { CLINICAL_HOSPITALS } from '../data/clinicalHospitals';

const hospitalIdSet = new Set(CLINICAL_HOSPITALS.map(h => h.id));

function RouteSearch({
  nodes,
  startNode,
  setStartNode,
  destinationNode,
  setDestinationNode,
  isDiscounted,
  setIsDiscounted,
  tricycleMode,
  setTricycleMode,
  busPreference,
  setBusPreference,
  trainPreference,
  setTrainPreference,
  profileId,
  setProfileId
}) {
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const handleSwap = () => {
    const temp = startNode;
    setStartNode(destinationNode);
    setDestinationNode(temp);
  };

  // Classify each node to provide cute badges in the dropdown
  const dropdownOptions = nodes.map(node => {
    let badge = null;
    let badgeType = 'default';

    if (hospitalIdSet.has(node.id)) {
      badge = '🏥 Hospital';
      badgeType = 'hospital';
    } else if (['fatima_val', 'ust', 'up_diliman', 'feu_manila', 'mapua_intramuros', 'dlsu', 'ateneo_katipunan'].includes(node.id)) {
      badge = '🎓 Campus';
      badgeType = 'campus';
    } else if (node.id.includes('lrt') || node.id.includes('mrt') || node.id.includes('term') || node.id === 'monumento' || node.id === 'sm_north' || node.id === 'centris_qave') {
      badge = '🚆 Transit Hub';
      badgeType = 'transit';
    }

    return {
      value: node.id,
      label: node.name,
      badge,
      badgeType
    };
  });

  return (
    <div className="search-container glass-pompom-card animate-fade-in" id="route-search-panel">
      <div className="search-header">
        <div className="pompom-pudding-pill">
          <span>🍮 Commute Route Planner</span>
        </div>
        <h2 className="section-title">Where are we going today?</h2>
        <p className="section-subtitle">
          Point-to-point transit routes for Valenzuela, Caloocan, Manila & hospital duties
        </p>
      </div>

      {/* Unified Origin & Destination Search Box */}
      <div className="search-route-box">
        <div className="route-flow-column" aria-hidden="true">
          <div className="flow-dot flow-dot-start" title="Origin"></div>
          <div className="flow-line"></div>
          <div className="flow-dot flow-dot-dest" title="Destination"></div>
        </div>

        <div className="route-fields-column">
          <div className="route-field-row">
            <SearchableDropdown
              id="start-node-select"
              options={dropdownOptions}
              value={startNode}
              onChange={setStartNode}
              placeholder="Origin (e.g., Monumento, OLFU)..."
            />
          </div>
          <div className="route-field-row">
            <SearchableDropdown
              id="dest-node-select"
              options={dropdownOptions}
              value={destinationNode}
              onChange={setDestinationNode}
              placeholder="Destination or Hospital (e.g., East Ave)..."
            />
          </div>
        </div>

        <button
          type="button"
          className="swap-btn-floating pompom-bounce"
          onClick={handleSwap}
          aria-label="Swap starting point and destination"
          title="Swap locations"
        >
          <ArrowUpDown size={16} />
        </button>
      </div>

      {/* Quick Location Shortcuts Strip */}
      <div className="quick-presets-bar">
        <span className="presets-label">Quick:</span>
        <div className="presets-chips-scroll">
          <button 
            type="button" 
            className="pompom-quick-chip"
            onClick={() => setStartNode('fatima_val')}
            title="Set origin to OLFU"
          >
            🎓 OLFU
          </button>
          <button 
            type="button" 
            className="pompom-quick-chip"
            onClick={() => setStartNode('monumento')}
            title="Set origin to Monumento"
          >
            🚆 Monumento
          </button>
          <button 
            type="button" 
            className="pompom-quick-chip"
            onClick={() => setStartNode('sm_north')}
            title="Set origin to SM North"
          >
            🏬 SM North
          </button>
          <span className="preset-chip-divider">|</span>
          <button 
            type="button" 
            className="pompom-quick-chip chip-hospital"
            onClick={() => setDestinationNode('east_ave_med_ctr')}
            title="Set destination to East Avenue Medical Center"
          >
            🏥 East Ave
          </button>
          <button 
            type="button" 
            className="pompom-quick-chip chip-hospital"
            onClick={() => setDestinationNode('val_med_ctr')}
            title="Set destination to Valenzuela Medical Center"
          >
            🏥 VMC
          </button>
          <button 
            type="button" 
            className="pompom-quick-chip chip-hospital"
            onClick={() => setDestinationNode('tondo_med_ctr')}
            title="Set destination to Tondo Medical Center"
          >
            🏥 Tondo Med
          </button>
        </div>
      </div>

      {/* Search Controls Utility Bar */}
      <div className="search-controls-bar">
        <label className="student-discount-pill-label" htmlFor="discount-toggle">
          <div className="discount-pill-icon-wrap">
            <GraduationCap size={15} className="discount-pill-icon" />
          </div>
          <span className="discount-pill-text">Student Duty 20% Discount</span>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="discount-toggle"
              checked={isDiscounted}
              onChange={(e) => setIsDiscounted(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </label>

        <button
          type="button"
          className={`preferences-pill-toggle ${isPreferencesOpen ? 'active' : ''}`}
          onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
          aria-expanded={isPreferencesOpen}
          aria-controls="transport-preferences-content"
        >
          <Settings size={14} />
          <span>Options</span>
          {isPreferencesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {isPreferencesOpen && (
        <div
          className="preferences-content animate-slide-down"
          id="transport-preferences-content"
        >
          <div className="preference-item">
            <span className="preference-title" id="routing-profile-label">Routing Goal:</span>
            <div
              className="preference-options-row profile-options-row"
              role="group"
              aria-labelledby="routing-profile-label"
            >
              {PROFILE_LIST.map(profile => (
                <button
                  key={profile.id}
                  type="button"
                  className={`pref-btn ${profileId === profile.id ? 'active' : ''}`}
                  onClick={() => setProfileId(profile.id)}
                  aria-pressed={profileId === profile.id}
                >
                  {profile.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tricycle preference */}
          <div className="preference-item">
            <span className="preference-title">Tricycle Mode:</span>
            <div className="preference-options-row">
              <button
                type="button"
                className={`pref-btn ${tricycleMode === 'shared' ? 'active' : ''}`}
                onClick={() => setTricycleMode('shared')}
              >
                Shared (Regular)
              </button>
              <button
                type="button"
                className={`pref-btn ${tricycleMode === 'special' ? 'active' : ''}`}
                onClick={() => setTricycleMode('special')}
              >
                Special (Solo)
              </button>
            </div>
          </div>

          {/* Bus preference */}
          <div className="preference-item">
            <span className="preference-title">Bus Class:</span>
            <div className="preference-options-row">
              <button
                type="button"
                className={`pref-btn ${busPreference === 'ordinary' ? 'active' : ''}`}
                onClick={() => setBusPreference('ordinary')}
              >
                Ordinary
              </button>
              <button
                type="button"
                className={`pref-btn ${busPreference === 'aircon' ? 'active' : ''}`}
                onClick={() => setBusPreference('aircon')}
              >
                Aircon / Carousel
              </button>
            </div>
          </div>

          {/* Train ticket preference */}
          <div className="preference-item">
            <span className="preference-title">Train Fare Type:</span>
            <div className="preference-options-row">
              <button
                type="button"
                className={`pref-btn ${trainPreference === 'svc' ? 'active' : ''}`}
                onClick={() => setTrainPreference('svc')}
              >
                Beep Card (SVC)
              </button>
              <button
                type="button"
                className={`pref-btn ${trainPreference === 'sjt' ? 'active' : ''}`}
                onClick={() => setTrainPreference('sjt')}
              >
                Single Journey Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(RouteSearch);
