import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import LocationCombobox from "../components/common/LocationCombobox";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import {
	FiSearch,
	FiBriefcase,
	FiUsers,
	FiTrendingUp,
	FiCheckCircle,
	FiUploadCloud,
	FiTarget,
	FiStar,
	FiDollarSign,
	FiMonitor,
	FiEdit3,
	FiTruck,
	FiHeadphones,
	FiHeart,
	FiShoppingBag,
	FiArrowRight,
} from "react-icons/fi";
import heroIllustration from "../assets/hero_illustration.png";
import googleLogo from "../assets/google.png";
import appleLogo from "../assets/apple.png";
import amazonLogo from "../assets/amazon.png";
import microsoftLogo from "../assets/microsoft.png";

export default function Home() {
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState("");
	const [location, setLocation] = useState("");

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 10,
			},
		},
	};

	const handleSearch = (e) => {
		if (e) e.preventDefault();
		if (keyword.trim() || location.trim()) {
			navigate(
				`/jobs?search=${encodeURIComponent(
					keyword
				)}&location=${encodeURIComponent(location)}`
			);
		} else {
			navigate("/jobs");
		}
	};

	const handleSuggestionClick = (term) => {
		navigate(`/jobs?search=${encodeURIComponent(term)}`);
	};

	const popularVacancies = [
		{ title: "Anesthesiologists", positions: "45,904 Open Positions" },
		{ title: "Surgeons", positions: "50,364 Open Positions" },
		{ title: "Obstetricians-Gynecologists", positions: "4,339 Open Positions" },
		{ title: "Orthodontists", positions: "20,079 Open Positions" },
		{ title: "Maxillofacial Surgeons", positions: "74,875 Open Positions" },
		{ title: "Software Developer", positions: "43,359 Open Positions" },
		{ title: "Psychiatrists", positions: "18,599 Open Positions" },
		{ title: "Data Scientist", positions: "28,200 Open Positions" },
	];

	const stats = [
		{ icon: FiBriefcase, count: "1M+", label: "Live Jobs" },
		{ icon: FiShoppingBag, count: "10k+", label: "Companies" },
		{ icon: FiUsers, count: "5k+", label: "Job Seekers" },
		{ icon: FiTrendingUp, count: "3M+", label: "New Jobs" },
	];

	const categories = [
		{
			name: "Accounting / Finance",
			icon: FiDollarSign,
			positions: 2,
			color: "bg-blue-50 text-blue-600",
		},
		{
			name: "Marketing",
			icon: FiTrendingUp,
			positions: 86,
			color: "bg-purple-50 text-purple-600",
		},
		{
			name: "Design",
			icon: FiEdit3,
			positions: 43,
			color: "bg-pink-50 text-pink-600",
		},
		{
			name: "Development",
			icon: FiMonitor,
			positions: 12,
			color: "bg-indigo-50 text-indigo-600",
		},
		{
			name: "Human Resource",
			icon: FiUsers,
			positions: 55,
			color: "bg-green-50 text-green-600",
		},
		{
			name: "Automotive Jobs",
			icon: FiTruck,
			positions: 2,
			color: "bg-orange-50 text-orange-600",
		},
		{
			name: "Customer Service",
			icon: FiHeadphones,
			positions: 2,
			color: "bg-teal-50 text-teal-600",
		},
		{
			name: "Health and Care",
			icon: FiHeart,
			positions: 25,
			color: "bg-red-50 text-red-600",
		},
	];

	const featuredJobs = [
		{
			company: "Google Inc.",
			logo: googleLogo,
			title: "Technical Database Engineer",
			type: "INTERNSHIP",
			location: "Serbia",
		},
		{
			company: "Microsoft",
			logo: microsoftLogo,
			title: "Product Manager",
			type: "FULL TIME",
			location: "India",
		},
		{
			company: "Amazon",
			logo: amazonLogo,
			title: "Senior Software Engineer",
			type: "FULL TIME",
			location: "USA",
		},
		{
			company: "Apple",
			logo: appleLogo,
			title: "Senior UX Designer",
			type: "FULL TIME",
			location: "California",
		},
		{
			company: "Google Inc.",
			logo: googleLogo,
			title: "Data Scientist",
			type: "FULL TIME",
			location: "Remote",
		},
	];

	const companies = [
		{ name: "Apple", logo: appleLogo, positions: 12 },
		{ name: "Google", logo: googleLogo, positions: 25 },
		{ name: "Amazon", logo: amazonLogo, positions: 18 },
		{ name: "Microsoft", logo: microsoftLogo, positions: 30 },
	];

	const testimonials = [
		{
			name: "Bessie Cooper",
			role: "Creative Director",
			text: "Without any doubt I recommend Alcaline Solutions as one of the best web design and digital marketing agencies.",
			rating: 5,
		},
		{
			name: "Jane Cooper",
			role: "Photographer",
			text: "One of the best agencies I've come across so far! Wouldn't be hesitated to introduce their work to someone else.",
			rating: 4,
		},
		{
			name: "Robert Fox",
			role: "UI/UX Designer",
			text: "Great quality work done by their team! Very professional and responsive. Would definitely work with them again.",
			rating: 5,
		},
	];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="pt-4 pb-8">
				<div className="px-4 sm:px-6 lg:px-20 flex flex-col gap-4">
					<div className="grid lg:grid-cols-2 gap-4 items-center">
						<motion.div
							className="flex flex-col gap-6"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							variants={containerVariants}
						>
							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-100px" }}
								variants={itemVariants}
								className="flex flex-col gap-2"
							>
								<motion.h1
									className="text-4xl lg:text-5xl font-bold text-blue-600 leading-tight mt-0"
									variants={itemVariants}
								>
									Find a job that suits your interests & skills.
								</motion.h1>
								<motion.p
									className="text-gray-500 leading-relaxed"
									variants={itemVariants}
								>
									Discover thousands of career opportunities from top companies
									around the world. We help you find the perfect role to grow
									your career and achieve your goals.
								</motion.p>
							</motion.div>

							{/* Search Bar */}
							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-100px" }}
								variants={itemVariants}
								className=""
							>
								<form
									onSubmit={handleSearch}
									className="flex flex-col sm:flex-row items-center gap-2"
								>
									<div className="flex flex-1 w-full gap-2">
										<LocationCombobox
											value={location}
											onChange={setLocation}
											className="flex-1"
										/>
										<InputField
											type="text"
											placeholder="Job title, keywords, company"
											value={keyword}
											onChange={(e) => setKeyword(e.target.value)}
											icon={FiSearch}
											className="flex-1"
										/>
									</div>
									<Button
										type="submit"
										variant="primary"
										className="w-full sm:w-auto h-[46px] mt-0"
									>
										Find Jobs
									</Button>
								</form>
							</motion.div>
							<motion.div
								className="text-sm text-gray-500"
								variants={itemVariants}
							>
								<span className="font-semibold mr-2">Suggestions:</span>
								{[
									"Designer",
									"Programming",
									"Digital Marketing",
									"Video",
									"Animation",
								].map((term, index, array) => (
									<span key={term}>
										<button
											onClick={() => handleSuggestionClick(term)}
											className="hover:text-blue-600 hover:underline transition-colors"
										>
											{term}
										</button>
										{index < array.length - 1 && ", "}
									</span>
								))}
							</motion.div>
						</motion.div>

						<motion.div
							className="flex justify-end"
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<img
								src={heroIllustration}
								alt="Hero Illustration"
								className="w-full max-w-xl"
							/>
						</motion.div>
					</div>

					{/* Stats */}
					<motion.div
						className="grid grid-cols-2 md:grid-cols-4 gap-8"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={containerVariants}
					>
						{stats.map((stat, index) => (
							<motion.div
								key={index}
								className="bg-blue-50 rounded-xl p-4 justify-center hover:shadow-md transition-shadow flex gap-4 items-center cursor-default"
								variants={itemVariants}
								whileHover={{ scale: 1.05 }}
							>
								<div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
									<stat.icon className="text-white text-xl" />
								</div>
								<div className="text-2xl font-bold text-gray-900 flex flex-col">
									<div>{stat.count}</div>
									<div className="text-sm text-gray-600 font-normal">
										{stat.label}
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Most Popular Vacancies */}
			{/* Most Popular Vacancies */}
			<section className="py-20 bg-white">
				<motion.div
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={containerVariants}
				>
					<div className="flex items-center justify-between mb-12">
						<motion.h2
							className="text-4xl font-bold text-gray-900 uppercase"
							variants={itemVariants}
						>
							Most Popular Vacancies
						</motion.h2>
						<motion.div variants={itemVariants}>
							<Link
								to="/jobs"
								className="text-blue-600 hover:text-blue-700 font-semibold"
							>
								View All →
							</Link>
						</motion.div>
					</div>
					<motion.div
						className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
						variants={containerVariants}
					>
						{popularVacancies.map((job, index) => (
							<motion.div
								key={index}
								className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
								variants={itemVariants}
								whileHover={{ scale: 1.05 }}
							>
								<h3 className="text-lg font-bold text-gray-900 mb-2">
									{job.title}
								</h3>
								<p className="text-sm text-gray-600">{job.positions}</p>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* How Resumatch Work */}
			{/* How Resumatch Work */}
			<section className="py-20 bg-gray-50">
				<motion.div
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={containerVariants}
				>
					<motion.h2
						className="text-4xl font-bold text-gray-900 text-center mb-16 uppercase"
						variants={itemVariants}
					>
						How{" "}
						<span className="text-blue-600 italic normal-case">ResuMatch.</span>{" "}
						works
					</motion.h2>
					<motion.div
						className="grid md:grid-cols-4 gap-8"
						variants={containerVariants}
					>
						{[
							{
								icon: <FiUsers size={32} />,
								title: "Create account",
								desc: "Aliquam facilisis egestas sapien, nec tempor leo tristique at.",
							},
							{
								icon: <FiUploadCloud size={32} />,
								title: "Upload CV/Resume",
								desc: "Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales",
							},
							{
								icon: <FiTarget size={32} />,
								title: "Find suitable job",
								desc: "Phasellus quis eleifend ex. Morbi nec fringilla nibh.",
							},
							{
								icon: <FiCheckCircle size={32} />,
								title: "Apply job",
								desc: "Curabitur sit amet maximus ligula. Nam a nulla ante, Nam sodales purus.",
							},
						].map((step, index) => (
							<motion.div
								key={index}
								className="text-center"
								variants={itemVariants}
							>
								<div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
									{step.icon}
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									{step.title}
								</h3>
								<p className="text-gray-600 text-sm">{step.desc}</p>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* Popular Category */}
			{/* Popular Category */}
			<section className="py-20 bg-white">
				<motion.div
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={containerVariants}
				>
					<div className="flex items-center justify-between mb-12">
						<motion.h2
							className="text-4xl font-bold text-gray-900 uppercase"
							variants={itemVariants}
						>
							Popular categories
						</motion.h2>
						<motion.div variants={itemVariants}>
							<Link
								to="/categories"
								className="text-blue-600 hover:text-blue-700 font-semibold"
							>
								View All →
							</Link>
						</motion.div>
					</div>
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
						variants={containerVariants}
					>
						{categories.map((cat, index) => {
							const IconComponent = cat.icon;
							return (
								<motion.div
									key={index}
									className="bg-blue-50 rounded-xl p-4 hover:shadow-md transition-shadow flex gap-4 items-center cursor-pointer justify-start"
									variants={itemVariants}
									whileHover={{ scale: 1.05 }}
								>
									<div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
										<IconComponent className="text-white text-xl" />
									</div>
									<div className="flex flex-col">
										<h3 className="font-bold text-gray-900 text-base leading-tight">
											{cat.name}
										</h3>
										<p className="text-sm text-gray-600 font-normal mt-0.5">
											{cat.positions} Open positions
										</p>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				</motion.div>
			</section>

			{/* Featured Job */}
			{/* Featured Job */}
			<section className="py-20 bg-gray-50">
				<motion.div
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={containerVariants}
				>
					<div className="flex items-center justify-between mb-12">
						<motion.h2
							className="text-4xl font-bold text-gray-900 uppercase"
							variants={itemVariants}
						>
							Featured Jobs
						</motion.h2>
						<motion.div variants={itemVariants}>
							<Link
								to="/jobs"
								className="text-blue-600 hover:text-blue-700 font-semibold"
							>
								View All →
							</Link>
						</motion.div>
					</div>
					<motion.div className="space-y-4" variants={containerVariants}>
						{featuredJobs.map((job, index) => (
							<motion.div
								key={index}
								className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
								variants={itemVariants}
								whileHover={{ scale: 1.01 }}
							>
								<div className="flex items-center gap-4">
									<div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 p-2">
										<img
											src={job.logo}
											alt={job.company}
											className="w-full h-full object-contain"
										/>
									</div>
									<div>
										<h3 className="font-bold text-gray-900 text-lg">
											{job.title}
										</h3>
										<p className="text-sm text-gray-600">
											{job.company} • {job.location}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
										{job.type}
									</span>
									<Button variant="primary">Apply Now</Button>
								</div>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* Top Companies */}
			{/* Top Companies */}
			<section className="py-20 bg-white">
				<motion.div
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={containerVariants}
				>
					<motion.h2
						className="text-4xl font-bold text-gray-900 text-center mb-12 uppercase"
						variants={itemVariants}
					>
						Top companies
					</motion.h2>
					<motion.div
						className="grid md:grid-cols-4 gap-6"
						variants={containerVariants}
					>
						{companies.map((company, index) => (
							<motion.div
								key={index}
								className="p-8 bg-white border-2 border-gray-200 rounded-xl text-center hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
								variants={itemVariants}
								whileHover={{ scale: 1.05 }}
							>
								<div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
									<img
										src={company.logo}
										alt={company.name}
										className="w-full h-full object-contain"
									/>
								</div>
								<h3 className="font-bold text-gray-900 text-xl mb-1">
									{company.name}
								</h3>
								<button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
									{company.positions} Open Positions
								</button>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* Client's Testimonial */}
			{/* Client's Testimonial */}
			<section className="py-20 bg-gray-50">
				<motion.div
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={containerVariants}
				>
					<motion.h2
						className="text-4xl font-bold text-gray-900 text-center mb-12 uppercase"
						variants={itemVariants}
					>
						Client&apos;s Testimonials
					</motion.h2>
					<motion.div
						className="grid md:grid-cols-3 gap-8"
						variants={containerVariants}
					>
						{testimonials.map((review, index) => (
							<motion.div
								key={index}
								className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
								variants={itemVariants}
								whileHover={{ y: -5 }}
							>
								<div className="flex gap-1 mb-4">
									{[...Array(review.rating)].map((_, i) => (
										<FiStar
											key={i}
											className="text-yellow-400 fill-yellow-400"
										/>
									))}
								</div>
								<p className="text-gray-600 mb-6 italic">
									&quot;{review.text}&quot;
								</p>
								<div className="flex items-center gap-3">
									<img
										src={`https://i.pravatar.cc/150?u=${review.name}`}
										alt={review.name}
										className="w-12 h-12 rounded-full object-cover"
									/>
									<div>
										<h4 className="font-bold text-gray-900">{review.name}</h4>
										<p className="text-sm text-gray-600">{review.role}</p>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</section>

			{/* CTA Sections */}
			<section className="py-20 bg-white">
				<motion.div
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={containerVariants}
				>
					<div className="grid md:grid-cols-2 gap-8">
						<motion.div
							className="bg-gray-100 p-12 rounded-2xl"
							variants={itemVariants}
						>
							<h3 className="text-3xl font-bold text-gray-900 mb-4">
								Become a Candidate
							</h3>
							<p className="text-gray-600 mb-6">
								Create your professional profile, upload your resume, and get
								matched with top companies looking for your specific skills and
								experience.
							</p>
							<Button
								to="/register"
								variant="primary"
								className="px-8 py-3"
								rightIcon={FiArrowRight}
							>
								Register Now
							</Button>
						</motion.div>
						<motion.div
							className="bg-blue-600 p-12 rounded-2xl text-white"
							variants={itemVariants}
						>
							<h3 className="text-3xl font-bold mb-4">Become an Employer</h3>
							<p className="text-blue-100 mb-6">
								Post job openings, find the perfect candidates, and streamline
								your hiring process with our advanced AI-powered matching
								technology.
							</p>
							<Button
								to="/employer/register"
								variant="secondary"
								rightIcon={FiArrowRight}
							>
								Register Now
							</Button>
						</motion.div>
					</div>
				</motion.div>
			</section>
		</div>
	);
}
