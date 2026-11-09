/**
 * Curated authentic seafarer portrait photos in boiler suits / workwear.
 * Served directly from static assets in /crew/[id].jpg for maximum speed and reliability.
 */

export const DEFAULT_CREW_AVATARS: Record<string, string> = {
  // Standby Crew
  'c-standby-1': '/crew/c-standby-1.jpg', // Capt. David Sterling
  'c-standby-2': '/crew/c-standby-2.jpg', // Mikhail Petrov
  'c-standby-3': '/crew/c-standby-3.jpg', // Juan Dela Cruz
  'c-standby-4': '/crew/c-standby-4.jpg', // Lars Oberg

  // SIRIOS BULK II
  'c1': '/crew/c1.jpg', // Capt. Marcus Vance
  'c3': '/crew/c3.jpg', // Alexey Ivanov
  'c5': '/crew/c5.jpg', // Kenji Sato
  'c6': '/crew/c6.jpg', // Thomas Miller
  'c7': '/crew/c7.jpg', // Jose Santos
  'c2': '/crew/c2.jpg', // Dimitrios Pappas
  'c4': '/crew/c4.jpg', // Elena Rostova
  'c8': '/crew/c8.jpg', // Viktor Morozov
  'c9': '/crew/c9.jpg', // Ahmed Hassan
  'c10': '/crew/c10.jpg', // Giuseppe Rossi
  'c11': '/crew/c11.jpg', // Manny Pacquiao

  // EVER GIVEN
  'c201': '/crew/c201.jpg', // Capt. Alexander Wright
  'c203': '/crew/c203.jpg', // Carlos Mendez
  'c204': '/crew/c204.jpg', // Li Wei
  'c202': '/crew/c202.jpg', // Hiroshi Tanaka
  'c205': '/crew/c205.jpg', // Lars Hansen
  'c206': '/crew/c206.jpg', // Francois Dubois
  'c207': '/crew/c207.jpg', // Pedro Gomez

  // MSC OSCAR
  'c301': '/crew/c301.jpg', // Capt. Jean-Luc Picard
  'c303': '/crew/c303.jpg', // William Riker
  'c302': '/crew/c302.jpg', // Sven Lindqvist
  'c304': '/crew/c304.jpg', // Geordi La Forge
  'c305': '/crew/c305.jpg', // Neelix Morales

  // MOZUK MARINER
  'c401': '/crew/c401.jpg', // Capt. Joao Silva
  'c403': '/crew/c403.jpg', // Antonio Cossa
  'c402': '/crew/c402.jpg', // Mateus Nhampossa
  'c404': '/crew/c404.jpg', // Inacio Tembe
};

export const FALLBACK_PORTRAITS: string[] = [
  '/crew/c1.jpg',
  '/crew/c2.jpg',
  '/crew/c3.jpg',
  '/crew/c4.jpg',
  '/crew/c5.jpg',
  '/crew/c6.jpg',
  '/crew/c7.jpg',
  '/crew/c8.jpg',
  '/crew/c9.jpg',
  '/crew/c10.jpg',
  '/crew/c11.jpg',
  '/crew/c201.jpg',
  '/crew/c202.jpg',
  '/crew/c203.jpg',
  '/crew/c204.jpg',
  '/crew/c205.jpg',
  '/crew/c206.jpg',
  '/crew/c207.jpg',
  '/crew/c301.jpg',
  '/crew/c302.jpg',
  '/crew/c303.jpg',
  '/crew/c304.jpg',
  '/crew/c305.jpg',
  '/crew/c401.jpg',
  '/crew/c402.jpg',
  '/crew/c403.jpg',
  '/crew/c404.jpg',
];

/**
 * Returns a high-res real portrait photo for any crew member.
 */
export function getCrewAvatarUrl(crew: { id?: string; name?: string; avatarUrl?: string }): string {
  if (crew.avatarUrl && crew.avatarUrl.trim().length > 0) {
    return crew.avatarUrl;
  }

  if (crew.id && DEFAULT_CREW_AVATARS[crew.id]) {
    return DEFAULT_CREW_AVATARS[crew.id];
  }

  // Deterministic fallback based on name or ID hash
  const key = crew.name || crew.id || 'crew';
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_PORTRAITS.length;
  return FALLBACK_PORTRAITS[index];
}
