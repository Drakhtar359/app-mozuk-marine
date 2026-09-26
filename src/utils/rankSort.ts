import { CrewMember } from '../types/vessel';

/**
 * Returns rank hierarchy weight (lower number = higher in maritime rank).
 */
export function getCrewRankWeight(role: string): number {
  const r = (role || '').toLowerCase();

  // Master / Captain
  if (r.includes('master') || r.includes('captain')) return 1;

  // Deck Department Officers
  if (r.includes('chief officer') || r.includes('first mate') || r.includes('1st mate')) return 3;
  if (r.includes('second officer') || r.includes('2nd officer') || r.includes('2nd mate')) return 5;
  if (r.includes('third officer') || r.includes('3rd officer') || r.includes('3rd mate')) return 7;
  if (r.includes('deck officer') || r.includes('junior officer')) return 8;

  // Engine Department Officers
  if (r.includes('chief engineer')) return 2;
  if (r.includes('second engineer') || r.includes('2nd engineer')) return 4;
  if (r.includes('third engineer') || r.includes('3rd engineer')) return 6;
  if (r.includes('electro-technical') || r.includes('eto') || r.includes('electrician')) return 8;
  if (r.includes('fourth engineer') || r.includes('4th engineer')) return 9;

  // Cadets
  if (r.includes('cadet')) return 10;

  // Deck Ratings
  if (r.includes('bosun') || r.includes('boatswain')) return 11;
  if (r.includes('able seaman') || r.includes('ab ') || r.includes('ab/')) return 13;
  if (r.includes('ordinary seaman') || r.includes('os ') || r.includes('os/')) return 15;
  if (r.includes('deckhand') || r.includes('deck crew')) return 16;

  // Engine Ratings
  if (r.includes('fitter') || r.includes('welder') || r.includes('machinist')) return 12;
  if (r.includes('motorman') || r.includes('oiler')) return 14;
  if (r.includes('wiper') || r.includes('engine hand')) return 17;

  // Galley / Catering Department
  if (r.includes('chief cook') || r.includes('head cook') || r.includes('chef')) return 18;
  if (r.includes('second cook') || r.includes('2nd cook') || r.includes('cook')) return 19;
  if (r.includes('chief steward') || r.includes('stewardess')) return 20;
  if (r.includes('messman') || r.includes('mess boy') || r.includes('steward')) return 21;
  if (r.includes('galley') || r.includes('utility')) return 22;

  return 50;
}

/**
 * Sorts array of crew members by rank hierarchy weight.
 */
export function sortByRankHierarchy(crewList: CrewMember[]): CrewMember[] {
  return [...crewList].sort((a, b) => {
    const wA = getCrewRankWeight(a.role);
    const wB = getCrewRankWeight(b.role);
    if (wA !== wB) return wA - wB;
    return a.name.localeCompare(b.name);
  });
}
