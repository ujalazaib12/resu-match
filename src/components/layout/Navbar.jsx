import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { FiPhone, FiChevronDown, FiSearch } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import InputField from "../common/InputField";

import LocationCombobox from "../common/LocationCombobox";

export default function Navbar() {
	const { isAuthenticated, user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLocation, setSelectedLocation] = useState("");

	const handleLogout = () => {
		logout();
		navigate("/");
		setIsDropdownOpen(false);
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
			navigate(`/jobs?${params.toString()}`);
		} else {
			navigate("/jobs");
		}
	};

	// Helper function to check if link is active
	const isActivePath = (path) => {
		if (path === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(path);
	};

	return (
		<nav className="bg-white shadow-sm sticky top-0 z-50">
			{/* Top Navigation Bar - Links */}
			<div className="bg-blue-600 border-b border-blue-500">
				<div className="px-4 sm:px-6 lg:px-20">
					<div className="flex items-center justify-between py-2">
						{/* Left Navigation Links */}
						<Motion.div
							className="flex items-center gap-8"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, staggerChildren: 0.1 }}
						>
							<Link
								to="/"
								className={`text-sm font-medium border-b-2 transition-all ${
									isActivePath("/")
										? "text-white border-white"
										: "text-blue-100 border-transparent hover:text-white hover:border-white"
								}`}
							>
								Home
							</Link>
							<Link
								to="/jobs"
								className={`text-sm font-medium border-b-2 transition-all ${
									isActivePath("/jobs")
										? "text-white border-white"
										: "text-blue-100 border-transparent hover:text-white hover:border-white"
								}`}
							>
								Find Job
							</Link>
							<Link
								to="/dashboard"
								className={`text-sm font-medium border-b-2 transition-all ${
									isActivePath("/dashboard") ||
									isActivePath("/profile") ||
									isActivePath("/resume")
										? "text-white border-white"
										: "text-blue-100 border-transparent hover:text-white hover:border-white"
								}`}
							>
								Dashboard
							</Link>
							{isAuthenticated && (
								<>
									<Link
										to="/applications"
										className={`text-sm font-medium border-b-2 transition-all ${
											isActivePath("/applications")
												? "text-white border-white"
												: "text-blue-100 border-transparent hover:text-white hover:border-white"
										}`}
									>
										Applications
									</Link>
									<Link
										to="/jobs/saved"
										className={`text-sm font-medium border-b-2 transition-all ${
											isActivePath("/jobs/saved")
												? "text-white border-white"
												: "text-blue-100 border-transparent hover:text-white hover:border-white"
										}`}
									>
										Saved Jobs
									</Link>
								</>
							)}
						</Motion.div>

						{/* Right Side - Contact & Language */}
						<div className="flex items-center space-x-6">
							<div className="flex items-center space-x-2 text-sm text-blue-100">
								<FiPhone className="w-4 h-4" />
								<span>+1-202-555-0178</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-blue-100">
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

			{/* Bottom Bar - Logo, Search, Actions */}
			<div className="bg-white">
				<div className="px-4 sm:px-6 lg:px-20">
					<div className="flex items-center justify-between gap-6 py-4">
						{/* Logo */}
						<Link to="/" className="flex items-center space-x-2">
							<span className="text-4xl font-bold text-blue-600 italic">
								ResuMatch.
							</span>
						</Link>

						{/* Search Bar */}
						<div className="flex-1 max-w-4xl">
							<form onSubmit={handleSearch} className="flex items-center gap-2">
								<LocationCombobox
									value={selectedLocation}
									onChange={setSelectedLocation}
									className="w-48 sm:w-64 shrink-0"
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

						{/* Right Actions */}
						<div className="flex items-center space-x-4">
							{isAuthenticated ? (
								<>
									<Link
										to="/dashboard"
										className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
									>
										Dashboard
									</Link>

									{/* User Dropdown */}
									<div className="relative">
										<button
											onClick={() => setIsDropdownOpen(!isDropdownOpen)}
											className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
										>
											{user?.profile_picture_url ? (
												<img
													src={`/server/${user.profile_picture_url.replace(
														/\\/g,
														"/"
													)}`}
													alt="Profile"
													className="w-8 h-8 rounded-full object-cover border border-gray-200"
												/>
											) : (
												<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
													{user?.firstName && user?.lastName
														? `${user.firstName.charAt(
																0
														  )}${user.lastName.charAt(0)}`
														: user?.name
														? user.name.substring(0, 2).toUpperCase()
														: "U"}
												</div>
											)}
											<FiChevronDown
												className={`w-4 h-4 text-gray-500 transition-transform ${
													isDropdownOpen ? "rotate-180" : ""
												}`}
											/>
										</button>

										<AnimatePresence>
											{isDropdownOpen && (
												<Motion.div
													initial={{ opacity: 0, y: 10, scale: 0.95 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													exit={{ opacity: 0, y: 10, scale: 0.95 }}
													transition={{ duration: 0.2 }}
													className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 origin-top-right z-50"
												>
													<Link
														to="/profile"
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
														onClick={() => setIsDropdownOpen(false)}
													>
														Profile
													</Link>
													<Link
														to="/resume"
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
														onClick={() => setIsDropdownOpen(false)}
													>
														Resume
													</Link>
													<Link
														to="/settings"
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
														onClick={() => setIsDropdownOpen(false)}
													>
														Settings
													</Link>
													{user?.role === "admin" && (
														<Link
															to="/admin"
															className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
															onClick={() => setIsDropdownOpen(false)}
														>
															Admin Panel
														</Link>
													)}
													<hr className="my-2 border-gray-200" />
													<button
														onClick={handleLogout}
														className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
													>
														Logout
													</button>
												</Motion.div>
											)}
										</AnimatePresence>
									</div>

									{/* <Link
										to="/jobs/post"
										className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
									>
										Post A Jobs
									</Link> */}
								</>
							) : (
								<>
									<Link
										to="/login"
										className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
									>
										Sign In
									</Link>
									{/* <Link
										to="/register"
										className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
									>
										Post A Jobs
									</Link> */}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
