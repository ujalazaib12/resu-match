import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useRapidAPI } from "../../hooks/useRapidAPI";
import { useDebounce } from "../../hooks/useDebounce";
import { FiSearch, FiBriefcase, FiFilter, FiX, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import LocationCombobox from "../../components/common/LocationCombobox";
import CustomDropdown from "../../components/common/CustomDropdown";
import Button from "../../components/common/Button";
import JobCard from "../../components/jobs/JobCard";

const JobSearch = () => {
	const [searchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("search") || ""
	);
	const [filters, setFilters] = useState({
		location: searchParams.get("location") || "",
		jobType: "",
		experienceLevel: "",
		salaryMin: "",
		salaryMax: "",
	});
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const debouncedSearch = useDebounce(searchQuery, 500);
	const { searchJobs } = useRapidAPI();

	// Sync state with URL parameters when they change
	useEffect(() => {
		const search = searchParams.get("search") || "";
		const location = searchParams.get("location") || "";

		setSearchQuery(search);
		setFilters((prev) => ({
			...prev,
			location: location,
		}));
		setPage(1); // Reset to first page when URL params change
	}, [searchParams]);

	useEffect(() => {
		fetchJobs();
	}, [debouncedSearch, filters, page]);

	const fetchJobs = async () => {
		setLoading(true);
		try {
			const params = {
				query: debouncedSearch,
				location: filters.location,
				level: filters.experienceLevel,
				page: page,
				...filters,
			};

			const response = await searchJobs(params);

			if (page === 1) {
				console.log("JobSearch: fetched initial jobs", response.results);
				setJobs(response.results);
			} else {
				console.log("JobSearch: fetched more jobs", response.results);
				setJobs([...jobs, ...response.results]);
			}

			setHasMore(response.page < response.page_count);
		} catch (error) {
			console.error("Error fetching jobs:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (filterName, value) => {
		setFilters({
			...filters,
			[filterName]: value,
		});
		setPage(1);
	};

	const handleClearFilters = () => {
		setFilters({
			location: "",
			jobType: "",
			experienceLevel: "",
			salaryMin: "",
			salaryMax: "",
		});
		setSearchQuery("");
		setPage(1);
	};

	const handleLoadMore = () => {
		setPage(page + 1);
	};

	const hasActiveFilters = Object.values(filters).some((value) => value !== "");

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Search Section */}
			<div className="bg-blue-600 p-12 flex flex-col gap-6 items-center">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<motion.h1
						className="text-4xl font-bold text-white"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
					>
						Find Your Dream Job
					</motion.h1>
					<motion.p
						className="text-blue-100 text-lg"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
					>
						Discover thousands of opportunities from top companies
					</motion.p>
				</motion.div>

				{/* Search Bar */}
				{/* <div className="max-w-3xl mx-auto">
						<div className="flex gap-2">
							<div className="flex-1 relative">
								<FiSearch
									className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={20}
								/>
								<input
									type="text"
									placeholder="Search jobs by title, skills, or company..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900 placeholder-white"
								/>
							</div>
							<button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
								<FiSearch size={20} />
								Search
							</button>
						</div>
					</div> */}

				{/* Horizontal Filters Section */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
					<div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center">
						{/* Header & Clear Mobile */}
						<div className="flex items-center justify-between w-full lg:w-auto mr-4 lg:border-r lg:border-gray-200 lg:pr-6">
							<h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
								<FiFilter className="text-blue-600" />
								Filters
							</h2>
							{hasActiveFilters && (
								<button
									onClick={handleClearFilters}
									className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 lg:hidden"
								>
									<FiX size={16} />
									Clear
								</button>
							)}
						</div>

						{/* Filters Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-1 gap-4 w-full">
							{/* Location Filter */}
							<div className="min-w-[200px] flex-1">
								<div className="h-[38px]">
									<LocationCombobox
										value={filters.location}
										onChange={(value) => handleFilterChange("location", value)}
										placeholder="City or Remote"
									/>
								</div>
							</div>

							{/* Job Type Filter */}
							<div className="min-w-[160px]">
								<CustomDropdown
									value={filters.jobType}
									onChange={(value) => handleFilterChange("jobType", value)}
									options={[
										{ label: "All Job Types", value: "" },
										{ label: "Full-time", value: "Full-time" },
										{ label: "Part-time", value: "Part-time" },
										{ label: "Contract", value: "Contract" },
										{ label: "Internship", value: "Internship" },
									]}
									placeholder="All Job Types"
									icon={FiBriefcase}
								/>
							</div>

							{/* Experience Level Filter */}
							<div className="min-w-[160px]">
								<CustomDropdown
									value={filters.experienceLevel}
									onChange={(value) =>
										handleFilterChange("experienceLevel", value)
									}
									options={[
										{ label: "All Experience Levels", value: "" },
										{ label: "Entry Level", value: "Entry Level" },
										{ label: "Mid Level", value: "Mid Level" },
										{ label: "Senior Level", value: "Senior Level" },
										{ label: "Executive", value: "Executive" },
									]}
									placeholder="All Experience Levels"
								/>
							</div>

							{/* Salary Range Filter */}
							<div className="flex gap-2 items-center flex-1 min-w-[200px]">
								<div className="relative flex-1">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
										$
									</span>
									<input
										type="number"
										placeholder="Min Salary"
										value={filters.salaryMin}
										onChange={(e) =>
											handleFilterChange("salaryMin", e.target.value)
										}
										className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
									/>
								</div>
								<span className="text-gray-400 text-sm">-</span>
								<div className="relative flex-1">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
										$
									</span>
									<input
										type="number"
										placeholder="Max Salary"
										value={filters.salaryMax}
										onChange={(e) =>
											handleFilterChange("salaryMax", e.target.value)
										}
										className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
									/>
								</div>
							</div>
						</div>

						{/* Desktop Clear */}
						{hasActiveFilters && (
							<button
								onClick={handleClearFilters}
								className="hidden lg:flex px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors items-center gap-1 whitespace-nowrap"
							>
								<FiX size={16} />
								Clear Filters
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="px-4 sm:px-6 lg:px-20 py-6">
				{/* Jobs List */}
				<div>
					{/* Results Header */}
					<div className="flex items-center justify-between mb-6">
						<div className="text-gray-700 font-medium text-sm">
							{jobs?.length > 0 ? (
								<div className="flex items-center gap-1">
									<span className="text-blue-600 font-bold text-lg">
										{jobs.length}
									</span>{" "}
									jobs found
								</div>
							) : (
								"No jobs found"
							)}
						</div>
					</div>

					{/* Loading State */}
					{loading && page === 1 ? (
						<motion.div
							className="flex items-center justify-center py-20"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<div className="text-center">
								<div className="relative w-24 h-24 mx-auto mb-6">
									{/* Outer rotating ring */}
									<motion.div
										className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600"
										animate={{ rotate: 360 }}
										transition={{
											duration: 1.5,
											repeat: Infinity,
											ease: "linear",
										}}
									/>
									{/* Inner pulsing icon */}
									<motion.div
										className="absolute inset-0 flex items-center justify-center"
										animate={{
											scale: [1, 1.2, 1],
											rotate: [0, 5, -5, 0],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									>
										<FiBriefcase className="text-blue-600" size={40} />
									</motion.div>
									{/* Floating sparkles */}
									<motion.div
										className="absolute -top-2 -right-2"
										animate={{
											y: [-5, 5, -5],
											opacity: [0.5, 1, 0.5],
										}}
										transition={{
											duration: 1.5,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									>
										<FiZap className="text-yellow-500" size={20} />
									</motion.div>
								</div>
								<motion.p
									className="text-gray-600 font-medium"
									animate={{ opacity: [0.5, 1, 0.5] }}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								>
									Finding the best opportunities for you...
								</motion.p>
							</div>
						</motion.div>
					) : jobs.length > 0 ? (
						<>
							{/* Jobs Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
								{jobs.map((job, index) => (
									<JobCard key={job.id} job={job} index={index} />
								))}
							</div>

							{/* Load More */}
							{hasMore && (
								<div className="text-center">
									<Button
										onClick={handleLoadMore}
										variant="primary"
										isLoading={loading}
										className="px-8"
									>
										Load More Jobs
									</Button>
								</div>
							)}
						</>
					) : (
						/* Empty State */
						<div className="text-center py-20 bg-white rounded-xl border border-gray-200">
							<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<FiSearch className="text-gray-400" size={40} />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								No Jobs Found
							</h2>
							<p className="text-gray-500 mb-6 max-w-md mx-auto">
								We couldn&apos;t find any jobs matching your criteria. Try
								adjusting your search or filters.
							</p>
							{hasActiveFilters && (
								<button
									onClick={handleClearFilters}
									className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
								>
									<FiX size={18} />
									Clear All Filters
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default JobSearch;
