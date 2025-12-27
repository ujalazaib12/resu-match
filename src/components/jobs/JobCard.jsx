import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { FiMapPin, FiBriefcase, FiExternalLink } from "react-icons/fi";
import Button from "../common/Button";
import PropTypes from "prop-types";

const JobCard = ({ job, index }) => {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		once: true,
		margin: "-100px",
	});

	return (
		<motion.div
			ref={ref}
			className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-600 transition-all group flex flex-col h-full"
			initial={{ opacity: 0, y: 50 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{
				duration: 0.5,
				delay: (index % 4) * 0.1, // Stagger by column (4 columns max)
				ease: "easeOut",
			}}
			whileHover={{ scale: 1.02, y: -5 }}
		>
			<div className="flex items-start gap-4">
				<div className="w-14 h-14 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center shrink-0 border border-blue-200">
					{job.company?.logo ? (
						<img
							src={job.company.logo}
							alt={job.company.name}
							className="w-10 h-10 object-contain"
						/>
					) : (
						<span className="text-xl font-bold text-blue-600">
							{job.company?.name?.charAt(0) || "C"}
						</span>
					)}
				</div>
				{job.publication_date && (
					<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
						{new Date(job.publication_date).toLocaleDateString(undefined, {
							month: "short",
							day: "numeric",
						})}
					</span>
				)}
			</div>

			<div className="mb-3">
				<Link
					to={`/jobs/${job.id}`}
					className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1 block"
					title={job.name}
				>
					{job.name}
				</Link>
				<p className="text-xs font-medium text-gray-600">{job.company?.name}</p>
			</div>

			<div className="flex flex-wrap gap-2 mb-4">
				<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
					<FiMapPin size={12} />
					{job.locations?.[0]?.name || "Remote"}
				</span>
				{job.levels?.[0] && (
					<span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
						<FiBriefcase size={12} />
						{job.levels[0].name}
					</span>
				)}
			</div>

			<p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
				{job.contents?.replace(/<[^>]*>/g, "").substring(0, 150)}...
			</p>

			<div className="mt-auto pt-4 border-t border-gray-100">
				<Button
					to={`/jobs/${job.id}`}
					variant="outline"
					rightIcon={FiExternalLink}
					className="w-full"
				>
					View Details
				</Button>
			</div>
		</motion.div>
	);
};

JobCard.propTypes = {
	job: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
};

export default JobCard;
