import React, { useRef, useEffect, useState } from "react";

const defaultCenter = { lat: 20, lng: 0 };

// Custom SVG marker generator (blue/green)
const getCustomMarkerIcon = (color = '#147d6c') => {
  // SVG marker as a data URL
  const svg = `
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#shadow)">
        <path d="M24 2C13.5 2 5 10.5 5 21.5C5 36.5 24 54 24 54C24 54 43 36.5 43 21.5C43 10.5 34.5 2 24 2Z" fill="${color}" stroke="#fff" stroke-width="3"/>
        <circle cx="24" cy="22" r="9" fill="#fff"/>
      </g>
      <defs>
        <filter id="shadow" x="0" y="0" width="48" height="56" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.15"/>
        </filter>
      </defs>
    </svg>
  `;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(48, 56),
    anchor: new window.google.maps.Point(24, 54),
    labelOrigin: new window.google.maps.Point(24, 60),
  };
};

const SearchResultsMap = ({ listings = [], userLocation, onMarkerClick, selectedListingId }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    if (!map) {
      const m = new window.google.maps.Map(mapRef.current, {
        center: userLocation || defaultCenter,
        zoom: userLocation ? 12 : 2,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      setMap(m);
    }
  }, [mapRef, map, userLocation]);

  // Update markers and InfoWindow
  useEffect(() => {
    if (!map) return;
    markers.forEach((marker) => marker.setMap(null));
    if (infoWindow) infoWindow.close();

    const newMarkers = [];
    let bounds = new window.google.maps.LatLngBounds();
    let hasMarkers = false;

    listings.forEach((listing) => {
      if (
        typeof listing.latitude === "number" &&
        typeof listing.longitude === "number" &&
        !isNaN(listing.latitude) &&
        !isNaN(listing.longitude)
      ) {
        hasMarkers = true;
        const imageUrl = listing.imagesLink && listing.imagesLink[0] ? listing.imagesLink[0] : null;
        const marker = new window.google.maps.Marker({
          position: { lat: listing.latitude, lng: listing.longitude },
          map,
          title: listing.title,
          icon: getCustomMarkerIcon(selectedListingId === listing.id ? '#14a390' : '#147d6c'),
        });

        // InfoWindow content with improved style and hide close button
        const previewContent = `
          <style>
            .gm-ui-hover-effect { display: none !important; }
          </style>
          <div style="min-width:220px;max-width:300px;background:#fff;border-radius:14px;box-shadow:0 4px 16px #0002;padding:12px 14px 12px 12px;display:flex;gap:14px;align-items:center;position:relative;">
            <div style="flex-shrink:0;width:60px;height:60px;overflow:hidden;border-radius:10px;border:2px solid #14a390;box-shadow:0 2px 8px #14a39022;">
              <img src='${imageUrl || '/default-listing.jpg'}' alt='Thumbnail' style='width:100%;height:100%;object-fit:cover;display:block;' />
            </div>
          </div>
        `;

        let hoverInfoWindow = null;

        marker.addListener("mouseover", () => {
          if (infoWindow) infoWindow.close();
          hoverInfoWindow = new window.google.maps.InfoWindow({
            content: previewContent,
            pixelOffset: new window.google.maps.Size(0, -40),
          });
          hoverInfoWindow.open(map, marker);
          setInfoWindow(hoverInfoWindow);
        });
        marker.addListener("mouseout", () => {
          if (hoverInfoWindow) hoverInfoWindow.close();
        });

        // On click: redirect to listing page
        marker.addListener("click", () => {
          if (onMarkerClick) onMarkerClick(listing);
          window.location.href = `/listing/${listing._id}`;
        });

        newMarkers.push(marker);
        bounds.extend(marker.getPosition());
      }
    });

    setMarkers(newMarkers);

    // Center map
    if (userLocation && !hasMarkers) {
      map.setCenter(userLocation);
      map.setZoom(12);
    } else if (hasMarkers) {
      map.fitBounds(bounds, 100);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(2);
    }

    // Cleanup
    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
      if (infoWindow) infoWindow.close();
    };
    // eslint-disable-next-line
  }, [listings, map, selectedListingId, userLocation]);

  // Responsive map resize
  useEffect(() => {
    if (!map) return;
    const handleResize = () => {
      window.google.maps.event.trigger(map, "resize");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return (
    <>
      <style>{`
        /* Hide Google Maps bottom overlays (for demo/internal use only) */
        .gm-style-cc, .gmnoprint, .gm-style-cc span, .gm-style-cc a, .gmnoprint a, .gmnoprint span, .gm-style-cc img, .gm-style-cc div, .gm-style-cc svg {
          display: none !important;
        }
        /* Hide Google logo image specifically */
        .gm-style-cc img[alt="Google"], .gm-style-cc img[src*="google_white"] {
          display: none !important;
        }
        /* Hide Google logo in newer map versions */
        .gm-style-cc div[style*="background-image"], .gm-style-cc div[style*="googlelogo"] {
          display: none !important;
        }
        /* Hide Google logo in watermark overlays */
        .gm-style-cc .gm-style-cc, .gm-style-cc .gm-style-cc span, .gm-style-cc .gm-style-cc img {
          display: none !important;
        }
      `}</style>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "70vh",
          minHeight: 400,
          borderRadius: 16,
          boxShadow: "0 2px 8px #0001",
          marginBottom: 24,
        }}
      />
    </>
  );
};

export default SearchResultsMap;
