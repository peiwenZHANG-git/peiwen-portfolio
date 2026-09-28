import { ImageResponse } from "next/og";

/**
 * iOS "add to home screen" icon (Next file-convention route, same idea as icon.tsx but
 * at the larger size + fully square/no-transparency that Safari expects). Same branch
 * mark as the site logo, just bigger and with more breathing room.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <svg width="104" height="160" viewBox="0 0 22 34" fill="none" stroke="#7d8566" strokeWidth="1.4" strokeLinecap="round">
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
