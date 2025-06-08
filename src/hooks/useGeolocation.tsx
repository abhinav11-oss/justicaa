
import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationHook extends GeolocationState {
  getCurrentLocation: () => void;
  setManualLocation: (lat: number, lng: number) => void;
}

export function useGeolocation(): GeolocationHook {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const getCurrentLocation = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser. Please select your city manually.',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please select your city manually or enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please select your city manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or select your city manually.';
            break;
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute cache
      }
    );
  };

  const setManualLocation = (lat: number, lng: number) => {
    setState({
      latitude: lat,
      longitude: lng,
      error: null,
      loading: false,
    });
  };

  return {
    ...state,
    getCurrentLocation,
    setManualLocation,
  };
}
