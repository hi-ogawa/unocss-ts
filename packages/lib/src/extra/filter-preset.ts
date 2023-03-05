import type { Preset } from "unocss";

export function filterColorPallete(
  preset: Preset,
  allowed: string[] = []
): Preset {
  const theme = preset.theme as any;
  if (theme) {
    for (const [k, v] of Object.entries(theme.colors)) {
      if (typeof v === "object" && !allowed.includes(k)) {
        delete theme.colors[k];
      }
    }
  }
  return preset;
}
