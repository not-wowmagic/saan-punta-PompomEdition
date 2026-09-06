import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Search,
  Star,
  Sparkles
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
    { id: 'highlighted', label: '⭐ Orientation Highlighted (3)' },
    { id: 'manila', label: 'Manila (5)' },
    { id: 'valenzuela', label: 'Valenzuela (2)' },
    { id: 'qc', label: 'Quezon City (2)' },
    { id: 'bulacan', label: 'Bulacan (3)' }
  ];

  const filteredHospitals = CLINICAL_HOSPITALS.filter(hosp => {
    // Search query filter
    const matchesQuery = 
      hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesQuery) return false;

    // Category filter
    if (filter === 'highlighted') return hosp.highlighted;
    if (filter === 'manila') return hosp.area.toLowerCase().includes('manila') || hosp.area.toLowerCase().includes('tondo') || hosp.area.toLowerCase().includes('sampaloc') || hosp.area.toLowerCase().includes('binondo');
    if (filter === 'valenzuela') return hosp.area.toLowerCase().includes('valenzuela');
    if (filter === 'qc') return hosp.area.toLowerCase().includes('quezon') || hosp.area.toLowerCase().includes('diliman');
    if (filter === 'bulacan') return hosp.area.toLowerCase().includes('bulacan') || hosp.area.toLowerCase().includes('marilao') || hosp.area.toLowerCase().includes('meycauayan');
    return true;
  });

  const handleChoose = (hospitalId) => {
    // If starting point is empty, default to Monumento transit hub
    if (!startNode) {
      setStartNode('monumento');
    }
    onSelectHospital(hospitalId);
  };

  return (
    <div className="duty-guide-container glass-pompom-card animate-fade-in" id="clinical-duty-guide">
      {/* Pompom Header with mascot banner */}
      <div className="duty-guide-header">
        <div className="duty-header-badge">
          <span className="pudding-icon-spin">🍮</span>
          <span>Clinical Hospital Duty Hub</span>
        </div>
        <h3 className="duty-guide-title">
          Affiliated Hospitals & Student Commute Guide
        </h3>
        <p className="duty-guide-subtitle">
          Clinical duty rotation guide for nursing students with real commuter notes and route memos.
        </p>
      </div>

      {/* Critical Duty Memo Banner from Photo */}
      <div className="duty-memo-alert">
        <div className="duty-memo-icon-box">
          <span className="alert-emoji">‼️</span>
        </div>
        <div className="duty-memo-content">
          <div className="duty-memo-title">
            <strong>ALWAYS ‼️</strong> magsabi sa driver saan bababa
          </div>
          <div className="duty-memo-sub">
            Tip mula sa senior duty memo: Bago umandar o pagkaabot ng pamasahe, banggitin agad ang drop-off landmark upang hindi lumampas sa hospital gate!
          </div>
        </div>
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
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="duty-hospitals-grid">
        {filteredHospitals.map(hospital => {
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
                      <Star size={12} fill="#F59E0B" color="#F59E0B" /> Slide Highlighted
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
                  title="Calculate route to this hospital"
                >
                  Plan Route 🍮
                </button>
              </div>

              {/* Memo Routes preview */}
              <div className="duty-card-memo-preview">
                {hospital.memoRoutes.map((mRoute, rIdx) => (
                  <div key={rIdx} className="memo-route-snippet">
                    <div className="memo-route-title">
                      <span className="bullet-swirl">🍥</span> {mRoute.title}:
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
                        <Sparkles size={13} className="sparkle-icon" />
                        <span>{mRoute.caution}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
