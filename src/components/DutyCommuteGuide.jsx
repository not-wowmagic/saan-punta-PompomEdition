import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Search, 
  Star, 
  Info,
  Stethoscope,
  Navigation
} from 'lucide-react';
import { CLINICAL_HOSPITALS } from '../data/clinicalHospitals';

export default function DutyCommuteGuide({ 
  onSelectHospital, 
  selectedHospitalId, 
  startNode, 
  setStartNode 
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { id: 'all', label: 'All Hospitals (14)' },
    { id: 'highlighted', label: 'Recommended for orientation (3)', hasStar: true },
    { id: 'manila', label: 'Manila (5)' },
    { id: 'valenzuela', label: 'Valenzuela (2)' },
    { id: 'qc', label: 'Quezon City (2)' },
    { id: 'bulacan', label: 'Bulacan (3)' }
  ];

  const filteredHospitals = CLINICAL_HOSPITALS.filter(hosp => {
    // Search by hospital name, area, or short name
    const matchesQuery = 
      hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesQuery) return false;

    // Apply the selected area or orientation filter
    if (filter === 'highlighted') return hosp.highlighted;
    if (filter === 'manila') return hosp.area.toLowerCase().includes('manila') || hosp.area.toLowerCase().includes('tondo') || hosp.area.toLowerCase().includes('sampaloc') || hosp.area.toLowerCase().includes('binondo');
    if (filter === 'valenzuela') return hosp.area.toLowerCase().includes('valenzuela');
    if (filter === 'qc') return hosp.area.toLowerCase().includes('quezon') || hosp.area.toLowerCase().includes('diliman');
    if (filter === 'bulacan') return hosp.area.toLowerCase().includes('bulacan') || hosp.area.toLowerCase().includes('marilao') || hosp.area.toLowerCase().includes('meycauayan');
    return true;
  });

  const handleChoose = (hospitalId) => {
    // Use Monumento as the default origin when none is selected
    if (!startNode) {
      setStartNode('monumento');
    }
    onSelectHospital(hospitalId);
  };

  return (
    <div className="duty-guide-container glass-pompom-card animate-fade-in" id="clinical-duty-guide">
      {/* Hospital Guide header */}
      <div className="duty-guide-header">
        <div className="duty-header-badge">
          <Stethoscope size={15} className="duty-badge-icon" />
          <span>Hospital Guide</span>
        </div>
        <h3 className="duty-guide-title">
          Hospitals and commute tips
        </h3>
        <p className="duty-guide-subtitle">
          Browse affiliated hospitals and find practical commute tips.
        </p>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="duty-filters-row">
        <div className="duty-search-input-wrapper">
          <Search size={16} className="duty-search-icon" />
          <input
            type="text"
            className="duty-search-input"
            placeholder="Filter hospitals by name or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="duty-filter-pills-row">
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={`duty-filter-pill ${filter === opt.id ? 'active' : ''}`}
              onClick={() => setFilter(opt.id)}
            >
              {opt.hasStar && <Star size={12} fill="#F59E0B" color="#F59E0B" className="filter-star-icon" />}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="duty-hospitals-grid">
        {filteredHospitals.length === 0 ? (
          <div className="status-placeholder status-empty-hospitals">
            <Search size={32} className="text-muted mb-2" />
            <h4>No Hospitals Found</h4>
            <p>No affiliated hospital matched "{searchQuery}". Try searching by area or name.</p>
          </div>
        ) : (
          filteredHospitals.map(hospital => {
            const isSelected = selectedHospitalId === hospital.id;

            return (
              <div 
                key={hospital.id} 
                className={`duty-hospital-card ${isSelected ? 'active-duty-hospital' : ''} ${hospital.highlighted ? 'highlighted-hospital' : ''}`}
              >
                <div className="duty-card-top">
                  <div className="duty-card-title-wrap">
                    {hospital.highlighted && (
                      <span className="highlight-tag">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" /> Recommended for orientation
                      </span>
                    )}
                    <h4 className="hospital-card-name">{hospital.name}</h4>
                    <div className="hospital-area-tag">
                      <MapPin size={12} /> {hospital.area}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="pompom-route-cta-btn"
                    onClick={() => handleChoose(hospital.id)}
                    title="Plan a route to this hospital"
                  >
                    <Navigation size={13} />
                    <span>Plan Route</span>
                  </button>
                </div>

                {/* Hospital route tips */}
                <div className="duty-card-memo-preview">
                  {hospital.memoRoutes.map((mRoute, rIdx) => (
                    <div key={rIdx} className="memo-route-snippet">
                      <div className="memo-route-title">
                        <ChevronRight size={13} className="memo-bullet-icon" />
                        <span>{mRoute.title}:</span>
                      </div>
                      <ul className="memo-steps-list">
                        {mRoute.steps.map((step, sIdx) => (
                          <li key={sIdx}>
                            <ChevronRight size={12} className="step-arrow-icon" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                      {mRoute.caution && (
                        <div className="memo-caution-box">
                          <Info size={13} className="memo-caution-icon" />
                          <span>{mRoute.caution}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
