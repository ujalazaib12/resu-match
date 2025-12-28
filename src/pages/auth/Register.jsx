import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import InputField from "../../components/common/InputField";
import LocationCombobox from "../../components/common/LocationCombobox";
import CustomDropdown from "../../components/common/CustomDropdown";
import FileUpload from "../../components/common/FileUpload";
import Button from "../../components/common/Button";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff, FiX, FiCheck, FiArrowRight } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
	const { register } = useAuth();
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		// Step 1: Basic Information
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		location: "",
		linkedin: "",
		portfolio: "",
		profilePicture: null,
		password: "",
		confirmPassword: "",

		// Step 2: Professional Background
		jobTitle: "",
		yearsOfExperience: "",
		experienceLevel: "",
		currentCompany: "",
		industry: "",
		professionalSummary: "",

		// Step 3: Skills & Qualifications
		primarySkills: [],
		secondarySkills: [],
		technicalSkills: [],
		softSkills: [],
		certifications: [],
		languages: [],
		education: [],

		// Step 4: Job Preferences
		desiredJobTitles: [],
		preferredLocations: [],
		workMode: [],
		jobType: [],
		salaryMin: "",
		salaryMax: "",
		salaryCurrency: "USD",
		companySize: [],
		preferredIndustries: [],

		// Step 5: Resume
		resume: null,
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	// const [userType, setUserType] = useState("Job Seekers");

	// Temporary inputs for array fields
	const [tempTechnicalSkill, setTempTechnicalSkill] = useState("");
	const [tempSoftSkill, setTempSoftSkill] = useState("");
	const [tempCertification, setTempCertification] = useState({
		name: "",
		organization: "",
		date: "",
	});

	const [tempLanguage, setTempLanguage] = useState({
		language: "",
		proficiency: "",
	});

	const [tempEducation, setTempEducation] = useState({
		degree: "",
		institution: "",
		year: "",
	});

	const [tempJobTitle, setTempJobTitle] = useState("");
	const [tempLocation, setTempLocation] = useState("");

	const totalSteps = 5;

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		if (type === "file") {
			setFormData({
				...formData,
				[name]: files[0],
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const handleArrayToggle = (field, value) => {
		const currentArray = formData[field];
		if (currentArray.includes(value)) {
			setFormData({
				...formData,
				[field]: currentArray.filter((item) => item !== value),
			});
		} else {
			setFormData({
				...formData,
				[field]: [...currentArray, value],
			});
		}
	};

	const addToArray = (field, value) => {
		if (value && !formData[field].includes(value)) {
			setFormData({
				...formData,
				[field]: [...formData[field], value],
			});
			return true;
		}
		return false;
	};

	const removeFromArray = (field, index) => {
		const newArray = formData[field].filter((_, i) => i !== index);
		setFormData({
			...formData,
			[field]: newArray,
		});
	};

	const addCertification = () => {
		if (tempCertification.name && tempCertification.organization) {
			setFormData({
				...formData,
				certifications: [...formData.certifications, { ...tempCertification }],
			});
			setTempCertification({ name: "", organization: "", date: "" });
		}
	};

	const addLanguage = () => {
		if (tempLanguage.language && tempLanguage.proficiency) {
			setFormData({
				...formData,
				languages: [...formData.languages, { ...tempLanguage }],
			});
			setTempLanguage({ language: "", proficiency: "" });
		}
	};

	const addEducation = () => {
		if (tempEducation.degree && tempEducation.institution) {
			setFormData({
				...formData,
				education: [...formData.education, { ...tempEducation }],
			});
			setTempEducation({ degree: "", institution: "", year: "" });
		}
	};

	const validateStep = () => {
		setError("");

		switch (currentStep) {
			case 1:
				if (
					!formData.firstName ||
					!formData.lastName ||
					!formData.email ||
					!formData.phone ||
					!formData.location
				) {
					setError("Please fill in all required fields");
					return false;
				}
				if (!formData.password || !formData.confirmPassword) {
					setError("Please enter password");
					return false;
				}
				if (formData.password !== formData.confirmPassword) {
					setError("Passwords do not match");
					return false;
				}
				if (formData.password.length < 8) {
					setError("Password must be at least 8 characters long");
					return false;
				}
				if (!agreedToTerms) {
					setError("Please agree to the Terms of Services");
					return false;
				}
				break;
			case 2:
				// Making these optional for flexibility or stick to required as per previous
				if (
					!formData.jobTitle ||
					!formData.yearsOfExperience ||
					!formData.experienceLevel
				) {
					setError("Please fill in required fields");
					return false;
				}
				break;
			case 3:
				// Skills are now optional or validated differently if needed
				break;
			case 4:
				if (
					formData.desiredJobTitles.length === 0 ||
					formData.workMode.length === 0
				) {
					setError(
						"Please select at least one desired job title and work mode"
					);
					return false;
				}
				break;
		}
		return true;
	};

	const handleNext = () => {
		if (validateStep()) {
			if (currentStep < totalSteps) {
				setCurrentStep(currentStep + 1);
				window.scrollTo(0, 0);
			}
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
			setError("");
			window.scrollTo(0, 0);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const data = new FormData();

			// Basic Fields
			data.append("name", `${formData.firstName} ${formData.lastName}`);
			data.append("email", formData.email);
			data.append("password", formData.password);
			data.append("phone", formData.phone);
			data.append("location", formData.location);
			data.append("linkedin", formData.linkedin);
			data.append("portfolio", formData.portfolio);

			// Professional
			data.append("jobTitle", formData.jobTitle);
			data.append("yearsOfExperience", formData.yearsOfExperience);
			data.append("experienceLevel", formData.experienceLevel);
			data.append("currentCompany", formData.currentCompany);
			data.append("industry", formData.industry);
			data.append("professionalSummary", formData.professionalSummary);

			// Json Fields
			data.append("primarySkills", JSON.stringify(formData.primarySkills));
			data.append("secondarySkills", JSON.stringify(formData.secondarySkills));
			data.append("technicalSkills", JSON.stringify(formData.technicalSkills));
			data.append("softSkills", JSON.stringify(formData.softSkills));
			data.append("certifications", JSON.stringify(formData.certifications));
			data.append("languages", JSON.stringify(formData.languages));
			data.append("education", JSON.stringify(formData.education));
			data.append(
				"desiredJobTitles",
				JSON.stringify(formData.desiredJobTitles)
			);
			data.append(
				"preferredLocations",
				JSON.stringify(formData.preferredLocations)
			);
			data.append("workMode", JSON.stringify(formData.workMode));
			data.append("jobType", JSON.stringify(formData.jobType));
			data.append("salaryMin", formData.salaryMin);
			data.append("salaryMax", formData.salaryMax);
			data.append("salaryCurrency", formData.salaryCurrency);
			data.append("companySize", JSON.stringify(formData.companySize));
			data.append(
				"preferredIndustries",
				JSON.stringify(formData.preferredIndustries)
			);

			// Files
			if (formData.profilePicture) {
				data.append("profilePicture", formData.profilePicture);
			}
			if (formData.resume) {
				data.append("resume", formData.resume);
			}

			await register(data);
			navigate("/dashboard");
		} catch (err) {
			console.error(err);
			setError(
				err.response?.data?.message ||
				err.message ||
				"Failed to create account."
			);
		} finally {
			setLoading(false);
		}
	};

	// const handleSocialLogin = (provider) => {
	// 	// Implement social login logic later
	// 	alert(`${provider} login not yet implemented`);
	// };

	const renderProgressBar = () => (
		<div className="mb-12 relative max-w-2xl mx-auto px-4">
			{/* Progress Tracks */}
			<div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 rounded-full -z-10" />
			<motion.div
				className="absolute top-1/2 left-4 h-1 bg-blue-600 -translate-y-1/2 rounded-full -z-10"
				initial={{ width: "0%" }}
				animate={{
					width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				style={{ maxWidth: "calc(100% - 2rem)" }}
			/>

			{/* Steps */}
			<div className="flex justify-between items-center relative z-0">
				{[1, 2, 3, 4, 5].map((step) => (
					<div key={step} className="flex flex-col items-center">
						<motion.div
							initial={false}
							animate={{
								scale: step === currentStep ? 1.2 : 1,
								backgroundColor: step <= currentStep ? "#2563EB" : "#E5E7EB",
								color: step <= currentStep ? "#ffffff" : "#6B7280",
							}}
							transition={{ duration: 0.2 }}
							className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm z-10"
						>
							{step < currentStep ? <FiCheck size={16} /> : step}
						</motion.div>
						<span
							className={`text-xs mt-2 font-medium hidden sm:block transition-colors duration-200 ${step <= currentStep ? "text-blue-600" : "text-gray-400"
								}`}
						>
							{step === 1
								? "Basic"
								: step === 2
									? "Professional"
									: step === 3
										? "Skills"
										: step === 4
											? "Preferences"
											: "Resume"}
						</span>
					</div>
				))}
			</div>
		</div>
	);

	const pageVariants = {
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
	};

	const renderStep1 = () => (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.3 }}
			className="space-y-4"
		>
			<div className="grid grid-cols-2 gap-4">
				<InputField
					type="text"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					required
					label="First Name"
					placeholder="John"
					className="mb-0"
				/>
				<InputField
					type="text"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					required
					label="Last Name"
					placeholder="Doe"
					className="mb-0"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<InputField
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					required
					label="Email"
					placeholder="john@example.com"
				/>

				<InputField
					type="tel"
					name="phone"
					value={formData.phone}
					onChange={handleChange}
					required
					label="Phone Number"
					placeholder="+1 (555) 123-4567"
				/>
			</div>

			<LocationCombobox
				value={formData.location}
				onChange={(val) => setFormData({ ...formData, location: val })}
				label="Current Location"
				required
				placeholder="Select City or Country"
			/>

			<div className="grid grid-cols-2 gap-4">
				<InputField
					type="url"
					name="linkedin"
					value={formData.linkedin}
					onChange={handleChange}
					label="LinkedIn Profile"
					placeholder="https://linkedin.com/in/john-doe"
				/>

				<InputField
					type="url"
					name="portfolio"
					value={formData.portfolio}
					onChange={handleChange}
					label="Portfolio/Personal Website"
					placeholder="https://johndoe.com"
				/>
			</div>

			<FileUpload
				label="Profile Picture"
				value={formData.profilePicture}
				onChange={(file) => setFormData({ ...formData, profilePicture: file })}
				accept="image/*"
			/>

			<div className="grid grid-cols-2 gap-4">
				<InputField
					type={showPassword ? "text" : "password"}
					name="password"
					value={formData.password}
					onChange={handleChange}
					required
					label="Password"
					placeholder="Min. 8 characters"
					rightElement={
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="text-gray-500 hover:text-gray-700 focus:outline-none"
						>
							{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
						</button>
					}
				/>

				<InputField
					type={showConfirmPassword ? "text" : "password"}
					name="confirmPassword"
					value={formData.confirmPassword}
					onChange={handleChange}
					required
					label="Confirm Password"
					placeholder="Re-enter password"
					rightElement={
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="text-gray-500 hover:text-gray-700 focus:outline-none"
						>
							{showConfirmPassword ? (
								<FiEyeOff size={20} />
							) : (
								<FiEye size={20} />
							)}
						</button>
					}
				/>
			</div>

			<div className="flex items-center gap-2 py-2">
				<input
					type="checkbox"
					id="terms"
					checked={agreedToTerms}
					onChange={(e) => setAgreedToTerms(e.target.checked)}
					className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
				/>
				<label htmlFor="terms" className="text-sm text-gray-600">
					I&apos;ve read and agree with your{" "}
					<a href="#" className="text-blue-600 hover:text-blue-700">
						Terms of Services
					</a>
				</label>
			</div>
		</motion.div>
	);

	const renderStep2 = () => (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.3 }}
			className="space-y-4"
		>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<InputField
					type="text"
					name="jobTitle"
					value={formData.jobTitle}
					onChange={handleChange}
					required
					label="Current Job Title"
					placeholder="e.g. Software Engineer"
				/>

				<CustomDropdown
					label="Years of Experience"
					value={formData.yearsOfExperience}
					onChange={(val) =>
						setFormData({ ...formData, yearsOfExperience: val })
					}
					required
					placeholder="Select Years"
					options={[
						{ label: "0-1 years", value: "0-1" },
						{ label: "1-3 years", value: "1-3" },
						{ label: "3-5 years", value: "3-5" },
						{ label: "5-10 years", value: "5-10" },
						{ label: "10+ years", value: "10+" },
					]}
				/>

				<CustomDropdown
					label="Experience Level"
					value={formData.experienceLevel}
					onChange={(val) => setFormData({ ...formData, experienceLevel: val })}
					required
					placeholder="Select Level"
					options={[
						{ label: "Entry Level", value: "Entry" },
						{ label: "Mid Level", value: "Mid" },
						{ label: "Senior", value: "Senior" },
						{ label: "Lead", value: "Lead" },
						{ label: "Executive", value: "Executive" },
					]}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<InputField
					type="text"
					label="Current/Most Recent Company"
					name="currentCompany"
					value={formData.currentCompany}
					onChange={handleChange}
					placeholder="e.g. Acme Corp"
				/>

				<InputField
					type="text"
					label="Industry/Field"
					name="industry"
					value={formData.industry}
					onChange={handleChange}
					placeholder="e.g. Software Development"
				/>
			</div>

			<InputField
				type="textarea"
				label="Professional Summary"
				name="professionalSummary"
				value={formData.professionalSummary}
				onChange={handleChange}
				placeholder="Brief Professional Summary (2-3 sentences)"
				rows={4}
			/>
		</motion.div>
	);

	const renderStep3 = () => (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.3 }}
			className="space-y-4"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Technical Skills */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Technical Skills
					</label>
					<div className="mb-2">
						<InputField
							type="text"
							value={tempTechnicalSkill}
							onChange={(e) => setTempTechnicalSkill(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									if (addToArray("technicalSkills", tempTechnicalSkill)) {
										setTempTechnicalSkill("");
									}
								}
							}}
							placeholder="Type and press Enter to add"
							className="w-full"
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						{formData.technicalSkills.map((skill, index) => (
							<span
								key={index}
								className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
							>
								{skill}
								<button
									type="button"
									onClick={() => removeFromArray("technicalSkills", index)}
									className="text-blue-700 hover:text-blue-900"
								>
									<FiX size={14} />
								</button>
							</span>
						))}
					</div>
				</div>

				{/* Soft Skills */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Soft Skills
					</label>
					<div className="mb-2">
						<InputField
							type="text"
							value={tempSoftSkill}
							onChange={(e) => setTempSoftSkill(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									if (addToArray("softSkills", tempSoftSkill)) {
										setTempSoftSkill("");
									}
								}
							}}
							placeholder="Type and press Enter to add"
							className="w-full"
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						{formData.softSkills.map((skill, index) => (
							<span
								key={index}
								className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
							>
								{skill}
								<button
									type="button"
									onClick={() => removeFromArray("softSkills", index)}
									className="text-blue-700 hover:text-blue-900"
								>
									<FiX size={14} />
								</button>
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Certifications */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Certifications
				</label>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
					<InputField
						type="text"
						value={tempCertification.name}
						onChange={(e) =>
							setTempCertification({
								...tempCertification,
								name: e.target.value,
							})
						}
						placeholder="Certification Name"
						className="w-full"
					/>
					<InputField
						type="text"
						value={tempCertification.organization}
						onChange={(e) =>
							setTempCertification({
								...tempCertification,
								organization: e.target.value,
							})
						}
						placeholder="Issuing Organization"
						className="w-full"
					/>
					<InputField
						type="text"
						value={tempCertification.date}
						onChange={(e) =>
							setTempCertification({
								...tempCertification,
								date: e.target.value,
							})
						}
						placeholder="Date (e.g., Jan 2024)"
						className="w-full"
					/>
				</div>
				<Button type="button" onClick={addCertification} className="w-full">
					Add Certification
				</Button>
				<div className="space-y-2 mt-4">
					{formData.certifications.map((cert, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-start"
						>
							<div className="text-sm">
								<div className="font-medium">{cert.name}</div>
								<div className="text-gray-600">{cert.organization}</div>
								<div className="text-gray-500 text-xs">{cert.date}</div>
							</div>
							<button
								type="button"
								onClick={() => removeFromArray("certifications", index)}
								className="text-red-600 hover:text-red-800"
							>
								<FiX size={14} />
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Languages */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Languages
				</label>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
					<InputField
						type="text"
						value={tempLanguage.language}
						onChange={(e) =>
							setTempLanguage({ ...tempLanguage, language: e.target.value })
						}
						placeholder="Language"
						className="w-full"
					/>
					<CustomDropdown
						value={tempLanguage.proficiency}
						onChange={(val) =>
							setTempLanguage({ ...tempLanguage, proficiency: val })
						}
						placeholder="Proficiency"
						options={[
							{ label: "Basic", value: "Basic" },
							{ label: "Intermediate", value: "Intermediate" },
							{ label: "Advanced", value: "Advanced" },
							{ label: "Native", value: "Native" },
						]}
						className="w-full"
					/>
				</div>
				<Button type="button" onClick={addLanguage} className="w-full mb-2">
					Add Language
				</Button>
				<div className="flex flex-wrap gap-2">
					{formData.languages.map((lang, index) => (
						<span
							key={index}
							className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
						>
							{lang.language} ({lang.proficiency})
							<button
								type="button"
								onClick={() => removeFromArray("languages", index)}
								className="text-indigo-700 hover:text-indigo-900"
							>
								<FiX size={14} />
							</button>
						</span>
					))}
				</div>
			</div>

			{/* Education */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Education
				</label>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
					<InputField
						type="text"
						value={tempEducation.degree}
						onChange={(e) =>
							setTempEducation({ ...tempEducation, degree: e.target.value })
						}
						placeholder="Degree"
						className="w-full"
					/>
					<InputField
						type="text"
						value={tempEducation.institution}
						onChange={(e) =>
							setTempEducation({
								...tempEducation,
								institution: e.target.value,
							})
						}
						placeholder="Institution"
						className="w-full"
					/>
					<InputField
						type="text"
						value={tempEducation.year}
						onChange={(e) =>
							setTempEducation({ ...tempEducation, year: e.target.value })
						}
						placeholder="Year (e.g., 2020)"
						className="w-full"
					/>
				</div>
				<Button type="button" onClick={addEducation} className="w-full">
					Add Education
				</Button>
				<div className="space-y-2 mt-4">
					{formData.education.map((edu, index) => (
						<div
							key={index}
							className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-start"
						>
							<div className="text-sm">
								<div className="font-medium">{edu.degree}</div>
								<div className="text-gray-600">{edu.institution}</div>
								<div className="text-gray-500 text-xs">{edu.year}</div>
							</div>
							<button
								type="button"
								onClick={() => removeFromArray("education", index)}
								className="text-red-600 hover:text-red-800"
							>
								<FiX size={14} />
							</button>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);

	const renderStep4 = () => (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.3 }}
			className="space-y-4"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Desired Job Titles */}
				<div>
					<InputField
						label="Desired Job Titles"
						required
						type="text"
						value={tempJobTitle}
						onChange={(e) => setTempJobTitle(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								if (addToArray("desiredJobTitles", tempJobTitle)) {
									setTempJobTitle("");
								}
							}
						}}
						placeholder="Type and press Enter to add"
						className="w-full"
					/>
					<div className="flex flex-wrap gap-2">
						{formData.desiredJobTitles.map((title, index) => (
							<span
								key={index}
								className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
							>
								{title}
								<button
									type="button"
									onClick={() => removeFromArray("desiredJobTitles", index)}
									className="text-blue-700 hover:text-blue-900"
								>
									<FiX size={14} />
								</button>
							</span>
						))}
					</div>
				</div>

				{/* Preferred Locations */}
				<div>
					<InputField
						label="Preferred Locations"
						type="text"
						value={tempLocation}
						onChange={(e) => setTempLocation(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								if (addToArray("preferredLocations", tempLocation)) {
									setTempLocation("");
								}
							}
						}}
						placeholder="Add location (or type 'Remote')"
						className="w-full"
					/>
					<div className="flex flex-wrap gap-2">
						{formData.preferredLocations.map((loc, index) => (
							<span
								key={index}
								className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
							>
								{loc}
								<button
									type="button"
									onClick={() => removeFromArray("preferredLocations", index)}
									className="text-blue-700 hover:text-blue-900"
								>
									<FiX size={14} />
								</button>
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Work Mode */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Work Mode *
				</label>
				<div className="grid grid-cols-3 gap-2">
					{["Remote", "Hybrid", "On-site"].map((mode) => (
						<button
							key={mode}
							type="button"
							onClick={() => handleArrayToggle("workMode", mode)}
							className={`px-4 py-2 border rounded-lg text-sm ${formData.workMode.includes(mode)
								? "bg-blue-400 text-white border-blue-400"
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
								}`}
						>
							{mode}
						</button>
					))}
				</div>
			</div>

			{/* Job Type */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Job Type
				</label>
				<div className="grid grid-cols-3 gap-2">
					{[
						"Full-time",
						"Part-time",
						"Contract",
						"Freelance",
						"Internship",
					].map((type) => (
						<button
							key={type}
							type="button"
							onClick={() => handleArrayToggle("jobType", type)}
							className={`px-4 py-2 border rounded-lg text-sm ${formData.jobType.includes(type)
								? "bg-blue-400 text-white border-blue-400"
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
								}`}
						>
							{type}
						</button>
					))}
				</div>
			</div>

			{/* Salary Range */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Salary Range
				</label>
				<div className="grid grid-cols-3 gap-2">
					<InputField
						type="number"
						name="salaryMin"
						value={formData.salaryMin}
						onChange={handleChange}
						placeholder="Min"
					/>
					<InputField
						type="number"
						name="salaryMax"
						value={formData.salaryMax}
						onChange={handleChange}
						placeholder="Max"
					/>
					<CustomDropdown
						value={formData.salaryCurrency}
						onChange={(val) =>
							setFormData({ ...formData, salaryCurrency: val })
						}
						options={[
							{ label: "USD", value: "USD" },
							{ label: "EUR", value: "EUR" },
							{ label: "GBP", value: "GBP" },
							{ label: "PKR", value: "PKR" },
						]}
						placeholder="Currency"
					/>
				</div>
			</div>

			{/* Company Size */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Preferred Company Size
				</label>
				<div className="grid grid-cols-3 gap-2">
					{["Startup", "Small", "Medium", "Large", "Enterprise"].map((size) => (
						<button
							key={size}
							type="button"
							onClick={() => handleArrayToggle("companySize", size)}
							className={`px-4 py-2 border rounded-lg text-sm ${formData.companySize.includes(size)
								? "bg-blue-400 text-white border-blue-400"
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
								}`}
						>
							{size}
						</button>
					))}
				</div>
			</div>

			{/* Preferred Industries */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Preferred Industries
				</label>
				<div className="grid grid-cols-3 gap-2">
					{[
						"Tech",
						"Finance",
						"Healthcare",
						"Education",
						"E-commerce",
						"Manufacturing",
						"Consulting",
						"Media",
					].map((industry) => (
						<button
							key={industry}
							type="button"
							onClick={() => handleArrayToggle("preferredIndustries", industry)}
							className={`px-4 py-2 border rounded-lg text-sm ${formData.preferredIndustries.includes(industry)
								? "bg-blue-400 text-white border-blue-400"
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
								}`}
						>
							{industry}
						</button>
					))}
				</div>
			</div>
		</motion.div>
	);

	const renderStep5 = () => (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.3 }}
			className="space-y-6"
		>
			<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
				<svg
					className="mx-auto h-12 w-12 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				<div className="mt-4">
					<label htmlFor="resume-upload" className="cursor-pointer">
						<span className="text-blue-600 hover:text-blue-700 font-medium">
							Upload a file
						</span>
						<span className="text-gray-600"> or drag and drop</span>
						<input
							id="resume-upload"
							name="resume"
							type="file"
							accept=".pdf,.doc,.docx"
							onChange={handleChange}
							className="hidden"
						/>
					</label>
					<p className="text-xs text-gray-500 mt-2">PDF or DOCX up to 10MB</p>
				</div>
				{formData.resume && (
					<div className="mt-4 p-3 bg-green-50 rounded-lg text-green-700 text-sm flex items-center justify-between">
						<span>✓ {formData.resume.name}</span>
						<button
							type="button"
							onClick={() => setFormData({ ...formData, resume: null })}
							className="text-red-500 hover:text-red-700"
						>
							×
						</button>
					</div>
				)}
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<p className="text-sm text-blue-800">
					<strong>AI Parsing:</strong> Once you upload your resume, our AI will
					automatically extract keywords, skills, and experience. You&apos;ll be
					able to review and confirm the parsed data before finalizing your
					profile.
				</p>
			</div>
		</motion.div>
	);

	return (
		<div className="min-h-screen bg-gray-50 flex justify-center px-4 py-20">
			<div className="max-w-4xl w-full">
				<div className="bg-white p-8 rounded-xl shadow-lg">
					{/* Header */}
					<div className="flex justify-center mb-8">
						<div className="flex flex-col gap-2">
							<h1 className="text-3xl font-bold text-blue-600">
								Create an Account
							</h1>
							<p className="text-sm text-gray-600 text-center">
								Already have an account?{" "}
								<Link
									to="/login"
									className="text-blue-600 hover:text-blue-700 font-medium"
								>
									Log in
								</Link>
							</p>
						</div>

						{/* <div className="relative">
							<select
								value={userType}
								onChange={(e) => setUserType(e.target.value)}
								className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option>Employers</option>
								<option>Job Seekers</option>
							</select>
							<svg
								className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div> */}
					</div>

					{/* Progress Bar */}
					{renderProgressBar()}

					{/* Form Steps */}
					<form
						onSubmit={handleSubmit}
						className="relative overflow-hidden p-1"
					>
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm hidden">
							{/* Reserved for errors, keeping layout stable */}
						</div>
						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
								{error}
							</div>
						)}

						<AnimatePresence mode="wait">
							{currentStep === 1 && (
								<motion.div key="step1" className="w-full">
									{renderStep1()}
								</motion.div>
							)}
							{currentStep === 2 && (
								<motion.div key="step2" className="w-full">
									{renderStep2()}
								</motion.div>
							)}
							{currentStep === 3 && (
								<motion.div key="step3" className="w-full">
									{renderStep3()}
								</motion.div>
							)}
							{currentStep === 4 && (
								<motion.div key="step4" className="w-full">
									{renderStep4()}
								</motion.div>
							)}
							{currentStep === 5 && (
								<motion.div key="step5" className="w-full">
									{renderStep5()}
								</motion.div>
							)}
						</AnimatePresence>

						{/* Navigation Buttons */}
						<div className="mt-8 flex gap-4">
							{currentStep > 1 && (
								<Button
									variant="secondary"
									onClick={handlePrevious}
									className="flex-1"
								>
									Previous
								</Button>
							)}
							{currentStep < totalSteps ? (
								<Button
									onClick={handleNext}
									className="flex-1"
									rightIcon={FiArrowRight}
								>
									Next
								</Button>
							) : (
								<Button type="submit" isLoading={loading} className="flex-1">
									Create Account
								</Button>
							)}
						</div>
					</form>

					{/* Social Login - Only on Step 1 */}
					{/* {currentStep === 1 && (
						<>
							<div className="relative my-6">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-4 bg-white text-gray-500">or</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<Button
									variant="secondary"
									icon={FaFacebook}
									onClick={() => handleSocialLogin("Facebook")}
									className="w-full text-gray-700"
								>
									Facebook
								</Button>

								<Button
									variant="secondary"
									icon={FcGoogle}
									onClick={() => handleSocialLogin("Google")}
									className="w-full text-gray-700"
								>
									Google
								</Button>
							</div>
						</>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default Register;
