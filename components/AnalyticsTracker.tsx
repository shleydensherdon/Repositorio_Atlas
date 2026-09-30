'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once per session (using sessionStorage) to avoid counting refreshes
    if (typeof window !== 'undefined' && !initialized.current) {
      const hasVisited = sessionStorage.getItem('hasVisitedSession');
      
      if (!hasVisited) {
        initialized.current = true;
        sessionStorage.setItem('hasVisitedSession', 'true');
        
        // Log the visit
        fetch('/api/analytics/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: pathname }),
        }).catch((err) => console.error('Failed to log visit', err));
      }
    }
  }, [pathname]);

  return null;
}
