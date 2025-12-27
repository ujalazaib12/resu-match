import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
	FiBriefcase,
	FiMapPin,
	FiCalendar,
	FiTrash2,
	FiExternalLink,
} from "react-icons/fi";

const Applications = () => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		fetchApplications();
	}, [filter]);

	const fetchApplications = async () => {
		setLoading(true);
		try {
			const params = filter !== "all" ? { status: filter } : {};
			const response = await api.get("/applications", { params });
			setApplications(response.data);
		} catch (error) {
			console.error("Error fetching applications:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusUpdate = async (applicationId, newStatus) => {
		try {
			await api.put(`/applications/${applicationId}`, { status: newStatus });
			fetchApplications();
		} catch (error) {
			console.error("Error updating application status:", error);
		}
	};

	const handleDelete = async (applicationId) => {
		if (!confirm("Are you sure you want to delete this application?")) return;

		try {
			await api.delete(`/applications/${applicationId}`);
			fetchApplications();
		} catch (error) {
			console.error("Error deleting application:", error);
		}
	};

	const getStatusBadge = (status) => {
		const normalizedStatus = status?.toLowerCase() || "applied";

		const statusConfig = {
			applied: {
				bg: "bg-blue-100",
				text: "text-blue-700",
				label: "Applied",
			},
			interviewing: {
				bg: "bg-yellow-100",
				text: "text-yellow-700",
				label: "Interviewing",
			},
			accepted: {
				bg: "bg-green-100",
				text: "text-green-700",
				label: "Accepted",
			},
			rejected: {
				bg: "bg-red-100",
				text: "text-red-700",
				label: "Rejected",
			},
		};

		const config = statusConfig[normalizedStatus] || statusConfig.applied;

		return (
			<span
				className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
			>
				{config.label}
			</span>
		);
	};

	const getFilterCount = (filterType) => {
		if (filterType === "all") return applications.length;
		return applications.filter(
			(app) => app.status?.toLowerCase() === filterType
		).length;
	};

	if (loading) {
		return (
			<DashboardLayout>
				<div className="min-h-screen bg-white flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading applications...</p>
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
							My Applications
						</h1>
						<p className="text-gray-500">
							Track and manage your job applications
						</p>
					</div>

					{/* Filter Tabs */}
					<div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-4">
						{[
							{ key: "all", label: "All Applications" },
							{ key: "applied", label: "Applied" },
							{ key: "interviewing", label: "Interviewing" },
							{ key: "accepted", label: "Accepted" },
							{ key: "rejected", label: "Rejected" },
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setFilter(tab.key)}
								className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
									filter === tab.key
										? "bg-blue-600 text-white shadow-sm"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								{tab.label}
								{applications.length > 0 && (
									<span
										className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
											filter === tab.key ? "bg-blue-700" : "bg-gray-200"
										}`}
									>
										{getFilterCount(tab.key)}
									</span>
								)}
							</button>
						))}
					</div>

					{/* Applications List */}
					{applications.length > 0 ? (
						<div className="space-y-4">
							{applications.map((application) => (
								<div
									key={application.id}
									className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-start gap-4 flex-1">
											{/* Company Logo/Initial */}
											<div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
												<span className="text-xl font-bold text-blue-600">
													{application.company?.charAt(0) || "C"}
												</span>
											</div>

											{/* Job Info */}
											<div className="flex-1">
												<Link
													to={`/jobs/${application.jobId}`}
													className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors inline-flex items-center gap-2 group"
												>
													{application.jobTitle}
													<FiExternalLink
														className="opacity-0 group-hover:opacity-100 transition-opacity"
														size={16}
													/>
												</Link>
												<p className="text-gray-600 font-medium mt-1">
													{application.company}
												</p>

												<div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
													<span className="flex items-center gap-1.5">
														<FiMapPin size={14} />
														{application.location || "Remote"}
													</span>
													<span className="flex items-center gap-1.5">
														<FiCalendar size={14} />
														Applied on{" "}
														{new Date(application.appliedAt).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															}
														)}
													</span>
												</div>
											</div>
										</div>

										{/* Status Badge */}
										<div className="flex items-center gap-3">
											{getStatusBadge(application.status)}
										</div>
									</div>

									{/* Notes */}
									{application.notes && (
										<div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
											<p className="text-sm text-gray-700">
												<span className="font-medium">Notes: </span>
												{application.notes}
											</p>
										</div>
									)}

									{/* Actions */}
									<div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
										<select
											value={application.status}
											onChange={(e) =>
												handleStatusUpdate(application.id, e.target.value)
											}
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
										>
											<option value="Applied">Applied</option>
											<option value="Interviewing">Interviewing</option>
											<option value="Accepted">Accepted</option>
											<option value="Rejected">Rejected</option>
										</select>

										<Link
											to={`/jobs/${application.jobId}`}
											className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
										>
											<FiBriefcase size={16} />
											View Job
										</Link>

										<button
											onClick={() => handleDelete(application.id)}
											className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
										>
											<FiTrash2 size={16} />
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-16">
							<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-4xl">📭</span>
							</div>
							<h2 className="text-xl font-bold text-gray-900 mb-2">
								No Applications Yet
							</h2>
							<p className="text-gray-500 mb-6">
								Start applying to jobs to track your applications here
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

export default Applications;
