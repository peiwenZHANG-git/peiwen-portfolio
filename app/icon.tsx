import { ImageResponse } from "next/og";

/**
 * Browser-tab favicon (Next's file-convention route: this file's default export is
 * called at request time and its PNG becomes /icon — Next wires up the <link rel="icon">
 * automatically, no metadata edit needed). Also covers PWA-style "add to home screen"
 * icons that ask for a plain /icon rather than /apple-icon (see apple-icon.tsx for the
 * iOS-specific one).
 *
 * The mark is the same little branch/sprout used as the site's logo in
 * components/site-header.tsx (identical <path> data, same sage green) — reused rather
 * than inventing new artwork, so the tab icon is recognizably "the same logo", not a
 * new symbol Peiwen never approved.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4ede1",
          borderRadius: 7,
        }}
      >
        <svg width="19" height="29" viewBox="0 0 22 34" fill="none" stroke="#7d8566" strokeWidth="1.8" strokeLinecap="round">
          <path d="M11 33V5" />
          <path d="M11 12c-4-1-7-4-7-8 4 0 7 3 7 7" />
          <path d="M11 18c4-1 7-4 7-8-4 0-7 3-7 7" />
          <path d="M11 25c-4-1-7-4-7-8 4 0 7 3 7 7" />
          <path d="M11 9c2-2 3-4 3-7-2 1-3 3-3 6" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
