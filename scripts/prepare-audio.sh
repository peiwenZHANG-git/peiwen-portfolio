#!/usr/bin/env bash
# Site audio from the Pixabay downloads in design-assets/audio/incoming/ (2026-09-25).
# Music: silence trimmed, loudness-normalised to -18 LUFS, 1.2s fade-in / 3s fade-out
# (the playlist moves on gently), 96 kbps mp3 + Vorbis ogg.
# Snow: a 60s stretch cross-faded into a seamless loop, quieter (-26 LUFS).
# Effects: trimmed, normalised, short fade-out. The cat has four voices.
# Run from the repo root: bash scripts/prepare-audio.sh   (needs ffmpeg with libvorbis)
set -euo pipefail
IN=design-assets/audio/incoming
OUT=public/assets/audio
mkdir -p "$OUT/music" "$OUT/ambience" "$OUT/effects"

find_in() { ls "$IN" | grep -i -- "$1" | head -1; }

enc() { # $1 = filtered wav, $2 = out path without extension
  ffmpeg -v error -y -i "$1" -c:a libmp3lame -b:a 96k "$2.mp3"
  ffmpeg -v error -y -i "$1" -c:a libvorbis -q:a 2 "$2.ogg"
}

music() { # $1 = id, $2 = pattern in the download's file name
  local f; f=$(find_in "$2") || true
  if [ -z "$f" ]; then echo "missing: $1 ($2)"; return; fi
  local tmp; tmp=$(mktemp --suffix .wav)
  ffmpeg -v error -y -i "$IN/$f" -af "silenceremove=start_periods=1:start_threshold=-55dB,areverse,silenceremove=start_periods=1:start_threshold=-55dB,areverse,loudnorm=I=-18:TP=-2:LRA=11" -ar 44100 "$tmp"
  local d; d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$tmp")
  local tmp2; tmp2=$(mktemp --suffix .wav)
  ffmpeg -v error -y -i "$tmp" -af "afade=t=in:d=1.2,afade=t=out:st=$(awk "BEGIN{printf \"%.3f\", $d - 3}"):d=3" "$tmp2"
  enc "$tmp2" "$OUT/music/$1"
  rm -f "$tmp" "$tmp2"
  echo "music  $1  ${d%.*}s  <- $f"
}

music echoes-of-winter    "echoes-of-winter"
music snowy               "musingmoon-snowy"
music nostalgic-winter    "nostalgic-winter"
music magical-celesta     "magical-fantasy-celesta"
music ballerina-shoes     "ballerina-shoes"
music fairys-farewell     "farewell"
music dreamy-whispers     "dreamy-whispers"
music music-box-lullaby   "music-box-lullaby"
music music-box-melody    "music-box-melody"

# snow: 60s from 20s in, with the last 4s cross-faded over the first 4s -> seamless
f=$(find_in "snowfall") || true
if [ -n "${f:-}" ]; then
  tmp=$(mktemp --suffix .wav)
  ffmpeg -v error -y -ss 20 -t 64 -i "$IN/$f" -af "loudnorm=I=-26:TP=-6" -ar 44100 "$tmp"
  ffmpeg -v error -y -i "$tmp" -filter_complex \
    "[0]atrim=0:4,asetpts=PTS-STARTPTS[head];[0]atrim=4:60,asetpts=PTS-STARTPTS[body];[0]atrim=60:64,asetpts=PTS-STARTPTS[tail];[tail][head]acrossfade=d=4:c1=tri:c2=tri[x];[body][x]concat=n=2:v=0:a=1" \
    "$tmp.loop.wav"
  enc "$tmp.loop.wav" "$OUT/ambience/snow"
  rm -f "$tmp" "$tmp.loop.wav"
  echo "snow   <- $f"
else echo "missing: snow"; fi

effect() { # $1 = name, $2 = pattern, $3 = max seconds
  local f; f=$(find_in "$2") || true
  if [ -z "$f" ]; then echo "missing: $1 ($2)"; return; fi
  local tmp; tmp=$(mktemp --suffix .wav)
  ffmpeg -v error -y -i "$IN/$f" -t "$3" -af "silenceremove=start_periods=1:start_threshold=-50dB,loudnorm=I=-20:TP=-3,afade=t=out:st=$(awk "BEGIN{printf \"%.3f\", $3 - 0.25}"):d=0.25" -ar 44100 "$tmp"
  enc "$tmp" "$OUT/effects/$1"
  rm -f "$tmp"
  echo "effect $1 <- $f"
}
effect page-turn "turn-a-page" 0.6
# footsteps in snow for the Experience walk: a longer stretch, played in short bursts
effect snow-steps "footsteps" 8
# the attic cat: one sound per speech bubble in app/projects/project-life.tsx
effect cat-mew   "cute-cat-meow" 2.0
effect cat-meow  "cat-meow-sound" 1.5
effect cat-mrrp  "cutie-cat" 2.1
effect cat-purr  "cat-purr" 3.5
