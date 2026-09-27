/**
 * Everything the site can play (2026-09-25). All files are from Pixabay (Pixabay Content
 * License: free to use, no attribution required — credited in the record panel anyway).
 * Sources and processing: design-assets/audio/MUSIC.md.
 *
 * Music plays as a playlist: when a track ends the next one starts, and after the last
 * it goes back to the first. Each track ships as ogg (Chrome/Firefox) + mp3 (Safari).
 */

export type Track = { id: string; title: string; artist: string };

export const TRACKS: Track[] = [
  { id: "echoes-of-winter", title: "Echoes of Winter", artist: "pardeeppatel" },
  { id: "snowy", title: "Snowy", artist: "musingmoon" },
  { id: "nostalgic-winter", title: "Nostalgic Winter Reflections", artist: "Metriko" },
  { id: "magical-celesta", title: "Magical Fantasy Celesta", artist: "MusicViktor11" },
  { id: "ballerina-shoes", title: "Ballerina Shoes", artist: "geoffharvey" },
  { id: "fairys-farewell", title: "Fairy’s Farewell", artist: "Whatssmooth" },
  { id: "dreamy-whispers", title: "Dreamy Whispers", artist: "Mohamed_hassan" },
  { id: "music-box-lullaby", title: "Music Box Lullaby", artist: "Music_For_Videos" },
  { id: "music-box-melody", title: "Music Box Melody", artist: "AmarantaMusic" },
];

export function trackSources(id: string) {
  return { ogg: `/assets/audio/music/${id}.ogg`, mp3: `/assets/audio/music/${id}.mp3` };
}

/** the snowfall outside the window: a seamless loop */
export const SNOW = { ogg: "/assets/audio/ambience/snow.ogg", mp3: "/assets/audio/ambience/snow.mp3" };

/** short one-shots */
const fx = (name: string) => ({ ogg: `/assets/audio/effects/${name}.ogg`, mp3: `/assets/audio/effects/${name}.mp3` });
export const EFFECTS = {
  page: fx("page-turn"),
  // Peiwen's footsteps in the snow while she walks on /experience (plays in short bursts)
  steps: fx("snow-steps"),
  // the attic cat's four voices, one per speech bubble (app/projects/project-life.tsx)
  mew: fx("cat-mew"),
  meow: fx("cat-meow"),
  mrrp: fx("cat-mrrp"),
  purr: fx("cat-purr"),
} as const;

export type EffectName = keyof typeof EFFECTS;
