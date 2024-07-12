import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "../App.css";
import Legend from "./Legend"; 

const regionCoordinates = {
  US: [37.0902, -95.7129],
  AT: [47.5162, 14.5501],
  SE: [60.1282, 18.6435],
};

const getColor = (usage) => {
  if (usage > 5000) return "blue";
  if (usage > 1000) return "lightblue";
  if (usage > 500) return "lightsteelblue";
  return "skyblue";
};

const MapComponent = () => {
  const [data, setData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    axios
      .get("/data.js")
      .then((response) => {
        let rawData = response.data;

        if (typeof rawData === "string") {
          rawData = JSON.parse(rawData);
        }

        const regionData = rawData.reduce((acc, curr) => {
          acc[curr.region] = (acc[curr.region] || 0) + curr.data;
          return acc;
        }, {});

        const processedData = Object.keys(regionData).map((region) => ({
          region,
          usage: regionData[region],
          coordinates: regionCoordinates[region],
        }));

        setData(processedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleMarkerClick = (region) => {
    setSelectedRegion(region);
  };

  return (
    <div>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map((region, idx) =>
          region.coordinates ? (
            <CircleMarker
              key={idx}
              center={region.coordinates}
              radius={10}
              fillOpacity={0.5}
              color={getColor(region.usage)}
              eventHandlers={{
                click: () => handleMarkerClick(region),
              }}
            >
              <Tooltip>
                <span>{`Usage: $${region.usage}`}</span>
              </Tooltip>
            </CircleMarker>
          ) : null
        )}
      </MapContainer>
      {selectedRegion && (
        <div className="region-details">
          <h3>Region Details</h3>
          <p>Region: {selectedRegion.region}</p>
          <p>Usage: ${selectedRegion.usage}</p>
        </div>
      )}
      <Legend />
    </div>
  );
};

export default MapComponent;
