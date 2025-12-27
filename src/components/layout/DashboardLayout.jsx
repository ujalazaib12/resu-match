import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import DashboardSidebar from "./DashboardSidebar";
import PropTypes from "prop-types";

const DashboardLayout = ({ children }) => {
	const [isSidebarOpen, setSidebarOpen] = useState(false);
	const [isCollapsed, setCollapsed] = useState(false);

	return (
		<div className="flex-1 w-full h-full bg-gray-50 overflow-hidden relative flex">
			{/* Mobile Sidebar Overlay */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar Container */}
			<div
				className={`
                absolute inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out h-full
                ${isCollapsed ? "w-20" : "w-64"}
                lg:relative lg:translate-x-0 lg:block lg:shrink-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
			>
				<div className="h-full flex flex-col">
					{/* Mobile Close Button */}
					<div className="lg:hidden p-4 flex justify-end border-b border-gray-100">
						<button
							onClick={() => setSidebarOpen(false)}
							className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
						>
							<FiX size={24} />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto overflow-x-hidden">
						<DashboardSidebar
							isCollapsed={isCollapsed}
							toggleCollapse={() => setCollapsed(!isCollapsed)}
						/>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className="flex-1 h-full overflow-y-auto overflow-x-hidden min-w-0 custom-scrollbar">
				{/* Mobile Menu Trigger */}
				<div className="lg:hidden p-4 pb-0">
					<button
						onClick={() => setSidebarOpen(true)}
						className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
					>
						<FiMenu size={20} />
						<span className="font-medium">Menu</span>
					</button>
				</div>

				{children}
			</main>
		</div>
	);
};

DashboardLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default DashboardLayout;
