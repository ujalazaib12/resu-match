import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRapidAPI } from "../../hooks/useRapidAPI";
import { formatJobDescription } from "../../utils/textFormatter";
import api from "../../services/api";
import {
	FiArrowLeft,
	FiMapPin,
	FiBriefcase,
	FiCalendar,
	FiBookmark,
	FiExternalLink,
	FiClock,
	FiDollarSign,
	FiUsers,
	FiCheck,
	FiSend,
} from "react-icons/fi";
import Button from "../../components/common/Button";

const JobDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { getJobById, searchJobs } = useRapidAPI();

	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isSaved, setIsSaved] = useState(false);
	const [hasApplied, setHasApplied] = useState(false);
	const [applying, setApplying] = useState(false);
	const [similarJobs, setSimilarJobs] = useState([]);

	useEffect(() => {
		fetchJobDetails();
		checkJobStatus();
	}, [id]);

	useEffect(() => {
		if (job?.name) {
			fetchSimilarJobs(job.name);
		}
	}, [job?.name]);

	const fetchJobDetails = async () => {
		setLoading(true);
		try {
			const jobData = await getJobById(id);
			setJob(jobData);
		} catch (error) {
			console.error("Error fetching job details:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchSimilarJobs = async (jobName) => {
		try {
			const result = await searchJobs({ query: jobName, page: 1 });
			// Filter out current job and limit to 3
			const filtered = result.results.filter((j) => j.id !== id).slice(0, 3);
			setSimilarJobs(filtered);
		} catch (error) {
			console.error("Error fetching similar jobs:", error);
		}
	};

	const checkJobStatus = async () => {
		try {
			const [savedRes, appliedRes] = await Promise.all([
				api.get(`/jobs/${id}/saved`),
				api.get(`/applications?jobId=${id}`),
			]);

			setIsSaved(savedRes.data.isSaved);
			setHasApplied(appliedRes.data.length > 0);
		} catch (error) {
			console.error("Error checking job status:", error);
		}
	};

	const handleSaveJob = async () => {
		try {
			if (isSaved) {
				await api.delete(`/jobs/${id}/save`);
				setIsSaved(false);
			} else {
				await api.post(`/jobs/${id}/save`, job);
				setIsSaved(true);
			}
		} catch (error) {
			console.error("Error saving job:", error);
		}
	};

	const handleApply = async () => {
		setApplying(true);
		try {
			await api.post("/applications", {
				jobId: id,
				jobTitle: job.name,
				company: job.company?.name,
				location: job.locations?.[0]?.name || "Remote",
				status: "Applied",
			});

			setHasApplied(true);
			alert("Application submitted successfully!");
		} catch (error) {
			console.error("Error applying to job:", error);
			alert("Failed to submit application. Please try again.");
		} finally {
			setApplying(false);
		}
	};

	const handleExternalApply = () => {
		if (job?.refs?.landing_page) {
			window.open(job.refs.landing_page, "_blank");
			handleApply();
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg">Loading job details...</p>
				</div>
			</div>
		);
	}

	if (!job) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center py-16">
					<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<FiBriefcase className="text-gray-400" size={40} />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Job Not Found
					</h2>
					<p className="text-gray-500 mb-6">
						The job you&apos;re looking for doesn&apos;t exist or has been
						removed.
					</p>
					<Button
						to="/jobs"
						className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
					>
						<FiArrowLeft size={18} />
						Back to Job Search
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="px-4 sm:px-6 lg:px-20 py-6 flex flex-col gap-4">
				{/* Header with Back Button */}
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-blue-600 hover:text-blue-900 font-medium transition-colors max-w-fit cursor-pointer"
				>
					<FiArrowLeft />
					Back
				</button>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Job Header Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
							{/* Gradient Header */}
							<div className="bg-blue-600 px-8 py-6">
								<div className="flex items-start gap-6">
									{/* Company Logo */}
									<div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
										{job.company?.logo ? (
											<img
												src={job.company.logo}
												alt={job.company.name}
												className="w-16 h-16 object-contain"
											/>
										) : (
											<span className="text-3xl font-bold text-blue-600">
												{job.company?.name?.charAt(0) || "C"}
											</span>
										)}
									</div>

									{/* Job Title & Company */}
									<div className="flex-1 min-w-0">
										<h1 className="text-2xl font-bold text-white mb-2">
											{job.name}
										</h1>
										<p className="text-blue-100 font-medium">
											{job.company?.name}
										</p>
									</div>
								</div>
							</div>

							{/* Job Meta Info */}
							<div className="px-8 py-6">
								<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
											<FiMapPin className="text-blue-600" size={20} />
										</div>
										<div>
											<p className="text-xs text-gray-500 font-medium">
												Location
											</p>
											<p className="text-sm font-semibold text-gray-900">
												{job.locations?.map((loc) => loc.name).join(", ") ||
													"Remote"}
											</p>
										</div>
									</div>

									{job.levels?.[0] && (
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
												<FiBriefcase className="text-green-600" size={20} />
											</div>
											<div>
												<p className="text-xs text-gray-500 font-medium">
													Experience Level
												</p>
												<p className="text-sm font-semibold text-gray-900">
													{job.levels[0].name}
												</p>
											</div>
										</div>
									)}

									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
											<FiCalendar className="text-purple-600" size={20} />
										</div>
										<div>
											<p className="text-xs text-gray-500 font-medium">
												Posted Date
											</p>
											<p className="text-sm font-semibold text-gray-900">
												{new Date(job.publication_date).toLocaleDateString(
													"en-US",
													{
														month: "short",
														day: "numeric",
														year: "numeric",
													}
												)}
											</p>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-wrap gap-3">
									{hasApplied ? (
										<Button
											variant="secondary"
											icon={FiCheck}
											disabled
											className="flex-1 min-w-[200px] bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
										>
											Applied Successfully
										</Button>
									) : (
										<Button
											variant="primary"
											icon={FiSend}
											onClick={handleExternalApply}
											isLoading={applying}
											className="flex-1 min-w-[200px]"
										>
											Apply Now
										</Button>
									)}

									<Button
										variant={isSaved ? "secondary" : "secondary"}
										onClick={handleSaveJob}
										className={
											isSaved
												? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
												: ""
										}
									>
										<FiBookmark
											size={20}
											fill={isSaved ? "currentColor" : "none"}
											className="mr-2"
										/>
										{isSaved ? "Saved" : "Save Job"}
									</Button>
								</div>
							</div>
						</div>

						{/* Categories */}
						{job.categories && job.categories.length > 0 && (
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
									<div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
										<span className="text-orange-600">🏷️</span>
									</div>
									Categories
								</h2>
								<div className="flex flex-wrap gap-2">
									{job.categories.map((category) => (
										<span
											key={category.name}
											className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
										>
											{category.name}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Job Description */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
									<FiBriefcase className="text-blue-600" size={20} />
								</div>
								Job Description
							</h2>
							<div
								className="prose prose-lg prose-blue max-w-none
                                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-4 [&_ul]:my-4
                                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-4 [&_ol]:my-4
                                    [&_li]:my-2 [&_li]:text-gray-700 [&_li]:leading-relaxed
                                    [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
                                    [&_strong]:text-gray-900 [&_strong]:font-semibold
                                    [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-700
                                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-6 [&_h1]:mb-4
                                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-5 [&_h2]:mb-3
                                    [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-2"
								dangerouslySetInnerHTML={{
									__html: formatJobDescription(job.contents),
								}}
							/>
						</div>

						{/* Company Info */}
						{/* {job.company && (
							<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-8">
								<div className="flex items-start gap-4 mb-4">
									<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
										<FiUsers className="text-blue-600" size={24} />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-gray-900">
											About {job.company.name}
										</h2>
										<p className="text-gray-500 text-sm mt-1">
											Learn more about the company
										</p>
									</div>
								</div>
								{job.company.short_description && (
									<p className="text-gray-700 leading-relaxed">
										{job.company.short_description}
									</p>
								)}
							</div>
						)} */}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-6 sticky top-32 self-start">
						{/* Quick Apply Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="text-center mb-6">
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<FiSend className="text-blue-600" size={28} />
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-2">
									Quick Apply
								</h3>
								<p className="text-sm text-gray-600">
									Submit your application with your uploaded resume
								</p>
							</div>

							{hasApplied ? (
								<Button
									variant="secondary"
									disabled
									className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
								>
									Already Applied
								</Button>
							) : (
								<Button
									variant="primary"
									onClick={handleApply}
									isLoading={applying}
									className="w-full"
								>
									Apply with Resume
								</Button>
							)}

							{/* External Link */}
							{job.refs?.landing_page && (
								<div className="mt-4 pt-4 border-t border-gray-200">
									<Button
										href={job.refs.landing_page}
										variant="secondary"
										rightIcon={FiExternalLink}
										className="w-full"
										target="_blank"
										rel="noopener noreferrer"
									>
										View on Company Site
									</Button>
								</div>
							)}
						</div>

						{/* Similar Jobs */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
								<FiBriefcase className="text-gray-400" size={20} />
								Similar Jobs
							</h3>
							{similarJobs.length > 0 ? (
								<div className="space-y-3">
									{similarJobs.map((sJob) => (
										<Link
											key={sJob.id}
											to={`/jobs/${sJob.id}`}
											className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
										>
											<p className="font-medium text-gray-900 text-sm line-clamp-1">
												{sJob.name}
											</p>
											<p className="text-xs text-gray-500">
												{sJob.company?.name}
											</p>
										</Link>
									))}
								</div>
							) : (
								<div className="text-center py-6">
									<p className="text-sm text-gray-500">No similar jobs found</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JobDetails;
