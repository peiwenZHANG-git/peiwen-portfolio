export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  rotation: number;
  href: string;
  rope: "featured" | "smaller";
  imageAlt: string;
  label: string;
  coverSubtitle: string;
  cover?: string;
};

export const projects: Project[] = [
  {
    id: "reso", cover: "/assets/projects/overview-covers/reso-cover.webp", label: "Reso", coverSubtitle: "Making tone visible", title: "Reso", subtitle: "caption design · evaluation", rope: "featured", rotation: -1.8,
    description: "Exploring emotional captions through prototypes, a hearing-proxy evaluation, and evidence-based iteration.",
    href: "/projects/reso", image: "/assets/projects/reso/working-prototype.webp", imageAlt: "Reso caption interface with emotion cues",
  },
  {
    id: "arm-swing", cover: "/assets/projects/overview-covers/arm-swing-cover.webp", label: "Arm-Swing VR", coverSubtitle: "Move to travel", title: "Arm-Swing VR Locomotion", subtitle: "body movement → virtual travel", rope: "featured", rotation: 1.4,
    description: "Mapping controller movement and headset direction into continuous three-dimensional VR travel.",
    href: "/projects/arm-swing-vr-locomotion", image: "/assets/projects/arm-swing-vr-locomotion/gameplay-flight.webp", imageAlt: "Arm-swing VR locomotion gameplay in flight",
  },
  {
    id: "tangram", cover: "/assets/projects/overview-covers/tangram-cover.webp", label: "Tangram", coverSubtitle: "Connect · print · play", title: "Tangram", subtitle: "make · connect · play", rope: "featured", rotation: -1.1,
    description: "Building a modular Tangram system through connector experiments, physical tests, and fabrication iteration.",
    href: "/projects/tangram", image: "/assets/projects/tangram/final-exhibition.webp", imageAlt: "Physical Tangram installation at the exhibition",
  },
  {
    id: "music-vr", cover: "/assets/projects/overview-covers/music-vr-cover.webp", label: "Music VR", coverSubtitle: "See · hear · feel", title: "Multi-Sensory Music VR", subtitle: "blocks · rhythm · feedback", rope: "featured", rotation: 1.7,
    description: "A VR music prototype connecting note blocks and a moving scanner to audio, particles, and controller haptics.",
    href: "/projects/multi-sensory-music-vr", image: "/assets/projects/multi-sensory-music-vr/hero-sequencer.webp", imageAlt: "VR sequencer with note blocks and scanner",
  },
  {
    id: "maze", cover: "/assets/projects/overview-covers/maze-cover.webp", label: "Maze of Wishes", coverSubtitle: "Tilt to find the way", title: "Maze of Wishes", subtitle: "phone tilt → maze movement", rope: "featured", rotation: -.8,
    description: "Turning phone tilt into a playable Java maze through sensor mapping, calibration, and collision handling.",
    href: "/projects/maze-of-wishes", image: "/assets/projects/maze-of-wishes/gameplay-overview.webp", imageAlt: "Maze of Wishes game scene",
  },
  {
    id: "flight", cover: "/assets/projects/overview-covers/flight-cover.webp", label: "Flight Booking", coverSubtitle: "A clearer journey", title: "Flight Booking Experience", subtitle: "a clearer journey", rope: "smaller", rotation: -1.7,
    description: "Translating Story Interview breakdowns into clearer mobile booking and itinerary flows.",
    href: "/projects/flight-booking", image: "/assets/projects/flight-booking/itinerary-overview.webp", imageAlt: "Mobile flight itinerary prototype",
  },
  {
    id: "chess", cover: "/assets/projects/overview-covers/chess-cover.webp", label: "Chess", coverSubtitle: "Play · learn · reflect", title: "Chess", subtitle: "why do you play?", rope: "smaller", rotation: 1.2,
    description: "A one-week HCI concept that shapes a chess experience around why people come to play.",
    href: "/projects/chess", image: "/assets/projects/chess/main.webp", imageAlt: "Intent-first chess prototype screen",
  },
  {
    id: "zoo", cover: "/assets/projects/overview-covers/zoo-cover.webp", label: "ZOO Organizer", coverSubtitle: "Print · fit · organize", title: "ZOO Desk Organizer", subtitle: "a small desk ecosystem", rope: "smaller", rotation: -1.3,
    description: "Exploring an animal-inspired desk organizer through CAD, 3D printing, and physical prototypes.",
    href: "/projects/zoo-desk-organizer", image: "/assets/projects/zoo-desk-organizer/final-system.webp", imageAlt: "Physical animal-inspired ZOO desk organizer",
  },
];
