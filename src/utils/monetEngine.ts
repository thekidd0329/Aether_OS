import { MonetPalette } from '../types';

// Convert Hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateMonetPalette(seedHex: string, isDark: boolean = true): MonetPalette {
  const { h, s } = hexToHSL(seedHex || '#6366f1');
  const safeSaturation = Math.max(35, Math.min(s, 75));

  if (isDark) {
    return {
      seed: seedHex,
      primary: hslToHex(h, safeSaturation, 75),
      primaryContainer: hslToHex(h, Math.round(safeSaturation * 0.7), 24),
      onPrimary: hslToHex(h, 40, 10),
      secondary: hslToHex((h + 30) % 360, Math.round(safeSaturation * 0.5), 70),
      secondaryContainer: hslToHex((h + 30) % 360, Math.round(safeSaturation * 0.4), 22),
      tertiary: hslToHex((h + 60) % 360, Math.round(safeSaturation * 0.6), 75),
      surface: hslToHex(h, 15, 8),
      surfaceContainer: hslToHex(h, 18, 14),
      onSurface: '#f1f5f9',
      outline: hslToHex(h, 15, 30),
      accent: hslToHex(h, Math.min(100, safeSaturation + 20), 65),
    };
  } else {
    return {
      seed: seedHex,
      primary: hslToHex(h, safeSaturation, 38),
      primaryContainer: hslToHex(h, Math.round(safeSaturation * 0.8), 88),
      onPrimary: '#ffffff',
      secondary: hslToHex((h + 30) % 360, Math.round(safeSaturation * 0.5), 40),
      secondaryContainer: hslToHex((h + 30) % 360, Math.round(safeSaturation * 0.4), 90),
      tertiary: hslToHex((h + 60) % 360, Math.round(safeSaturation * 0.6), 35),
      surface: hslToHex(h, 20, 98),
      surfaceContainer: hslToHex(h, 25, 93),
      onSurface: '#0f172a',
      outline: hslToHex(h, 15, 75),
      accent: hslToHex(h, safeSaturation, 45),
    };
  }
}
