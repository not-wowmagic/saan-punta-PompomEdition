import { describe, it, expect } from 'vitest';
import { getCorridorGeometry } from '../map-corridor.js';
import corridor from '../../data/macarthur-karuhatan.geometry.json';
import data from '../../data/routes.json';

const nodes = Object.fromEntries(data.nodes.map(node => [node.id, node]));
describe('VMC highway display geometry', () => {
  for (const id of ['monumento', 'fatima_val', 'val_city_hall']) {
    it(`follows road vertices through the Karuhatan turn from ${id}`, () => {
      const path = getCorridorGeometry(nodes[id], nodes.val_med_ctr, corridor.coordinates);
      expect(path.length).toBeGreaterThan(20);
      expect(path).toContainEqual([14.6899401, 120.974035]);
      expect(path.at(-1)).toEqual([14.6893609, 120.9777841]);
      expect(getCorridorGeometry(nodes.val_med_ctr, nodes[id], corridor.coordinates))
        .toEqual([...path].reverse());
      // Every point comes from the sourced road, not the facility pin.
      for (const point of path) expect(corridor.coordinates).toContainEqual(point);
      expect(path).not.toContainEqual([nodes.val_med_ctr.lat, nodes.val_med_ctr.lng]);
    });
  }
  it('does not redirect unrelated origins through this corridor', () => {
    expect(getCorridorGeometry(nodes.cubao, nodes.val_med_ctr, corridor.coordinates)).toBeNull();
  });
});
