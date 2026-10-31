import "@fontsource-variable/schibsted-grotesk";
import "@/styles/theme.css";
import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Guide } from "@/components/guide/Guide";
import { BackToTop } from "@/components/layout/BackToTop";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { LoopController } from "@/components/motion/LoopController";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PointerEffects } from "@/components/motion/PointerEffects";
import { business } from "@/content/business";
import { siteDescription } from "@/content/home";
import { config } from "@/lib/config";
import { MOTION_READY_SCRIPT } from "@/lib/motionReady";
import { localBusinessJsonLd } from "@/lib/seo";
import { browserThemeColor } from "@/styles/theme";

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: `${business.name} | Tally, billing software and IT solutions in Vapi`,
    template: `%s | ${business.name}, Vapi`,
  },
  description: siteDescription,
  applicationName: business.name,
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: browserThemeColor.light },
    { media: "(prefers-color-scheme: dark)", color: browserThemeColor.dark },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The inline script adds classes to <html> before React hydrates; suppressHydrationWarning keeps them.
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Runs before first paint: hidden starting states apply only once this has run (no JS, no hiding). */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_READY_SCRIPT }} />
      </head>
      <body>
        <MotionProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <MobileActionBar />
          <Guide />
          <BackToTop />
          <PointerEffects />
          <LoopController />
        </MotionProvider>
        <script
          type="application/ld+json"
          // JSON-LD must be inline; the data comes only from our own content file.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </body>
    </html>
  );
}
