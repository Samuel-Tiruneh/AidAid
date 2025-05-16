import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

// Fix for default marker icons - using direct imports
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

// Set up custom icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DonationImpactMap = () => {
  const [activeLocation, setActiveLocation] = useState(null);

  const donationLocations = [
    {
      id: 1,
      lat: 40.7128,
      lng: -74.006,
      city: "New York",
      amount: 125000,
      projects: 8,
      impact: "Funded 5 community kitchens and 3 education programs"
    },
    {
      id: 2,
      lat: 34.0522,
      lng: -118.2437,
      city: "Los Angeles",
      amount: 87500,
      projects: 6,
      impact: "Supported housing for 150 families"
    },
    {
      id: 3,
      lat: 41.8781,
      lng: -87.6298,
      city: "Chicago",
      amount: 65000,
      projects: 4,
      impact: "Provided scholarships for 300 students"
    },
    {
      id: 4,
      lat: 29.7604,
      lng: -95.3698,
      city: "Houston",
      amount: 110000,
      projects: 7,
      impact: "Covered medical expenses for 500 patients"
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-2xl shadow-md mt-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Donation Impact Map</h2>
      <p className="text-gray-600 mb-6">
        See how your contributions are making a difference across different regions
      </p>

      <div className="h-96 rounded-lg overflow-hidden relative">
        <MapContainer 
          center={[37.0902, -95.7129]} 
          zoom={4} 
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {donationLocations.map((location) => (
            <Marker 
              key={location.id}
              position={[location.lat, location.lng]}
              eventHandlers={{
                click: () => setActiveLocation(location),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{location.city}</h3>
                  <p className="text-green-600 font-semibold">
                    {formatCurrency(location.amount)} donated
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">{location.projects}</span> projects funded
                  </p>
                  <p className="text-xs mt-2 text-gray-600">{location.impact}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {activeLocation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-2">{activeLocation.city} Impact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Donations</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(activeLocation.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Projects Funded</p>
              <p className="text-2xl font-bold text-blue-600">
                {activeLocation.projects}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-700">{activeLocation.impact}</p>
        </motion.div>
      )}

      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">Total Donations</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(donationLocations.reduce((sum, loc) => sum + loc.amount, 0))}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">Projects Funded</p>
            <p className="text-xl font-bold text-blue-600">
              {donationLocations.reduce((sum, loc) => sum + loc.projects, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-800">Cities Supported</p>
            <p className="text-xl font-bold text-purple-600">
              {donationLocations.length}
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-800">Avg. Donation</p>
            <p className="text-xl font-bold text-amber-600">
              {formatCurrency(
                donationLocations.reduce((sum, loc) => sum + loc.amount, 0) / 
                donationLocations.length
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DonationImpactMap;