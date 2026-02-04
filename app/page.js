"use client";

import { useState } from "react";
import CitySummary from "@/src/components/dashboard/CitySummary";
import DataTable from "@/src/components/dashboard/DataTable";
import MapCanvas from "@/src/components/dashboard/MapCanvas";
import MembershipChart from "@/src/components/dashboard/MembershipChart";
import Header from "@/src/components/layout/Header";
import Sidebar from "@/src/components/layout/Sidebar";

export default function Home() {
  const [activeLayer, setActiveLayer] = useState("heatmap");
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

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-white">
      <Header />
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        <Sidebar
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <MapCanvas
          activeLayer={activeLayer}
          viewMode={viewMode}
          selectedCity={selectedCity}
          onCityClick={handleCityClick}
        />
      </div>
      <div className="flex gap-4 p-4 pt-0 h-80 overflow-hidden">
        <CitySummary
          viewMode={viewMode}
          selectedCity={selectedCity}
          selectedCustomer={selectedCustomer}
        />
        <MembershipChart
          viewMode={viewMode}
          selectedCity={selectedCity}
          selectedCustomer={selectedCustomer}
        />
        <DataTable
          key={selectedCity?.city || "all"}
          viewMode={viewMode}
          selectedCity={selectedCity}
          selectedCustomer={selectedCustomer}
          onCustomerClick={handleCustomerClick}
        />
      </div>
    </div>
  );
}
