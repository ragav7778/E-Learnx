import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSideBar } from "./mobilesidebar";

const Navbar = () => {
    return ( 
        <div className="p-4 border-4 h-full flex items-center bg-white shadow-sm">
            <MobileSideBar/>
            <NavbarRoutes/>
        </div>
     );
}
 
export default Navbar;