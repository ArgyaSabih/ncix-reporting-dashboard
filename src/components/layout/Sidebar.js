import Link from "next/link";
import LayerToggle from "../dashboard/LayerToggle";

const Sidebar = () => {
  return (
    <div className="w-full flex-1/3 flex-col border border-black mt-12 ml-6 p-4 gap-10">
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
