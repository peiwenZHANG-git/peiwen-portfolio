export type HubPreview = "IDLE" | "LEFT_PREVIEW" | "RIGHT_PREVIEW" | "ABOUT_HOVER";
export type HubDestination = "LEFT" | "RIGHT" | "ABOUT";

export function previewFromSwipe(deltaX: number): HubPreview {
  if (Math.abs(deltaX) < 44) return "IDLE";
  return deltaX < 0 ? "RIGHT_PREVIEW" : "LEFT_PREVIEW";
}
