// Geometry is display-only. Preserve road vertices rather than joining pins
// across properties. Facility pins may be set back from the road.
const corridorNodes = new Set(['monumento', 'puregold_monumento', 'fatima_val',
  'val_city_hall', 'karuhatan_junc', 'val_med_ctr', 'city_care_valenzuela']);

/**
 * @param {{ id: string, lat: number, lng: number }} from
 * @param {{ id: string, lat: number, lng: number }} to
 * @param {Array<[number, number]>} coordinates
 * @returns {Array<[number, number]> | null}
 */
export function getCorridorGeometry(from, to, coordinates) {
  if (!corridorNodes.has(from.id) || !corridorNodes.has(to.id)) return null;
  /**
   * @param {{ lat: number, lng: number }} node
   */
  const nearest = (node) => coordinates.reduce((best, point, index) => {
    /**
     * @param {[number, number]} p
     */
    const distance = (p) => (p[0] - node.lat) ** 2 +
      ((p[1] - node.lng) * Math.cos(node.lat * Math.PI / 180)) ** 2;
    return distance(point) < distance(coordinates[best]) ? index : best;
  }, 0);
  const start = nearest(from), end = nearest(to);
  const result = coordinates.slice(Math.min(start, end), Math.max(start, end) + 1);
  return start > end ? result.reverse() : result;
}
