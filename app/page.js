import CitySummary from "@/src/components/dashboard/CitySummary";
import DataTable from "@/src/components/dashboard/DataTable";
import MapCanvas from "@/src/components/dashboard/MapCanvas";
import MembershipChart from "@/src/components/dashboard/MembershipChart";
import Header from "@/src/components/layout/Header";
import Sidebar from "@/src/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <div className="flex w-full">
        <Sidebar />
        <MapCanvas />
      </div>
      <div className="flex w-full">
        <CitySummary />
        <MembershipChart />
        <DataTable />
      </div>
    </div>
  );
}
