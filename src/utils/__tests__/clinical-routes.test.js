import { describe, it, expect } from 'vitest';
import routesData from '../../data/routes.json';
import { findRouteAlternatives } from '../k-shortest';
import { DEFAULT_PROFILE_ID } from '../profiles';
import { CLINICAL_HOSPITALS } from '../../data/clinicalHospitals';

describe('Clinical Duty Hospital Routing', () => {
  const { legs, nodes } = routesData;
  const nodesById = Object.fromEntries(nodes.map(n => [n.id, n]));

  it('contains all 14 clinical hospitals in the dataset', () => {
    expect(CLINICAL_HOSPITALS.length).toBe(14);
    for (const hosp of CLINICAL_HOSPITALS) {
      expect(nodesById[hosp.id]).toBeDefined();
      expect(nodesById[hosp.id].name).toBeDefined();
    }
  });

  it('routes successfully from Malinta to East Avenue Medical Center', () => {
    const routes = findRouteAlternatives(legs, 'malinta', 'east_ave_med_ctr', true, {
      profileId: DEFAULT_PROFILE_ID,
      tricycleMode: 'shared',
      busPreference: 'aircon',
      trainPreference: 'svc'
    });

    expect(routes.length).toBeGreaterThan(0);
    const topRoute = routes[0];
    expect(topRoute.totalDistance).toBeGreaterThan(0);
    expect(topRoute.fareText).toContain('₱');
  });


  it('routes successfully from Monumento to Tondo Medical Center via Tayuman LRT/jeep', () => {
    const routes = findRouteAlternatives(legs, 'monumento', 'tondo_med_ctr', true, {
      profileId: DEFAULT_PROFILE_ID,
      tricycleMode: 'shared',
      busPreference: 'aircon',
      trainPreference: 'svc'
    });

    expect(routes.length).toBeGreaterThan(0);
    const topRoute = routes[0];
    expect(topRoute.legs.length).toBeGreaterThanOrEqual(1);
  });

  it('routes successfully from Monumento to Ospital ng Sampaloc', () => {
    const routes = findRouteAlternatives(legs, 'monumento', 'ospital_ng_sampaloc', true, {
      profileId: DEFAULT_PROFILE_ID,
      tricycleMode: 'shared',
      busPreference: 'aircon',
      trainPreference: 'svc'
    });

    expect(routes.length).toBeGreaterThan(0);
    const topRoute = routes[0];
    expect(topRoute.legs.length).toBeGreaterThanOrEqual(1);
  });

  it('routes successfully from Malinta to Valenzuela Medical Center (VMC)', () => {
    const routes = findRouteAlternatives(legs, 'malinta', 'val_med_ctr', true, {
      profileId: DEFAULT_PROFILE_ID,
      tricycleMode: 'shared',
      busPreference: 'aircon',
      trainPreference: 'svc'
    });

    expect(routes.length).toBeGreaterThan(0);
    const topRoute = routes[0];
    expect(topRoute.legs[0].leg.notes).toContain('Valenzuela Medical Center');
  });
});
