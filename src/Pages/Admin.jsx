import { useState } from "react";
import { 
    FiHome, 
    FiUsers, 
    FiSettings, 
    FiBarChart2, 
    FiCalendar,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";
import AdminHome from "../Components/Admin/AdminHome";
import AdminEmployees from "../Components/Admin/AdminEmployees";
import AdminTrips from "../Components/Admin/AdminTrips";
import AdminReports from "../Components/Admin/AdminReports";
import AdminSettings from "../Components/Admin/AdminSettings";

const Admin = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState("home");

    const menuItems = [
        { icon: FiHome, label: "Home", id: "home" },
        { icon: FiUsers, label: "Employees", id: "users" },
        { icon: FiCalendar, label: "Trips", id: "trips" },
        { icon: FiBarChart2, label: "Reports", id: "reports" },
        { icon: FiSettings, label: "Settings", id: "settings" },
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const AvtiveMenuItem = () => {

    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside 
                className={`
                    bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out
                    flex flex-col
                    ${isCollapsed ? 'w-20' : 'w-64'}
                `}
            >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    {!isCollapsed && (
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                           Admin Dashboard 
                        </h2>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                        aria-label={isCollapsed ? "توسيع القائمة" : "تصغير القائمة"}
                    >
                        {isCollapsed ? (
                            <FiChevronRight className="w-5 h-5" />
                        ) : (
                            <FiChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                onClick={() => setActiveMenuItem(item.id)}
                                key={item.id}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                                    transition-all duration-200
                                    hover:bg-gray-100 dark:hover:bg-gray-700
                                    text-gray-700 dark:text-gray-300
                                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                                `}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-8xl mx-auto">

                    {/* home content */}
                    {activeMenuItem === "home" && (<AdminHome/>)}

                    {/* users content */}
                    {activeMenuItem === "users" && (<AdminEmployees/>)}

                    {/* trips content */}
                    {activeMenuItem === "trips" && (<AdminTrips/>)}

                    {/* reports content */}
                    {activeMenuItem === "reports" && (<AdminReports/>)}

                    {/* settings content */}
                    {activeMenuItem === "settings" && (<AdminSettings/>)}
                
                </div>
            </main>
        </div>
    );
};

export default Admin;