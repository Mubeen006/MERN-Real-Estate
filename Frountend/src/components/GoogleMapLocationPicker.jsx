import React, { useState, useRef, useCallback, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "350px" };
const defaultCenter = { lat: 24.8607, lng: 67.0011 }; // Karachi as fallback

const GoogleMapLocationPicker = ({ value, onChange }) => {
  const [marker, setMarker] = useState(
    value && value.latitude && value.longitude
      ? { lat: value.latitude, lng: value.longitude }
      : null
  );
  const [mapCenter, setMapCenter] = useState(
    value && value.latitude && value.longitude
      ? { lat: value.latitude, lng: value.longitude }
      : defaultCenter
  );
  const autocompleteRef = useRef();
  const searchInputRef = useRef();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // When marker changes, update the search input value to match the address
  const updateSearchInput = (address) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = address || "";
    }
  };

  // Reverse geocode to get address and postal code
  const fetchAddress = useCallback((lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        updateSearchInput(results[0].formatted_address);
        onChange({
          latitude: lat,
          longitude: lng,
          address: results[0].formatted_address,
        });
      }
    });
  }, [onChange]);

  // Handle marker drag or map click
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    setMapCenter({ lat, lng });
    fetchAddress(lat, lng);
  };

  // Use browser geolocation
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMarker({ lat, lng });
        setMapCenter({ lat, lng });
        fetchAddress(lat, lng);
      });
    }
  };

  // Handle place selection from autocomplete
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarker({ lat, lng });
      setMapCenter({ lat, lng });
      // Use the formatted address from the place object directly
      const address = place.formatted_address || "";
      updateSearchInput(address);
      onChange({
        latitude: lat,
        longitude: lng,
        address,
      });
    }
  };

  // If value changes from parent, update marker and center
  useEffect(() => {
    if (value && value.latitude && value.longitude) {
      setMarker({ lat: value.latitude, lng: value.longitude });
      setMapCenter({ lat: value.latitude, lng: value.longitude });
    }
  }, [value]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      <div className="flex gap-2 mb-2 items-center">
        <Autocomplete
          onLoad={ref => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
        >
          <div className="relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search location"
              className="p-2 border rounded w-full pr-10"
              style={{ paddingRight: '2.5rem' }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </span>
          </div>
        </Autocomplete>
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Use My Location
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={15}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
          disableDefaultUI: true,
        }}
      >
        {marker && (
          <Marker
            position={marker}
            draggable
            onDragEnd={handleMapClick}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapLocationPicker;
