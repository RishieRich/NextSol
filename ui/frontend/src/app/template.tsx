"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Set after the first page has mounted; every later Template mount is a navigation. */
let firstPageMounted = false;

/**
 * Re-mounts on every navigation, so each new page settles in with the same short fade.
 * The first page of a visit does not fade: it must paint at once (the fade would hold back the largest paint).
 */
export default function Template({ children }: { children: ReactNode }) {
  const [isNavigation] = useState(() => firstPageMounted);

  useEffect(() => {
    firstPageMounted = true;
  }, []);

  return <div className={isNavigation ? "page-enter" : undefined}>{children}</div>;
}
