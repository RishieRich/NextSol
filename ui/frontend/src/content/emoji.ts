/**
 * The 3D emoji the site uses: Microsoft Fluent Emoji, 3D style (MIT licence).
 * Each key maps to an official asset folder in github.com/microsoft/fluentui-emoji;
 * scripts/fetch-emoji.mjs downloads exactly these and writes public/emoji/<key>.webp (160 px).
 * Add an emoji here, then run `node scripts/fetch-emoji.mjs`. Never add one anywhere else.
 */

export const emoji = {
  tally: { folder: "Ledger", glyph: "📒", name: "Ledger" },
  customisation: { folder: "Hammer and wrench", glyph: "🛠️", name: "Hammer and wrench" },
  cloud: { folder: "Cloud", glyph: "☁️", name: "Cloud" },
  mobile: { folder: "Mobile phone", glyph: "📱", name: "Mobile phone" },
  backup: { folder: "Shield", glyph: "🛡️", name: "Shield" },
  gst: { folder: "Receipt", glyph: "🧾", name: "Receipt" },
  ewaybill: { folder: "Delivery truck", glyph: "🚚", name: "Delivery truck" },
  saral: { folder: "Card index dividers", glyph: "🗂️", name: "Card index dividers" },
  payroll: { folder: "Money bag", glyph: "💰", name: "Money bag" },
  busy: { folder: "Convenience store", glyph: "🏪", name: "Convenience store" },
  vyapar: { folder: "Chart increasing", glyph: "📈", name: "Chart increasing" },
  crm: { folder: "Office building", glyph: "🏢", name: "Office building" },
  whatsapp: { folder: "Speech balloon", glyph: "💬", name: "Speech balloon" },
  barcode: { folder: "Label", glyph: "🏷️", name: "Label" },
  web: { folder: "Globe with meridians", glyph: "🌐", name: "Globe with meridians" },
  apps: { folder: "Mobile phone with arrow", glyph: "📲", name: "Mobile phone with arrow" },
  marketing: { folder: "Megaphone", glyph: "📣", name: "Megaphone" },
  design: { folder: "Artist palette", glyph: "🎨", name: "Artist palette" },
  computers: { folder: "Laptop", glyph: "💻", name: "Laptop" },
  cctv: { folder: "Video camera", glyph: "📹", name: "Video camera" },
  support: { folder: "Handshake", glyph: "🤝", name: "Handshake" },
  years: { folder: "Trophy", glyph: "🏆", name: "Trophy" },
  clients: { folder: "Raising hands", glyph: "🙌", name: "Raising hands" },
  location: { folder: "Round pushpin", glyph: "📍", name: "Round pushpin" },
  sparkles: { folder: "Sparkles", glyph: "✨", name: "Sparkles" },
  rocket: { folder: "Rocket", glyph: "🚀", name: "Rocket" },
  chart: { folder: "Bar chart", glyph: "📊", name: "Bar chart" },
  lock: { folder: "Locked", glyph: "🔒", name: "Locked" },
  idea: { folder: "Light bulb", glyph: "💡", name: "Light bulb" },
  inventory: { folder: "Package", glyph: "📦", name: "Package" },
  bank: { folder: "Bank", glyph: "🏦", name: "Bank" },
  bell: { folder: "Bell", glyph: "🔔", name: "Bell" },
  sync: { folder: "Counterclockwise arrows button", glyph: "🔄", name: "Counterclockwise arrows button" },
  link: { folder: "Link", glyph: "🔗", name: "Link" },
  calendar: { folder: "Calendar", glyph: "📅", name: "Calendar" },
  search: { folder: "Magnifying glass tilted left", glyph: "🔍", name: "Magnifying glass tilted left" },
  gear: { folder: "Gear", glyph: "⚙️", name: "Gear" },
  card: { folder: "Credit card", glyph: "💳", name: "Credit card" },
  team: { folder: "Busts in silhouette", glyph: "👥", name: "Busts in silhouette" },
  home: { folder: "House", glyph: "🏠", name: "House" },
  clipboard: { folder: "Clipboard", glyph: "📋", name: "Clipboard" },
  printer: { folder: "Printer", glyph: "🖨️", name: "Printer" },
  heart: { folder: "Blue heart", glyph: "💙", name: "Blue heart" },
  star: { folder: "Star", glyph: "⭐", name: "Star" },
  check: { folder: "Check mark button", glyph: "✅", name: "Check mark button" },
  wave: { folder: "Waving hand", glyph: "👋", name: "Waving hand" },
} as const;

export type EmojiKey = keyof typeof emoji;

/** Public path of an emoji's image. */
export function emojiSrc(key: EmojiKey): string {
  return `/emoji/${key}.webp`;
}

/** Every emoji image is a 160 x 160 square. */
export const EMOJI_SOURCE_SIZE = 160;
