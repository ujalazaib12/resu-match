import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";
import {
	FiGrid,
	FiBriefcase,
	FiBookmark,
	FiSettings,
	FiLogOut,
	FiChevronLeft,
	FiChevronRight,
} from "react-icons/fi";

const DashboardSidebar = ({ isCollapsed, toggleCollapse }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const menuItems = [
		{
			icon: FiGrid,
			label: "Overview",
			path: "/dashboard",
		},
		{
			icon: FiBriefcase,
			label: "Applied Jobs",
			path: "/applications",
		},
		{
			icon: FiBookmark,
			label: "Favorite Jobs",
			path: "/jobs/saved",
		},
		{
			icon: FiSettings,
			label: "Settings",
			path: "/settings",
		},
	];

	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<aside
			className={`w-full bg-white h-full flex flex-col transition-all duration-300`}
		>
			{/* Header */}
			<div
				className={`p-6 flex items-center ${
					isCollapsed ? "justify-center" : "justify-between"
				}`}
			>
				{!isCollapsed && (
					<h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
						CANDIDATE DASHBOARD
					</h2>
				)}
				<button
					onClick={toggleCollapse}
					className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hidden lg:block"
				>
					{isCollapsed ? (
						<FiChevronRight className="w-5 h-5" />
					) : (
						<FiChevronLeft className="w-5 h-5" />
					)}
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-4">
				<ul className="space-y-2">
					{menuItems.map((item) => {
						const active = isActive(item.path);
						return (
							<li key={item.path}>
								<Link
									to={item.path}
									title={isCollapsed ? item.label : ""}
									className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 
                                    ${
																			active
																				? "bg-blue-600 text-white shadow-md"
																				: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
																		}
                                    ${isCollapsed ? "justify-center" : ""}
                                    `}
								>
									<item.icon
										className={`text-lg transition-colors ${
											active
												? "text-white"
												: "text-gray-400 group-hover:text-gray-600"
										}`}
									/>

									{!isCollapsed && (
										<span className="whitespace-nowrap">{item.label}</span>
									)}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Logout */}
			<div className="p-4 mt-auto border-t border-gray-100">
				<button
					onClick={handleLogout}
					title={isCollapsed ? "Log out" : ""}
					className={`flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 w-full ${
						isCollapsed ? "justify-center" : ""
					}`}
				>
					<FiLogOut className="text-lg text-gray-400" />
					{!isCollapsed && <span>Log-out</span>}
				</button>
			</div>
		</aside>
	);
};

DashboardSidebar.propTypes = {
	isCollapsed: PropTypes.bool.isRequired,
	toggleCollapse: PropTypes.func.isRequired,
};

export default DashboardSidebar;
