/**
 * Key -> filename map for the notebook redesign's sticker/asset library.
 *
 * This file is the manifest itself (design-assets/about/assets-manifest.json, copied
 * unmodified), imported directly rather than hand-typed, per
 * design-assets/about/IMPLEMENTATION.md §3: "建议直接 import 它来建立键名到路径的字典，
 * 不要手抄。" Keys used by layout.js's `IMG['key']` / `IMG.key` map 1:1 to entries here.
 */
import assetFiles from "./assets-manifest.json";

export type AboutAssetKey = keyof typeof assetFiles;

export function aboutAsset(key: AboutAssetKey): string {
  return `/assets/about/${assetFiles[key]}`;
}
