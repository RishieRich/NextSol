/**
 * Work examples for /portfolio/. Empty by default: never add fake case studies.
 * Add an entry only for real work Niket has permission to show, with its image in public/portfolio/.
 */

export type PortfolioItem = {
  title: string;
  client: string;
  kind: "Social media" | "Logo" | "Packaging" | "Brochure" | "Visiting card" | "Website";
  image: { src: string; width: number; height: number; alt: string };
};

export const portfolio: PortfolioItem[] = [];
