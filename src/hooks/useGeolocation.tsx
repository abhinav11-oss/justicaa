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
        error: 'Geolocation is not supported by this browser.',
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
            errorMessage = 'Location access denied. Please enter your location manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        // Fallback to IP geolocation
        fetchIPLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const fetchIPLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        setState({
          latitude: data.latitude,
          longitude: data.longitude,
          error: null,
          loading: false,
        });
      } else {
        throw new Error('IP geolocation failed');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Unable to determine location. Please enter manually.',
      }));
    }
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