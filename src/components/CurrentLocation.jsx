import React, { useCallback, useEffect, useRef } from "react";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";
import { renderToString } from "react-dom/server";
import { FaCircle } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { TbZoomInAreaFilled } from "react-icons/tb";

import "./styles/maps.css";

const CurrentLocation = ({ map, goToDefaultPosition }) => {
  const currentLocationLayerRef = useRef(null);

  const handleGoToCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = fromLonLat([longitude, latitude]);

          // Create marker feature
          const marker = new Feature({
            geometry: new Point(currentLocation),
          });

          // Style the marker
          marker.setStyle(
            new Style({
              image: new Icon({
                src: `data:image/svg+xml;utf8,${encodeURIComponent(
                  renderToString(
                    <FaCircle
                      style={{
                        fill: "#4285f4",
                      }}
                    />
                  )
                )}`,
                imgSize: [100, 100],
                anchor: [0.5, 1],
              }),
            })
          );

          // Create vector layer
          const currentLocationLayer = new VectorLayer({
            source: new VectorSource({
              features: [marker],
            }),
          });

          // Remove previous current location layer if exists
          if (currentLocationLayerRef.current) {
            map.removeLayer(currentLocationLayerRef.current);
          }

          // Add vector layer to map
          map.addLayer(currentLocationLayer);

          // Save reference to current location layer
          currentLocationLayerRef.current = currentLocationLayer;

          // Center map on current location
          map.getView().animate({ center: currentLocation, zoom: 14 });

          // Ensure current location layer is on top
          currentLocationLayer.setZIndex(9999);
        },
        (error) => {
          console.error("Error getting current position:", error);
          alert(
            "Error getting current position. Please check your browser settings."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [map]);

  useEffect(() => {
    // Get current location and add marker
    handleGoToCurrentLocation();
  }, [handleGoToCurrentLocation]);

  return (
    <>
      <div className="current-location">
        <div onClick={handleGoToCurrentLocation}>
          <BiCurrentLocation className="btn-current" />
        </div>
        <div onClick={goToDefaultPosition} className="btn-current">
          <TbZoomInAreaFilled />
        </div>
      </div>
    </>
  );
};

export default CurrentLocation;
