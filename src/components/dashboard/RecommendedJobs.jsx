import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMuseAPI } from "../../hooks/useMuseAPI";
import { FiBriefcase, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const RecommendedJobs = () => {
	const { user } = useAuth();
	const { searchJobs } = useMuseAPI();
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user?.skills) {
			fetchRecommendedJobs();
		}
	}, [user]);

	const fetchRecommendedJobs = async () => {
		setLoading(true);
		try {
			// Extract top skills to form a query
			let skillList = [];

			// Handle different structure of skills
			if (user.skills.primary && Array.isArray(user.skills.primary)) {
				skillList = user.skills.primary;
			} else if (typeof user.skills === "string") {
				try {
					const parsed = JSON.parse(user.skills);
					if (parsed.primary) skillList = parsed.primary;
				} catch (e) {
					/* ignore */
					console.log(e);
				}
			}

			if (skillList.length === 0) {
				setLoading(false);
				return;
			}

			// Take top 3 skills for a broad search
			const query = skillList.slice(0, 3).join(" ");
			const response = await searchJobs({ query: query, page: 1 });

			if (response?.results) {
				setJobs(response.results.slice(0, 3)); // Show top 3
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (!user?.skills || loading || jobs.length === 0) return null;

	return (
		<div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
					<FiBriefcase className="text-indigo-600" />
					Recommended for You
				</h3>
				<Link
					to="/jobs"
					className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
				>
					View All <FiArrowRight />
				</Link>
			</div>

			<p className="text-sm text-gray-600 mb-4">
				Based on your skills:
				<span className="font-medium text-gray-800 ml-1">
					{Array.isArray(user.skills.primary)
						? user.skills.primary.slice(0, 3).join(", ")
						: ""}
				</span>
			</p>

			<div className="space-y-3">
				{jobs.map((job) => (
					<Link
						key={job.id}
						to={`/jobs/${job.id}`}
						className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
					>
						<div className="flex items-start justify-between">
							<div>
								<h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
									{job.name}
								</h4>
								<p className="text-xs text-gray-500 mt-1">
									{job.company?.name}
								</p>
							</div>
							<span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
								{job.locations?.[0]?.name?.split(",")[0]}
							</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default RecommendedJobs;
