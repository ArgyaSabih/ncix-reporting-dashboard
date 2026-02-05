"use client";

import {useState} from "react";
import CitySummary from "@/src/components/dashboard/CitySummary";
import DataTable from "@/src/components/dashboard/DataTable";
import MemberMap from "@/src/components/dashboard/MemberMap";
import MembershipChart from "@/src/components/dashboard/MembershipChart";
import Header from "@/src/components/layout/Header";
import Sidebar from "@/src/components/layout/Sidebar";

export default function Home() {
  const [activeLayers, setActiveLayers] = useState(["heatmap"]); // Array of active layers
  const [viewMode, setViewMode] = useState("facility"); // facility, network, exchange
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setSelectedCustomer(null);
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedCity(null);
  };

  const handleReset = () => {
    setSelectedCity(null);
    setSelectedCustomer(null);
    setActiveLayers(["heatmap"]);
  };

  const handleLayerToggle = (layer) => {
    setActiveLayers((prev) => {
      if (prev.includes(layer)) {
        return prev.filter((l) => l !== layer);
      } else {
        return [...prev, layer];
      }
    });
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-white">
      <Header />
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        <Sidebar
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <MemberMap
          activeLayers={activeLayers}
          viewMode={viewMode}
          selectedCity={selectedCity}
          onCityClick={handleCityClick}
          onReset={handleReset}
        />
      </div>
      <div className="flex gap-4 p-4 pt-0 h-80 overflow-hidden">
        <CitySummary viewMode={viewMode} selectedCity={selectedCity} selectedCustomer={selectedCustomer} />
        <MembershipChart
          viewMode={viewMode}
          selectedCity={selectedCity}
          selectedCustomer={selectedCustomer}
        />
        <DataTable
          viewMode={viewMode}
          selectedCity={selectedCity}
          selectedCustomer={selectedCustomer}
          onCustomerClick={handleCustomerClick}
        />
      </div>
    </div>
  );
}
