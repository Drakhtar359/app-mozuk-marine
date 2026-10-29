/**
 * Curated real portrait photos for crew members.
 * Sourced from reliable, high-resolution CDNs (Unsplash and RandomUser).
 */

export const DEFAULT_CREW_AVATARS: Record<string, string> = {
  // Standby Crew
  'c-standby-1': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80', // Capt. David Sterling
  'c-standby-2': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80', // Mikhail Petrov
  'c-standby-3': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80', // Juan Dela Cruz
  'c-standby-4': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=256&auto=format&fit=crop&q=80', // Lars Oberg

  // SIRIOS BULK II
  'c1': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&auto=format&fit=crop&q=80', // Capt. Marcus Vance
  'c3': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=256&auto=format&fit=crop&q=80', // Alexey Ivanov
  'c5': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=256&auto=format&fit=crop&q=80', // Kenji Sato
  'c6': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=256&auto=format&fit=crop&q=80', // Thomas Miller
  'c7': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&auto=format&fit=crop&q=80', // Jose Santos
  'c2': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&auto=format&fit=crop&q=80', // Dimitrios Pappas
  'c4': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80', // Elena Rostova
  'c8': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=256&auto=format&fit=crop&q=80', // Viktor Morozov
  'c9': 'https://images.unsplash.com/photo-1524535536466-139da2534780?w=256&auto=format&fit=crop&q=80', // Ahmed Hassan
  'c10': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=256&auto=format&fit=crop&q=80', // Giuseppe Rossi
  'c11': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80', // Manny Pacquiao

  // EVER GIVEN
  'c201': 'https://randomuser.me/api/portraits/men/75.jpg', // Capt. Alexander Wright
  'c203': 'https://randomuser.me/api/portraits/men/32.jpg', // Carlos Mendez
  'c204': 'https://randomuser.me/api/portraits/men/42.jpg', // Li Wei
  'c202': 'https://randomuser.me/api/portraits/men/62.jpg', // Hiroshi Tanaka
  'c205': 'https://randomuser.me/api/portraits/men/45.jpg', // Lars Hansen
  'c206': 'https://randomuser.me/api/portraits/men/52.jpg', // Francois Dubois
  'c207': 'https://randomuser.me/api/portraits/men/36.jpg', // Pedro Gomez

  // MSC OSCAR
  'c301': 'https://randomuser.me/api/portraits/men/91.jpg', // Capt. Jean-Luc Picard
  'c303': 'https://randomuser.me/api/portraits/men/68.jpg', // William Riker
  'c302': 'https://randomuser.me/api/portraits/men/85.jpg', // Sven Lindqvist
  'c304': 'https://randomuser.me/api/portraits/men/29.jpg', // Geordi La Forge
  'c305': 'https://randomuser.me/api/portraits/men/55.jpg', // Neelix

  // MOZUK MARINER
  'c401': 'https://randomuser.me/api/portraits/men/76.jpg', // Capt. Joao Silva
  'c403': 'https://randomuser.me/api/portraits/men/86.jpg', // Antonio Cossa
  'c402': 'https://randomuser.me/api/portraits/men/64.jpg', // Mateus Nhampossa
  'c404': 'https://randomuser.me/api/portraits/men/70.jpg', // Inacio Tembe
};

export const FALLBACK_PORTRAITS: string[] = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=256&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=256&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/44.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'https://randomuser.me/api/portraits/men/85.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/62.jpg',
  'https://randomuser.me/api/portraits/men/52.jpg',
  'https://randomuser.me/api/portraits/men/36.jpg',
  'https://randomuser.me/api/portraits/men/76.jpg',
  'https://randomuser.me/api/portraits/men/86.jpg',
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
