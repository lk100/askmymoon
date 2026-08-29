'use client';

import { useState, useEffect } from 'react';

export function useGeoLocation() {
  const [country, setCountry] = useState('IN'); // Default to India
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedCountry = localStorage.getItem('user_country');
    if (cachedCountry) {
      setCountry(cachedCountry);
    }

    // Use the cached value immediately, then refresh it without touching form data.
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        const detectedCountry = data.country_code || 'IN';
        localStorage.setItem('user_country', detectedCountry);
        setCountry(detectedCountry);
      })
      .catch(() => setCountry('IN')) // Fallback to IN on failure
      .finally(() => setLoading(false));
  }, []);

  return { 
    country, 
    isIndia: country === 'IN', 
    loading 
  };
}