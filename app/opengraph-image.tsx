import { ImageResponse } from "next/og";

/**
 * Link-preview image (Next file-convention route: /opengraph-image, auto-linked as
 * og:image/twitter:image in <head> — no metadata edit needed). Shown when someone
 * shares the site's URL in iMessage/WhatsApp/Slack/微信/X etc.; without this file those
 * previews render with no image at all.
 *
 * Deliberately plain — same paper colour and branch mark as the favicon, the header's
 * own name/role line as the only text, no illustrated scene. `next/og`'s renderer
 * (satori) can't load the site's real webfonts here without shipping font files
 * through this route too, so this intentionally uses the system sans rather than
 * attempting the hand-drawn type and getting it subtly wrong.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4ede1",
        }}
      >
        <svg width="72" height="110" viewBox="0 0 22 34" fill="none" stroke="#7d8566" strokeWidth="1.3" strokeLinecap="round">
          <path d="M11 33V5" />
          <path d="M11 12c-4-1-7-4-7-8 4 0 7 3 7 7" />
          <path d="M11 18c4-1 7-4 7-8-4 0-7 3-7 7" />
          <path d="M11 25c-4-1-7-4-7-8 4 0 7 3 7 7" />
          <path d="M11 9c2-2 3-4 3-7-2 1-3 3-3 6" />
        </svg>
        <div style={{ marginTop: 28, fontSize: 56, color: "#292d45", fontWeight: 600 }}>Peiwen Zhang</div>
        <div style={{ marginTop: 14, fontSize: 26, color: "#8c6a52" }}>Peiwen&apos;s Little World</div>
        <div
          style={{
            marginTop: 22,
            fontSize: 16,
            letterSpacing: 4,
            color: "#a89d8d",
            textTransform: "uppercase",
          }}
        >
          HCI · Product · Creative Tech
        </div>
      </div>
    ),
    { ...size },
  );
}
