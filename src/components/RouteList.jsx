import React, { memo } from 'react';
import { ArrowRight, AlertTriangle, Lightbulb, Bus, Sparkles } from 'lucide-react';
import { MODE_ICONS, MODE_LABELS } from '../utils/constants';

function RouteList({
  routes,
  totalRoutesCount,
  selectedRouteIndex,
  setSelectedRouteIndex,
  nodesById,
  startNode,
  destinationNode,
  onSwitchToMap
}) {
  const getNodeName = (id) => {
    const node = nodesById[id];
    return node ? node.name : id;
  };

  if (!startNode || !destinationNode) {
    return (
      <div className="status-placeholder glass-pompom-card animate-fade-in">
        <div className="placeholder-mascot">
          <img src="/mascot.png" alt="Mascot" className="placeholder-mascot-img" />
        </div>
        <h3>Select Your Commute Points</h3>
        <p>Pick a starting terminal or campus, and choose your destination or hospital to calculate routes & fares!</p>
      </div>
    );
  }

  if (startNode === destinationNode) {
    return (
      <div className="status-placeholder status-warning glass-pompom-card animate-fade-in">
        <div className="placeholder-mascot">🐾</div>
        <h3>Same Location Selected</h3>
        <p>Your starting point and destination are the same. Please choose a different destination!</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="status-placeholder status-error glass-pompom-card animate-fade-in">
        <div className="placeholder-mascot">😿</div>
        <h3>No Direct Transit Routes Found</h3>
        <p>
          No connected transit routes found between these locations in the current network. Consider a direct taxi or ride-hailing option.
        </p>
        <p className="text-xs text-muted mt-2">
          Tip: Check the Clinical Hospital Duty Guide above for suggested hospital transfer hubs!
        </p>
      </div>
    );
  }

  return (
    <div className="routes-list-container" id="routes-results-list">
      <div className="routes-list-header">
        <h3 className="section-title-sm">
          Available Commute Options ({totalRoutesCount > routes.length ? `Top ${routes.length} of ${totalRoutesCount}` : routes.length})
        </h3>
        <span className="pompom-pill-tag">🐾 Tap card to view route on map</span>
      </div>
      
      <div className="routes-cards-stack">
        {routes.map((route, rIdx) => {
          const isSelected = selectedRouteIndex === rIdx;
          
          return (
            <div
              key={rIdx}
              className={`route-card glass-pompom-card ${isSelected ? 'active-route-card' : ''} animate-fade-in`}
              onClick={() => setSelectedRouteIndex(rIdx)}
              style={{ animationDelay: `${rIdx * 0.05}s` }}
            >
              {/* Card Summary Header */}
              <div className="route-card-header">
                <div className="route-fare-cost">
                  <span className="fare-label">Estimated Fare</span>
                  <div className="fare-badge-group">
                    <span className="fare-pudding-badge">🍮</span>
                    <span className="fare-value">{route.fareText}</span>
                  </div>
                </div>
                
                <div className="route-stats">
                  <span className="stat-badge">
                    {route.totalDistance.toFixed(1)} km
                  </span>
                  <span className="stat-badge stat-transfers">
                    {route.legCount === 1 ? 'Direct Ride' : `${route.legCount - 1} transfer${route.legCount > 2 ? 's' : ''}`}
                  </span>
                </div>
              </div>

              {/* Mode Badges Strip */}
              <div className="mode-strip">
                {route.legs.map((step, sIdx) => {
                  const Icon = MODE_ICONS[step.leg.mode] || Bus;
                  return (
                    <React.Fragment key={sIdx}>
                      {sIdx > 0 && <ArrowRight size={14} className="strip-arrow" />}
                      <span className={`mode-badge mode-${step.leg.mode}`}>
                        <Icon size={12} />
                        <span className="badge-text">
                          {step.leg.mode === 'jeepney' 
                            ? (step.leg.fare_type === 'modern' ? 'E-Jeep' : 'Jeep') 
                            : step.leg.mode === 'moto_taxi' ? 'MC Taxi' : MODE_LABELS[step.leg.mode]}
                        </span>
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Expanded Card Details */}
              {isSelected && (
                <div className="route-expanded-details animate-slide-down">
                  <div className="divider"></div>
                  <div className="details-header-row">
                    <h4 className="detail-title">Step-by-step Commute:</h4>
                    {onSwitchToMap && (
                      <button
                        type="button"
                        className="btn-view-on-map-pill pompom-bounce"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSwitchToMap();
                        }}
                        title="View this route on the interactive map"
                      >
                        <span>🗺️ View on Map</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="step-timeline">
                    {route.legs.map((step, sIdx) => {
                      const Icon = MODE_ICONS[step.leg.mode] || Bus;
                      const isMotoTaxi = step.leg.mode === 'moto_taxi';
                      const isTaxi = step.leg.mode === 'taxi';
                      const hasNotes = !!step.leg.notes;
                      const isDutyCaution = step.leg.notes && (
                        step.leg.notes.includes('ALWAYS') || 
                        step.leg.notes.includes('matagal') ||
                        step.leg.notes.includes('Pritil') ||
                        step.leg.notes.includes('Gasak')
                      );

                      return (
                        <div key={sIdx} className="timeline-step">
                          <div className="step-marker-container">
                            <div className={`step-icon-bg mode-${step.leg.mode}`}>
                              <Icon size={16} />
                            </div>
                            {sIdx < route.legs.length - 1 && <div className="step-connector"></div>}
                          </div>

                          <div className="step-info-card">
                            <div className="step-header-row">
                              <div className="step-title-group">
                                <span className="step-mode-label">{MODE_LABELS[step.leg.mode]}</span>
                                {step.leg.route_name && (
                                  <span className="step-route-name">{step.leg.route_name}</span>
                                )}
                              </div>
                              <span className="step-fare-badge">
                                {step.fareDetails.text}
                              </span>
                            </div>

                            <div className="step-routing">
                              <span className="step-node-name">{getNodeName(step.fromNode)}</span>
                              <ArrowRight size={12} className="routing-arrow" />
                              <span className="step-node-name">{getNodeName(step.toNode)}</span>
                            </div>

                            <div className="step-meta">
                              <span className="meta-item">{step.distance.toFixed(1)} km</span>
                              {step.leg.fare_type && (
                                <span className="meta-item fare-type-badge">
                                  {step.leg.fare_type} rate
                                </span>
                              )}
                            </div>

                            {/* Regulated taxi note */}
                            {isTaxi && (
                              <div className="mode-warning-text warning-taxi">
                                <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                                Taxi: flagdown & distance formula; metered rates variable by Manila traffic conditions.
                              </div>
                            )}

                            {/* Moto taxi disclaimer */}
                            {isMotoTaxi && (
                              <div className="mode-warning-text warning-mototaxi" id={`warning-mototaxi-${sIdx}`}>
                                <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                                Motorcycle Taxi: rough estimate, dynamic surge pricing applies.
                              </div>
                            )}

                            {hasNotes && (
                              <div className={`step-description ${isDutyCaution ? 'duty-note-highlight' : ''}`}>
                                {isDutyCaution ? (
                                  <span className="duty-caution-pill">
                                    <Sparkles size={12} /> Student Duty Memo Note:
                                  </span>
                                ) : (
                                  <Lightbulb size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom', color: '#D97706' }} />
                                )}
                                <div>{step.leg.notes}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(RouteList);
