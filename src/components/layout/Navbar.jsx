
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { FiPhone, FiChevronDown, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import InputField from "../common/InputField";
import CustomDropdown from "../common/CustomDropdown";

import LocationCombobox from "../common/LocationCombobox";

export default function Navbar() {
	const { isAuthenticated, user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLocation, setSelectedLocation] = useState("");

	const handleLogout = () => {
		logout();
		navigate("/");
		setIsMobileMenuOpen(false);
	};

	const handleSearch = (e) => {
		e.preventDefault();

		const params = new URLSearchParams();
		if (searchQuery.trim()) {
			params.append("search", searchQuery.trim());
		}
		if (selectedLocation && selectedLocation !== "Remote") {
			params.append("location", selectedLocation);
		} else if (selectedLocation === "Remote") {
			params.append("type", "remote");
		}

		if (params.toString()) {
			navigate(`/ jobs ? ${params.toString()} `);
		} else {
			navigate("/jobs");
		}
		setIsSearchOpen(false); // Close mobile search on submit
	};

	// Helper function to check if link is active
	const isActivePath = (path) => {
		if (path === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(path);
	};

	const navLinks = [
		{ path: "/", label: "Home" },
		{ path: "/jobs", label: "Find Job" },
		{ path: "/dashboard", label: "Dashboard" },
		...(isAuthenticated
			? [
				{ path: "/applications", label: "Applications" },
				{ path: "/jobs/saved", label: "Saved Jobs" },
			]
			: []),
	];

	return (
		<nav className="bg-white shadow-sm sticky top-0 z-50">
			{/* Top Navigation Bar - Links (Hidden on Mobile) */}
			<div className="hidden md:block bg-blue-600 border-b border-blue-500">
				<div className="px-4 sm:px-6 lg:px-20">
					<div className="flex items-center justify-between py-2">
						{/* Left Navigation Links */}
						<Motion.div
							className="flex items-center gap-8"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, staggerChildren: 0.1 }}
						>
							{navLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={`text-sm font-medium border-b-2 transition-all ${isActivePath(link.path)
										? "text-white border-white"
										: "text-blue-100 border-transparent hover:text-white hover:border-blue-200"
										} `}
								>
									{link.label}
								</Link>
							))}
						</Motion.div>

						{/* Right Side - Contact & Language */}
						<div className="flex items-center space-x-6">
							<div className="flex items-center space-x-2 text-sm text-blue-100">
								<FiPhone className="w-4 h-4" />
								<span>+1-202-555-0178</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-blue-100 cursor-pointer">
								<img
									src="https://flagcdn.com/w20/us.png"
									alt="US"
									className="w-5 h-3"
								/>
								<span>English</span>
								<FiChevronDown className="w-4 h-4" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Navbar */}
			<div className="bg-white">
				<div className="px-4 sm:px-6 lg:px-20">
					<div className="flex items-center justify-between gap-4 py-4">
						{/* Logo */}
						<Link to="/" className="flex items-center space-x-2 shrink-0">
							<span className="text-3xl md:text-4xl font-bold text-blue-600 italic">
								ResuMatch.
							</span>
						</Link>

						{/* Desktop Search Bar */}
						<div className="hidden md:block flex-1 max-w-4xl mx-4">
							<form onSubmit={handleSearch} className="flex items-center gap-2">
								<LocationCombobox
									value={selectedLocation}
									onChange={setSelectedLocation}
									className="w-48 xl:w-64 shrink-0"
								/>
								<InputField
									type="text"
									placeholder="Job title, keywords, company"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									icon={FiSearch}
									className="flex-1 min-w-[200px]"
								/>
								<Button type="submit" variant="primary" className="shrink-0">
									find jobs
								</Button>
							</form>
						</div>

						{/* Mobile Actions (Search Icon & Menu) */}
						<div className="flex items-center gap-4 md:hidden">
							<button
								onClick={() => setIsSearchOpen(!isSearchOpen)}
								className="text-gray-600 hover:text-blue-600 p-2"
							>
								<FiSearch size={24} />
							</button>

							{isAuthenticated && (
								<Link to="/dashboard" className="relative">
									{user?.profile_picture_url ? (
										<img
											src={user.profile_picture_url}
											alt="Profile"
											className="w-8 h-8 rounded-full object-cover border border-gray-200"
										/>
									) : (
										<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
											{user?.name?.substring(0, 2).toUpperCase() || "U"}
										</div>
									)}
								</Link>
							)}

							<button
								onClick={() => setIsMobileMenuOpen(true)}
								className="text-gray-600 hover:text-blue-600 p-2"
							>
								<FiMenu size={28} />
							</button>
						</div>

						{/* Desktop User Actions */}
						<div className="hidden md:flex items-center space-x-4">
							{isAuthenticated ? (
								<>
									<Link
										to="/dashboard"
										className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
									>
										Dashboard
									</Link>

									<div className="w-48">
										<CustomDropdown
											placeholder={user?.name || "User"}
											options={[
												{ label: "Profile", value: "/profile" },
												{ label: "Settings", value: "/settings" },
												...(user?.role === "admin" ? [{ label: "Admin Panel", value: "/admin" }] : []),
												{ label: "Logout", value: "logout" }
											]}
											onChange={(value) => {
												if (value === "logout") {
													handleLogout();
												} else {
													navigate(value);
												}
											}}
											selectedOption={{
												label: user?.name || "User",
												value: "",
												icon: (
													<div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
														{user?.profile_picture_url ? (
															<img
																src={user.profile_picture_url}
																alt="Profile"
																className="w-full h-full object-cover"
															/>
														) : (
															<div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
																{user?.name?.substring(0, 2).toUpperCase() || "U"}
															</div>
														)}
													</div>
												)
											}}
										/>
									</div>
								</>
							) : (
								<Link
									to="/login"
									className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
								>
									Sign In
								</Link>
							)}
						</div>
					</div>

					{/* Mobile Search Dropdown */}
					<AnimatePresence>
						{isSearchOpen && (
							<Motion.div
								initial={{ height: 0, opacity: 0, overflow: "hidden" }}
								animate={{
									height: "auto",
									opacity: 1,
									transitionEnd: { overflow: "visible" }
								}}
								exit={{ height: 0, opacity: 0, overflow: "hidden" }}
								className="md:hidden pb-4"
							>
								<form onSubmit={handleSearch} className="flex flex-col gap-3">
									<LocationCombobox
										value={selectedLocation}
										onChange={setSelectedLocation}
										className="w-full"
									/>
									<div className="flex gap-2">
										<InputField
											type="text"
											placeholder="Search jobs..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											icon={FiSearch}
											className="flex-1"
										/>
										<Button type="submit" variant="primary">
											Go
										</Button>
									</div>
								</form>
							</Motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Mobile Side Menu (Right Drawer) */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						{/* Backdrop */}
						<Motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.5 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
							className="fixed inset-0 bg-black z-[60]"
						/>

						{/* Drawer */}
						<Motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed inset-y-0 right-0 w-64 bg-white shadow-2xl z-[70] flex flex-col"
						>
							<div className="p-4 border-b border-gray-100 flex justify-between items-center">
								<span className="font-bold text-lg text-blue-600">Menu</span>
								<button
									onClick={() => setIsMobileMenuOpen(false)}
									className="p-2 text-gray-500 hover:text-red-500 transition-colors"
								>
									<FiX size={24} />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto py-4">
								<div className="flex flex-col space-y-1 px-4">
									{navLinks.map((link) => (
										<Link
											key={link.path}
											to={link.path}
											onClick={() => setIsMobileMenuOpen(false)}
											className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActivePath(link.path)
												? "bg-blue-50 text-blue-600"
												: "text-gray-700 hover:bg-gray-50"
												} `}
										>
											{link.label}
										</Link>
									))}

									{!isAuthenticated && (
										<Link
											to="/login"
											onClick={() => setIsMobileMenuOpen(false)}
											className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
										>
											Sign In
										</Link>
									)}
								</div>

								{isAuthenticated && (
									<div className="mt-6 pt-6 border-t border-gray-100 px-4">
										<p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
											Account
										</p>
										<Link
											to="/profile"
											onClick={() => setIsMobileMenuOpen(false)}
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
										>
											Profile
										</Link>
										<Link
											to="/settings"
											onClick={() => setIsMobileMenuOpen(false)}
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
										>
											Settings
										</Link>
										{user?.role === "admin" && (
											<Link
												to="/admin"
												onClick={() => setIsMobileMenuOpen(false)}
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
											>
												Admin Panel
											</Link>
										)}
										<button
											onClick={handleLogout}
											className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-2"
										>
											Logout
										</button>
									</div>
								)}
							</div>
						</Motion.div>
					</>
				)}
			</AnimatePresence>
		</nav>
	);
}

