/**
 * Niket's real logo, built from images/ by scripts/brand-assets.mjs.
 * The source is 250 x 186 px: never show it larger than that.
 * CONFIRM: ask Niket for an SVG or a 1000 px PNG, then rerun the script.
 */

export type LogoFile = { src: string; width: number; height: number };

export type BrandLogo = LogoFile & {
  /** The same logo with its white background made transparent, for the header on tinted backgrounds. */
  transparent: LogoFile;
  /** White made transparent and "SOLUTIONS" recoloured white, for the ink footer. */
  onDark: LogoFile;
  /** The "N" with its circuit tree, transparent; carried by the hero chip. */
  mark: LogoFile;
  /**
   * Centres of the eight circuit-tree nodes, in the logo's own 250 x 186 pixel space,
   * measured from the source. The logo animation lights these in order.
   */
  nodes: readonly (readonly [number, number])[];
};

export const brandLogo: BrandLogo | null = {
  src: "/brand/logo.webp",
  width: 250,
  height: 186,
  transparent: { src: "/brand/logo-transparent.webp", width: 250, height: 186 },
  onDark: { src: "/brand/logo-on-dark.webp", width: 250, height: 186 },
  mark: { src: "/brand/logo-mark.webp", width: 126, height: 153 },
  nodes: [
    [71.4, 5],
    [86.4, 14.2],
    [94, 4.2],
    [101, 18.4],
    [114, 6.6],
    [124.2, 7.8],
    [123.6, 18],
    [118.3, 34.2],
  ],
};

/** Niket's photo, supplied for slice 1. Shown on the about teaser and the about page as it is. */
export const founderPhoto = { src: "/brand/niket-naik.webp", width: 720, height: 720 } as const;
