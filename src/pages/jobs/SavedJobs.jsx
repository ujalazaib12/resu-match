import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
	FiBriefcase,
	FiMapPin,
	FiClock,
	FiBookmark,
	FiExternalLink,
	FiDollarSign,
} from "react-icons/fi";

const SavedJobs = () => {
	const [savedJobs, setSavedJobs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchSavedJobs();
	}, []);

	const fetchSavedJobs = async () => {
		setLoading(true);
		try {
			const response = await api.get("/jobs/saved");
			setSavedJobs(response.data);
		} catch (error) {
			console.error("Error fetching saved jobs:", error);
			// API not ready - jobs will be empty array
		} finally {
			setLoading(false);
		}
	};

	const handleUnsave = async (jobId) => {
		try {
			await api.delete(`/jobs/${jobId}/save`);
			setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
		} catch (error) {
			console.error("Error unsaving job:", error);
		}
	};

	if (loading) {
		return (
			<DashboardLayout>
				<div className="min-h-screen bg-white flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading saved jobs...</p>
					</div>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-white py-8">
				<div className="px-4 sm:px-6 lg:px-20">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Saved Jobs
						</h1>
						<p className="text-gray-500">
							Jobs you&apos;ve bookmarked for later
						</p>
					</div>

					{/* Stats Bar */}
					{savedJobs.length > 0 && (
						<div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<FiBookmark className="text-blue-600" size={20} />
								<span className="font-medium text-gray-900">
									{savedJobs.length} {savedJobs.length === 1 ? "Job" : "Jobs"}{" "}
									Saved
								</span>
							</div>
							<span className="text-sm text-gray-600">
								Keep track of opportunities you&apos;re interested in
							</span>
						</div>
					)}

					{/* Jobs Grid */}
					{savedJobs.length > 0 ? (
						<div className="grid md:grid-cols-2 gap-6">
							{savedJobs.map((job) => (
								<div
									key={job.id}
									className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
								>
									{/* Job Header */}
									<div className="flex items-start gap-4 mb-4">
										{/* Company Logo */}
										<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 border border-blue-200">
											{job.company?.logo ? (
												<img
													src={job.company.logo}
													alt={job.company?.name || job.company}
													className="w-8 h-8 object-contain"
												/>
											) : (
												<span className="text-lg font-bold text-blue-600">
													{(job.company?.name || job.company || "C").charAt(0)}
												</span>
											)}
										</div>

										{/* Job Title & Company */}
										{/* Job Title & Company */}
										<div className="flex-1 min-w-0">
											<Link
												to={`/jobs/${job.id}`}
												className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors inline-flex items-center gap-2 group/link"
											>
												<span className="truncate">
													{job.name || job.title}
												</span>
												<FiExternalLink
													className="opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0"
													size={16}
												/>
											</Link>
											<p className="text-gray-600 font-medium text-sm mt-0.5 truncate">
												{job.company?.name || job.company}
											</p>
										</div>

										{/* Bookmark Icon */}
										<button
											onClick={() => handleUnsave(job.id)}
											className="text-blue-600 hover:text-red-500 transition-colors p-1"
											title="Remove from saved"
										>
											<FiBookmark size={20} fill="currentColor" />
										</button>
									</div>

									{/* Job Details */}
									<div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600">
										<span className="flex items-center gap-1.5">
											<FiMapPin size={14} />
											{job.locations?.[0]?.name || job.location || "Remote"}
										</span>
										{job.type && (
											<span className="flex items-center gap-1.5">
												<FiBriefcase size={14} />
												{job.type}
											</span>
										)}
										{job.salary && (
											<span className="flex items-center gap-1.5">
												<FiDollarSign size={14} />
												{job.salary}
											</span>
										)}
									</div>

									{/* Job Description */}
									<p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
										{job.description ||
											(job.contents
												? job.contents
														.replace(/<[^>]*>/g, "")
														.substring(0, 150) + "..."
												: "No description available")}
									</p>

									{/* Tags */}
									{job.tags && job.tags.length > 0 && (
										<div className="flex flex-wrap gap-2 mb-4">
											{job.tags.slice(0, 4).map((tag, index) => (
												<span
													key={index}
													className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
												>
													{tag}
												</span>
											))}
											{job.tags.length > 4 && (
												<span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
													+{job.tags.length - 4} more
												</span>
											)}
										</div>
									)}

									{/* Footer */}
									<div className="flex items-center justify-between pt-4 border-t border-gray-100">
										<span className="flex items-center gap-1.5 text-xs text-gray-500">
											<FiClock size={12} />
											Saved{" "}
											{job.savedAt
												? new Date(job.savedAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
												  })
												: "recently"}
										</span>

										<Link
											to={`/jobs/${job.id}`}
											className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
										>
											View Details
											<FiExternalLink size={14} />
										</Link>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-16">
							<div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<FiBookmark className="text-blue-600" size={32} />
							</div>
							<h2 className="text-xl font-bold text-gray-900 mb-2">
								No Saved Jobs Yet
							</h2>
							<p className="text-gray-500 mb-6 max-w-md mx-auto">
								Start saving jobs that interest you. They&apos;ll appear here so
								you can easily find and apply to them later.
							</p>
							<Link
								to="/jobs"
								className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
							>
								<FiBriefcase size={18} />
								Browse Jobs
							</Link>
						</div>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
};

export default SavedJobs;
