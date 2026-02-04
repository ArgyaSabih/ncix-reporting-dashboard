import Link from "next/link";
import LayerToggle from "../dashboard/LayerToggle";

const Sidebar = () => {
  return (
    <div className="w-1/4 flex h-full gap-20 flex-col border border-black ml-6 p-4 rounded-sm">
      <LayerToggle />
      <Link href="">
        <button className=" w-full h-12 bg-[#AC0505] flex justify-center items-center rounded-lg">
          Upload Data
        </button>
      </Link>
    </div>
  );
};

export default Sidebar;
