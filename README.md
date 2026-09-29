# Peiwen's Little World

**An illustrated, bilingual HCI portfolio — a small picture-book world you explore by clicking things on a desk.**

**Live site → [peiwen-little-world.vercel.app](https://peiwen-little-world.vercel.app)** · Best viewed on a computer

![The attic desk at night — the home scene of Peiwen's Little World](public/assets/home-desk/master.webp)

I'm Peiwen Zhang, an MSc HCI student at Université Paris-Saclay working on HCI × AI agents. Instead of a grid of project cards, this portfolio is a hand-drawn attic room: the postcards on the desk lead to my experience, the notebook to who I am, and the pinned card to what I've built.

## What's inside

| Where | What you'll find |
| --- | --- |
| **Home** — the desk | An opening sequence (open the window, switch on the lamp, guided by a tiny flower-fairy), then a lit desk where every object is a door |
| **Experience** — the path | My route from Communication University of China, through an exchange in Osaka, to Paris-Saclay, told as stops along a road |
| **Projects** — the house | Eight case studies, from emotional captions to VR locomotion and 3D-printed objects |
| **About** — the notebook | A flip-through notebook: who I am, my journey, and what I care about beyond design; CV download (EN / 中文) and a postcard you can actually send me |

### Projects

- **Reso** — emotional captions: prototypes, a hearing-proxy evaluation and evidence-based iteration
- **Arm-Swing VR Locomotion** — mapping controller swing and headset direction to continuous 3D travel
- **Tangram** — a modular Tangram system built through connector experiments and fabrication
- **Multi-Sensory Music VR** — note blocks and a scanner tied to sound, particles and controller haptics
- **Maze of Wishes** — phone tilt → a playable Java maze (sensor mapping, calibration, collisions)
- **Flight Booking Experience** — Story Interview breakdowns turned into clearer mobile booking flows
- **Chess** — a one-week concept that shapes a chess experience around why people play
- **ZOO Desk Organizer** — an animal-inspired desk system through CAD and 3D printing

## Interaction and accessibility details

- **An opening that teaches the space** — the room starts dark, and a tiny guide lights one thing at a time: first the window, then the lamp. A detailed illustration shown all at once gives a first-time visitor nowhere to look; starting in the dark focuses attention on a single object and teaches, in two clicks, that the things in this room can be clicked
- **Bilingual** — a 中 / EN toggle across the whole site, with a subset handwritten Chinese font so the picture-book feel survives the switch
- **"Ask me" companion** — a little Peiwen in the corner who answers common questions and points you to the right page
- **Respects the visitor** — `prefers-reduced-motion` skips the opening and animations; every hotspot is a real, labelled button reachable by keyboard; decorative art is hidden from screen readers
- **Made for landscape** — phones in portrait get a gentle "turn your phone sideways" card instead of a broken layout
- **A room you can hear** — background music played in shuffled order, soft white noise and the occasional cat meow, so the attic feels lived-in rather than static
- **Small touches** — a watercolour wash between pages, custom 404 page, favicon and share image

## Built with

- [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript
- CSS Modules + Tailwind CSS v4
- Hand-drawn 2D illustration layers for the visuals; DOM for content and accessibility; React Three Fiber / three.js for spatial experiments
- [Web3Forms](https://web3forms.com) for the postcard, deployed on [Vercel](https://vercel.com)

## Run it locally

```bash
npm ci
npm run dev        # http://localhost:3000
```

Checks: `npm run lint` · `npm run typecheck` · `npm run build`

To make the About-page postcard send real mail, copy `.env.example` to `.env.local` and add a Web3Forms access key.

## Process notes

The design and build decisions are documented in the repo: [`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md) (art direction), [`STYLE_GUIDE.md`](STYLE_GUIDE.md), [`ASSET_INDEX.md`](ASSET_INDEX.md) (illustration sources and derivatives) and [`PROJECT_STATE.md`](PROJECT_STATE.md) (implementation log).

Some technical architecture patterns were studied from [ITom's portfolio](https://github.com/ITomPoland/portfolio-itom); no artwork, branding, content or composition was reused.

## License

© Peiwen Zhang. All rights reserved. Code and artwork may not be reused without permission.
