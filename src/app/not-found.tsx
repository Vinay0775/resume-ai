'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect all unknown routes back to home since this is an SPA
    // If there were query params (like password reset tokens), preserve them
    const search = window.location.search;
    router.replace('/' + search);
  }, [router]);

  return null;
}
