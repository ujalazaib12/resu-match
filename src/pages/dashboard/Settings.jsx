import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";
import ResumeUpload from "../../components/dashboard/ResumeUpload";
import InputField from "../../components/common/InputField";
import CustomDropdown from "../../components/common/CustomDropdown";
import LocationCombobox from "../../components/common/LocationCombobox";
import Button from "../../components/common/Button";
import {
	FiUser,
	FiBriefcase,
	FiAward,
	FiTarget,
	FiFileText,
	FiBell,
	FiLock,
	FiMapPin,
	FiGlobe,
	FiLinkedin,
	FiX,
	FiPlus,
	FiUpload,
	FiTrash2,
	FiCamera,
} from "react-icons/fi";

const Settings = () => {
	const { user, logout, updateUser } = useAuth();
	const fileInputRef = useRef(null);
	const [activeTab, setActiveTab] = useState("personal");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState({ type: "", text: "" });

	const handleDeleteAccount = async () => {
		if (
			window.confirm(
				"Are you sure you want to delete your account? This action cannot be undone."
			)
		) {
			try {
				await api.delete("/users/profile");
				logout();
			} catch (error) {
				console.error("Failed to delete account:", error);
				setMessage({ type: "error", text: "Failed to delete account" });
			}
		}
	};

	// Personal Information
	const [personalInfo, setPersonalInfo] = useState({
		firstName: user?.name?.split(" ")[0] || "",
		lastName: user?.name?.split(" ")[1] || "",
		email: user?.email || "",
		phone: user?.phone || "",
		location: user?.location || "",
		linkedIn: user?.linkedin_profile || "",
		portfolio: user?.portfolio_website || "",
		profilePicture: user?.profile_picture_url || null,
	});

	// Professional Background
	const [professionalInfo, setProfessionalInfo] = useState({
		currentTitle: user?.job_title || "",
		yearsOfExperience: user?.years_of_experience || "",
		experienceLevel: user?.experience_level || "",
		currentCompany: user?.current_company || "",
		industry: user?.industry || "",
		professionalSummary: user?.professional_summary || "",
	});

	// Skills & Qualifications
	const [skillsInfo, setSkillsInfo] = useState({
		primarySkills: user?.skills?.primary || [],
		secondarySkills: user?.skills?.secondary || [],
		technicalSkills: user?.skills?.technical || [],
		softSkills: user?.skills?.soft || [],
		certifications: user?.skills?.certifications || [],
		languages: user?.skills?.languages || [],
		education: user?.education || [],
	});

	// Job Preferences
	const [jobPreferences, setJobPreferences] = useState({
		desiredTitles: user?.job_preferences?.jobTitles || [],
		preferredLocations: user?.job_preferences?.locations || [],
		workMode: user?.job_preferences?.workMode || [],
		jobType: user?.job_preferences?.jobType || [],
		salaryMin: user?.job_preferences?.salary?.min || "",
		salaryMax: user?.job_preferences?.salary?.max || "",
		companySizes: user?.job_preferences?.companySize || [],
		preferredIndustries: user?.job_preferences?.industries || [],
	});

	// Password Settings
	const [passwordSettings, setPasswordSettings] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	// Update state when user object changes (e.g. after refresh)
	useEffect(() => {
		if (user) {
			setPersonalInfo({
				firstName: user.name?.split(" ")[0] || "",
				lastName: user.name?.split(" ")[1] || "",
				email: user.email || "",
				phone: user.phone || "",
				location: user.location || "",
				linkedIn: user.linkedin_profile || "",
				portfolio: user.portfolio_website || "",
				profilePicture: user.profile_picture_url || null,
			});
			setProfessionalInfo({
				currentTitle: user.job_title || "",
				yearsOfExperience: user.years_of_experience || "",
				experienceLevel: user.experience_level || "",
				currentCompany: user.current_company || "",
				industry: user.industry || "",
				professionalSummary: user.professional_summary || "",
			});
			setSkillsInfo({
				primarySkills: user.skills?.primary || [],
				secondarySkills: user.skills?.secondary || [],
				technicalSkills: user.skills?.technical || [],
				softSkills: user.skills?.soft || [],
				certifications: user.skills?.certifications || [],
				languages: user.skills?.languages || [],
				education: user.education || [],
			});
			setJobPreferences({
				desiredTitles: user.job_preferences?.jobTitles || [],
				preferredLocations: user.job_preferences?.locations || [],
				workMode: user.job_preferences?.workMode || [],
				jobType: user.job_preferences?.jobType || [],
				salaryMin: user.job_preferences?.salary?.min || "",
				salaryMax: user.job_preferences?.salary?.max || "",
				companySizes: user.job_preferences?.companySize || [],
				preferredIndustries: user.job_preferences?.industries || [],
			});
		}
	}, [user]);

	// Notification Settings
	const [notificationSettings, setNotificationSettings] = useState({
		emailNotifications: true,
		jobAlerts: true,
		applicationUpdates: true,
		weeklyDigest: false,
	});

	// Temporary inputs for arrays
	const [tempTechnicalSkill, setTempTechnicalSkill] = useState("");
	const [tempSoftSkill, setTempSoftSkill] = useState("");
	const [newCertification, setNewCertification] = useState({
		name: "",
		organization: "",
		date: "",
	});
	const [newLanguage, setNewLanguage] = useState({
		language: "",
		proficiency: "",
	});
	const [newEducation, setNewEducation] = useState({
		degree: "",
		institution: "",
		year: "",
	});

	const tabs = [
		{ id: "personal", label: "Personal Info", icon: FiUser },
		{ id: "professional", label: "Professional", icon: FiBriefcase },
		{ id: "skills", label: "Skills & Certs", icon: FiAward },
		{ id: "preferences", label: "Job Preferences", icon: FiTarget },
		{ id: "resume", label: "Resume", icon: FiFileText },
		{ id: "security", label: "Security", icon: FiLock },
		{ id: "notifications", label: "Notifications", icon: FiBell },
	];

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("profilePicture", file);

		setLoading(true);
		try {
			const response = await api.put("/users/profile/picture", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			// Update local state and context
			const newUrl = response.data.profilePictureUrl;
			setPersonalInfo((prev) => ({ ...prev, profilePicture: newUrl }));
			updateUser({ ...user, profile_picture_url: newUrl });

			setMessage({ type: "success", text: "Profile picture updated!" });
		} catch (error) {
			console.error("Error uploading picture:", error);
			setMessage({ type: "error", text: "Failed to upload profile picture" });
		} finally {
			setLoading(false);
		}
	};

	const handleRemovePicture = async () => {
		if (!window.confirm("Remove profile picture?")) return;

		setLoading(true);
		try {
			await api.delete("/users/profile/picture");

			// Update local state and context
			setPersonalInfo((prev) => ({ ...prev, profilePicture: null }));
			updateUser({ ...user, profile_picture_url: null });

			setMessage({ type: "success", text: "Profile picture removed!" });
		} catch (error) {
			console.error("Error removing picture:", error);
			setMessage({ type: "error", text: "Failed to remove profile picture" });
		} finally {
			setLoading(false);
		}
	};

	const handlePersonalInfoUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage({ type: "", text: "" });

		try {
			await api.put("/users/profile/personal", personalInfo);
			setMessage({
				type: "success",
				text: "Personal information updated successfully!",
			});
		} catch (error) {
			setMessage({
				type: "error",
				text: error.response?.data?.message || "Failed to update information",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleProfessionalInfoUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage({ type: "", text: "" });

		try {
			await api.put("/users/profile/professional", professionalInfo);
			setMessage({
				type: "success",
				text: "Professional information updated successfully!",
			});
		} catch (error) {
			setMessage({
				type: "error",
				text: error.response?.data?.message || "Failed to update information",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSkillsUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage({ type: "", text: "" });

		try {
			await api.put("/users/profile/skills", skillsInfo);
			setMessage({
				type: "success",
				text: "Skills and certifications updated successfully!",
			});
		} catch (error) {
			setMessage({
				type: "error",
				text: error.response?.data?.message || "Failed to update information",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleJobPreferencesUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage({ type: "", text: "" });

		try {
			await api.put("/users/profile/preferences", jobPreferences);
			setMessage({
				type: "success",
				text: "Job preferences updated successfully!",
			});
		} catch (error) {
			setMessage({
				type: "error",
				text: error.response?.data?.message || "Failed to update preferences",
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordUpdate = async (e) => {
		e.preventDefault();

		if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
			setMessage({ type: "error", text: "New passwords do not match" });
			return;
		}

		setLoading(true);
		setMessage({ type: "", text: "" });

		try {
			await api.put("/users/password", {
				currentPassword: passwordSettings.currentPassword,
				newPassword: passwordSettings.newPassword,
			});
			setMessage({ type: "success", text: "Password updated successfully!" });
			setPasswordSettings({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error) {
			setMessage({
				type: "error",
				text: error.response?.data?.message || "Failed to update password",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleNotificationUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage({ type: "", text: "" });

		try {
			await api.put("/users/notifications", notificationSettings);
			setMessage({
				type: "success",
				text: "Notification preferences updated!",
			});
		} catch (error) {
			setMessage({
				type: "error",
				text: error.response?.data?.message || "Failed to update preferences",
			});
		} finally {
			setLoading(false);
		}
	};

	// Array management helpers
	const addToArray = (field, value) => {
		if (value && !skillsInfo[field].includes(value)) {
			setSkillsInfo({
				...skillsInfo,
				[field]: [...skillsInfo[field], value],
			});
			return true;
		}
		return false;
	};

	const removeFromArray = (field, index) => {
		setSkillsInfo({
			...skillsInfo,
			[field]: skillsInfo[field].filter((_, i) => i !== index),
		});
	};

	const addCertification = () => {
		if (!newCertification.name.trim()) return;
		setSkillsInfo({
			...skillsInfo,
			certifications: [...skillsInfo.certifications, newCertification],
		});
		setNewCertification({ name: "", organization: "", date: "" });
	};

	const removeCertification = (index) => {
		setSkillsInfo({
			...skillsInfo,
			certifications: skillsInfo.certifications.filter((_, i) => i !== index),
		});
	};

	const addLanguage = () => {
		if (!newLanguage.language.trim()) return;
		setSkillsInfo({
			...skillsInfo,
			languages: [...skillsInfo.languages, newLanguage],
		});
		setNewLanguage({ language: "", proficiency: "" });
	};

	const removeLanguage = (index) => {
		setSkillsInfo({
			...skillsInfo,
			languages: skillsInfo.languages.filter((_, i) => i !== index),
		});
	};

	const addEducation = () => {
		if (!newEducation.degree.trim()) return;
		setSkillsInfo({
			...skillsInfo,
			education: [...skillsInfo.education, newEducation],
		});
		setNewEducation({ degree: "", institution: "", year: "" });
	};

	const removeEducation = (index) => {
		setSkillsInfo({
			...skillsInfo,
			education: skillsInfo.education.filter((_, i) => i !== index),
		});
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="px-4 sm:px-6 lg:px-20">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
						<p className="text-gray-500">Manage your profile and preferences</p>
					</div>

					{/* Message */}
					{message.text && (
						<div
							className={`mb-6 p-4 rounded-lg ${
								message.type === "success"
									? "bg-green-50 text-green-800 border border-green-200"
									: "bg-red-50 text-red-800 border border-red-200"
							}`}
						>
							{message.text}
						</div>
					)}

					<div className="bg-white rounded-xl shadow-sm border border-gray-200">
						<div className="border-b border-gray-200 overflow-x-auto">
							<div className="flex whitespace-nowrap px-4">
								{tabs.map((tab) => {
									const Icon = tab.icon;
									const isActive = activeTab === tab.id;
									return (
										<button
											key={tab.id}
											onClick={() => setActiveTab(tab.id)}
											className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
												isActive
													? "border-blue-600 text-blue-600"
													: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
											}`}
										>
											<Icon size={18} />
											{tab.label}
										</button>
									);
								})}
							</div>
						</div>

						<div className="p-8">
							{/* Personal Information Tab */}
							{activeTab === "personal" && (
								<form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
									{/* Profile Picture Section */}
									<div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
										<div className="relative">
											<div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md">
												{user?.profile_picture_url ? (
													<img
														src={`http://localhost:5000/${user.profile_picture_url.replace(
															/\\/g,
															"/"
														)}`}
														alt="Profile"
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-2xl font-bold">
														{user?.name?.charAt(0) ||
															user?.firstName?.charAt(0) ||
															"U"}
													</div>
												)}
											</div>
										</div>

										<div>
											<h3 className="text-sm font-semibold text-gray-900 mb-1">
												Profile Picture
											</h3>
											<p className="text-sm text-gray-500 mb-4">
												PNG, JPG up to 5MB
											</p>

											<div className="flex gap-3">
												<input
													type="file"
													ref={fileInputRef}
													onChange={handleFileChange}
													className="hidden"
													accept="image/*"
												/>
												<Button
													type="button"
													onClick={() => fileInputRef.current?.click()}
													variant="outline"
													className="text-sm"
												>
													<FiCamera size={16} className="mr-2" />
													Change Picture
												</Button>
												{user?.profile_picture_url && (
													<Button
														type="button"
														onClick={handleRemovePicture}
														variant="outline"
														className="text-red-600 hover:bg-red-50 border-red-200"
													>
														<FiTrash2 size={16} className="mr-2" />
														Remove
													</Button>
												)}
											</div>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<InputField
												label="First Name"
												value={personalInfo.firstName}
												onChange={(e) =>
													setPersonalInfo({
														...personalInfo,
														firstName: e.target.value,
													})
												}
												required
											/>
										</div>
										<div>
											<InputField
												label="Last Name"
												value={personalInfo.lastName}
												onChange={(e) =>
													setPersonalInfo({
														...personalInfo,
														lastName: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<InputField
												label="Email Address"
												type="email"
												value={personalInfo.email}
												onChange={(e) =>
													setPersonalInfo({
														...personalInfo,
														email: e.target.value,
													})
												}
												required
											/>
										</div>
										<div>
											<InputField
												label="Phone Number"
												type="tel"
												value={personalInfo.phone}
												onChange={(e) =>
													setPersonalInfo({
														...personalInfo,
														phone: e.target.value,
													})
												}
												placeholder="+1 (555) 000-0000"
												icon={FiMapPin}
											/>
										</div>
									</div>

									<div>
										<LocationCombobox
											label="Current Location"
											value={personalInfo.location}
											onChange={(value) =>
												setPersonalInfo({
													...personalInfo,
													location: value,
													// We might need to split location if we want distinct city/country fields later,
													// but for now it's a string in the state.
												})
											}
											placeholder="City, State/Country"
											icon={FiMapPin}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<InputField
												label="LinkedIn Profile"
												type="url"
												value={personalInfo.linkedIn}
												onChange={(e) =>
													setPersonalInfo({
														...personalInfo,
														linkedIn: e.target.value,
													})
												}
												placeholder="https://linkedin.com/in/yourprofile"
												icon={FiLinkedin}
											/>
										</div>
										<div>
											<InputField
												label="Portfolio/Personal Website"
												type="url"
												value={personalInfo.portfolio}
												onChange={(e) =>
													setPersonalInfo({
														...personalInfo,
														portfolio: e.target.value,
													})
												}
												placeholder="https://yourportfolio.com"
												icon={FiGlobe}
											/>
										</div>
									</div>

									<div className="flex justify-end pt-4">
										<button
											type="submit"
											disabled={loading}
											className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
										>
											{loading ? "Saving..." : "Save Changes"}
										</button>
									</div>
								</form>
							)}

							{/* Professional Background Tab */}
							{activeTab === "professional" && (
								<form
									onSubmit={handleProfessionalInfoUpdate}
									className="space-y-6"
								>
									<div className="grid md:grid-cols-3 gap-6">
										<div>
											<InputField
												label="Current Job Title"
												value={professionalInfo.currentTitle}
												onChange={(e) =>
													setProfessionalInfo({
														...professionalInfo,
														currentTitle: e.target.value,
													})
												}
												placeholder="e.g. Senior Software Engineer"
												icon={FiBriefcase}
											/>
										</div>
										<div>
											<CustomDropdown
												label="Years of Experience"
												value={professionalInfo.yearsOfExperience}
												onChange={(value) =>
													setProfessionalInfo({
														...professionalInfo,
														yearsOfExperience: value,
													})
												}
												options={[
													{ value: "0-1", label: "0-1 years" },
													{ value: "1-3", label: "1-3 years" },
													{ value: "3-5", label: "3-5 years" },
													{ value: "5-10", label: "5-10 years" },
													{ value: "10+", label: "10+ years" },
												]}
												placeholder="Select range"
											/>
										</div>
										<div>
											<CustomDropdown
												label="Experience Level"
												value={professionalInfo.experienceLevel}
												onChange={(value) =>
													setProfessionalInfo({
														...professionalInfo,
														experienceLevel: value,
													})
												}
												options={[
													{ value: "Entry", label: "Entry" },
													{ value: "Mid", label: "Mid" },
													{ value: "Senior", label: "Senior" },
													{ value: "Lead", label: "Lead" },
													{ value: "Executive", label: "Executive" },
												]}
												placeholder="Select level"
											/>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-6">
										<div>
											<InputField
												label="Current/Most Recent Company"
												value={professionalInfo.currentCompany}
												onChange={(e) =>
													setProfessionalInfo({
														...professionalInfo,
														currentCompany: e.target.value,
													})
												}
												placeholder="e.g. Google, Microsoft"
												icon={FiBriefcase}
											/>
										</div>

										<div>
											<InputField
												label="Industry/Field"
												value={professionalInfo.industry}
												onChange={(e) =>
													setProfessionalInfo({
														...professionalInfo,
														industry: e.target.value,
													})
												}
												placeholder="e.g. Technology, Healthcare, Finance"
												icon={FiBriefcase}
											/>
										</div>
									</div>

									<div>
										<InputField
											label="Professional Summary"
											value={professionalInfo.professionalSummary}
											onChange={(e) =>
												setProfessionalInfo({
													...professionalInfo,
													professionalSummary: e.target.value,
												})
											}
											multiline
											rows={4}
											placeholder="Brief description of your professional background (2-3 sentences)"
										/>
									</div>

									<div className="flex justify-end pt-4">
										<button
											type="submit"
											disabled={loading}
											className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
										>
											{loading ? "Saving..." : "Save Changes"}
										</button>
									</div>
								</form>
							)}

							{/* Skills & Certifications Tab */}
							{activeTab === "skills" && (
								<form onSubmit={handleSkillsUpdate} className="space-y-8">
									{/* Primary Skills */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Technical Skills */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-3">
												Technical Skills
											</label>
											<div className="flex gap-2 mb-3">
												<InputField
													value={tempTechnicalSkill}
													onChange={(e) =>
														setTempTechnicalSkill(e.target.value)
													}
													onKeyPress={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															if (
																addToArray(
																	"technicalSkills",
																	tempTechnicalSkill
																)
															) {
																setTempTechnicalSkill("");
															}
														}
													}}
													placeholder="Add a technical skill"
													containerClassName="flex-1"
												/>
												<button
													type="button"
													onClick={() => {
														if (
															addToArray("technicalSkills", tempTechnicalSkill)
														) {
															setTempTechnicalSkill("");
														}
													}}
													className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
												>
													<FiPlus size={18} />
													Add
												</button>
											</div>
											<div className="flex flex-wrap gap-2">
												{skillsInfo.technicalSkills.map((skill, index) => (
													<span
														key={index}
														className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium"
													>
														{skill}
														<button
															type="button"
															onClick={() =>
																removeFromArray("technicalSkills", index)
															}
															className="hover:text-green-900"
														>
															<FiX size={14} />
														</button>
													</span>
												))}
											</div>
										</div>

										{/* Soft Skills */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-3">
												Soft Skills
											</label>
											<div className="flex gap-2 mb-3">
												<InputField
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
													placeholder="Add a soft skill"
													containerClassName="flex-1"
												/>
												<Button
													type="button"
													onClick={() => {
														if (addToArray("softSkills", tempSoftSkill)) {
															setTempSoftSkill("");
														}
													}}
													className="px-4 py-2.5"
												>
													<FiPlus size={18} className="mr-2" />
													Add
												</Button>
											</div>
											<div className="flex flex-wrap gap-2">
												{skillsInfo.softSkills.map((skill, index) => (
													<span
														key={index}
														className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg flex items-center gap-2 text-sm font-medium"
													>
														{skill}
														<button
															type="button"
															onClick={() =>
																removeFromArray("softSkills", index)
															}
															className="hover:text-purple-900"
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
										<label className="block text-sm font-semibold text-gray-700 mb-3">
											Certifications
										</label>
										<div className="flex gap-3 mb-3">
											<InputField
												value={newCertification.name}
												onChange={(e) =>
													setNewCertification({
														...newCertification,
														name: e.target.value,
													})
												}
												placeholder="Certification Name"
												containerClassName="flex-1"
											/>
											<InputField
												value={newCertification.organization}
												onChange={(e) =>
													setNewCertification({
														...newCertification,
														organization: e.target.value,
													})
												}
												placeholder="Issuing Organization"
												containerClassName="flex-1"
											/>
											<InputField
												value={newCertification.date}
												onChange={(e) =>
													setNewCertification({
														...newCertification,
														date: e.target.value,
													})
												}
												placeholder="Date (e.g. 2023)"
												containerClassName="w-32"
											/>
											<Button
												type="button"
												onClick={addCertification}
												className="px-4 py-2.5"
											>
												<FiPlus size={18} />
											</Button>
										</div>
										<div className="space-y-2">
											{skillsInfo.certifications.map((cert, index) => (
												<div
													key={index}
													className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
												>
													<div>
														<p className="font-semibold text-gray-900">
															{cert.name}
														</p>
														<p className="text-sm text-gray-600">
															{cert.organization} • {cert.date}
														</p>
													</div>
													<button
														type="button"
														onClick={() => removeCertification(index)}
														className="text-red-600 hover:text-red-700"
													>
														<FiX size={18} />
													</button>
												</div>
											))}
										</div>
									</div>

									{/* Languages */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-3">
											Languages
										</label>
										<div className="flex gap-3 mb-3">
											<InputField
												value={newLanguage.language}
												onChange={(e) =>
													setNewLanguage({
														...newLanguage,
														language: e.target.value,
													})
												}
												placeholder="Language"
												containerClassName="flex-1"
											/>
											<CustomDropdown
												value={newLanguage.proficiency}
												onChange={(value) =>
													setNewLanguage({
														...newLanguage,
														proficiency: value,
													})
												}
												options={[
													{ value: "Basic", label: "Basic" },
													{ value: "Conversational", label: "Conversational" },
													{ value: "Professional", label: "Professional" },
													{ value: "Fluent", label: "Fluent" },
													{ value: "Native", label: "Native" },
												]}
												placeholder="Proficiency Level"
												className="flex-1"
											/>
											<Button
												type="button"
												onClick={addLanguage}
												className="px-4 py-2.5"
											>
												<FiPlus size={18} />
											</Button>
										</div>
										<div className="flex flex-wrap gap-2">
											{skillsInfo.languages.map((lang, index) => (
												<span
													key={index}
													className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-2 text-sm font-medium"
												>
													{lang.language} ({lang.proficiency})
													<button
														type="button"
														onClick={() => removeLanguage(index)}
														className="hover:text-indigo-900"
													>
														<FiX size={14} />
													</button>
												</span>
											))}
										</div>
									</div>

									{/* Education */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-3">
											Education
										</label>
										<div className="flex gap-3 mb-3">
											<InputField
												value={newEducation.degree}
												onChange={(e) =>
													setNewEducation({
														...newEducation,
														degree: e.target.value,
													})
												}
												placeholder="Degree"
												containerClassName="flex-1"
											/>
											<InputField
												value={newEducation.institution}
												onChange={(e) =>
													setNewEducation({
														...newEducation,
														institution: e.target.value,
													})
												}
												placeholder="Institution"
												containerClassName="flex-1"
											/>
											<InputField
												value={newEducation.year}
												onChange={(e) =>
													setNewEducation({
														...newEducation,
														year: e.target.value,
													})
												}
												placeholder="Year"
												containerClassName="w-32"
											/>
											<Button
												type="button"
												onClick={addEducation}
												className="px-4 py-2.5"
											>
												<FiPlus size={18} />
											</Button>
										</div>
										<div className="space-y-2">
											{skillsInfo.education.map((edu, index) => (
												<div
													key={index}
													className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
												>
													<div>
														<p className="font-semibold text-gray-900">
															{edu.degree}
														</p>
														<p className="text-sm text-gray-600">
															{edu.institution} • {edu.year}
														</p>
													</div>
													<button
														type="button"
														onClick={() => removeEducation(index)}
														className="text-red-600 hover:text-red-700"
													>
														<FiX size={18} />
													</button>
												</div>
											))}
										</div>
									</div>

									<div className="flex justify-end pt-4">
										<button
											type="submit"
											disabled={loading}
											className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
										>
											{loading ? "Saving..." : "Save Changes"}
										</button>
									</div>
								</form>
							)}

							{/* Job Preferences Tab */}
							{activeTab === "preferences" && (
								<form
									onSubmit={handleJobPreferencesUpdate}
									className="space-y-6"
								>
									<div>
										<InputField
											label="Desired Job Titles"
											placeholder="e.g. Software Engineer, Product Manager (comma-separated)"
										/>
									</div>

									<div>
										<InputField
											label="Preferred Locations"
											placeholder="e.g. New York, San Francisco, Remote (comma-separated)"
										/>
									</div>

									<div className="grid md:grid-cols-2 gap-6">
										<div>
											<CustomDropdown
												label="Work Mode"
												value={jobPreferences.workMode}
												onChange={(value) =>
													setJobPreferences({
														...jobPreferences,
														workMode: value,
													})
												}
												options={[
													{ value: "Remote", label: "Remote" },
													{ value: "Hybrid", label: "Hybrid" },
													{ value: "On-site", label: "On-site" },
												]}
												placeholder="Select preference"
											/>
										</div>
										<div>
											<CustomDropdown
												label="Job Type"
												value={jobPreferences.jobType}
												onChange={(value) =>
													setJobPreferences({
														...jobPreferences,
														jobType: value,
													})
												}
												options={[
													{ value: "Full-time", label: "Full-time" },
													{ value: "Part-time", label: "Part-time" },
													{ value: "Contract", label: "Contract" },
													{ value: "Freelance", label: "Freelance" },
													{ value: "Internship", label: "Internship" },
												]}
												placeholder="Select type"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Salary Range
										</label>
										<div className="grid md:grid-cols-2 gap-4">
											<InputField
												type="number"
												value={jobPreferences.salaryMin}
												onChange={(e) =>
													setJobPreferences({
														...jobPreferences,
														salaryMin: e.target.value,
													})
												}
												placeholder="Minimum ($)"
											/>
											<InputField
												type="number"
												value={jobPreferences.salaryMax}
												onChange={(e) =>
													setJobPreferences({
														...jobPreferences,
														salaryMax: e.target.value,
													})
												}
												placeholder="Maximum ($)"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Preferred Company Sizes
										</label>
										<div className="space-y-2">
											{[
												"Startup (1-50)",
												"Small (51-200)",
												"Medium (201-1000)",
												"Large (1001-5000)",
												"Enterprise (5000+)",
											].map((size) => (
												<label key={size} className="flex items-center gap-2">
													<input
														type="checkbox"
														className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
													/>
													<span className="text-sm text-gray-700">{size}</span>
												</label>
											))}
										</div>
									</div>

									<div>
										<InputField
											label="Preferred Industries"
											placeholder="e.g. Technology, Healthcare, Finance (comma-separated)"
										/>
									</div>

									<div className="flex justify-end pt-4">
										<Button type="submit" disabled={loading} className="px-8">
											{loading ? "Saving..." : "Save Preferences"}
										</Button>
									</div>
								</form>
							)}

							{/* Resume Upload Tab */}
							{activeTab === "resume" && (
								<div className="space-y-6">
									<ResumeUpload />
								</div>
							)}

							{/* Security Tab */}
							{activeTab === "security" && (
								<>
									<form onSubmit={handlePasswordUpdate} className="space-y-6">
										<div>
											<InputField
												label="Current Password"
												type="password"
												value={passwordSettings.currentPassword}
												onChange={(e) =>
													setPasswordSettings({
														...passwordSettings,
														currentPassword: e.target.value,
													})
												}
												required
											/>
										</div>
										<div>
											<InputField
												label="New Password"
												type="password"
												value={passwordSettings.newPassword}
												onChange={(e) =>
													setPasswordSettings({
														...passwordSettings,
														newPassword: e.target.value,
													})
												}
												required
											/>
										</div>
										<div>
											<InputField
												label="Confirm New Password"
												type="password"
												value={passwordSettings.confirmPassword}
												onChange={(e) =>
													setPasswordSettings({
														...passwordSettings,
														confirmPassword: e.target.value,
													})
												}
												required
											/>
										</div>

										<div className="flex justify-end pt-4">
											<Button type="submit" disabled={loading} className="px-8">
												{loading ? "Updating..." : "Update Password"}
											</Button>
										</div>
									</form>

									<div className="mt-12 pt-8 border-t border-gray-200">
										<h3 className="text-xl font-bold text-red-600 mb-4">
											Danger Zone
										</h3>
										<div className="bg-red-50 border border-red-200 rounded-lg p-6">
											<h4 className="font-semibold text-red-900 mb-2">
												Delete Account
											</h4>
											<p className="text-sm text-red-700 mb-4">
												Once you delete your account, there is no going back.
												Please be certain.
											</p>
											<Button
												type="button"
												onClick={handleDeleteAccount}
												variant="outline"
												className="text-white bg-red-600 hover:bg-red-700 border-red-600"
											>
												<FiTrash2 size={18} className="mr-2" />
												Delete Account
											</Button>
										</div>
									</div>
								</>
							)}

							{/* Notifications Tab */}
							{activeTab === "notifications" && (
								<form onSubmit={handleNotificationUpdate} className="space-y-6">
									<div className="space-y-4">
										<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
											<div>
												<h3 className="font-semibold text-gray-900">
													Email Notifications
												</h3>
												<p className="text-sm text-gray-600">
													Receive email notifications
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={notificationSettings.emailNotifications}
													onChange={(e) =>
														setNotificationSettings({
															...notificationSettings,
															emailNotifications: e.target.checked,
														})
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
											</label>
										</div>
										<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
											<div>
												<h3 className="font-semibold text-gray-900">
													Job Alerts
												</h3>
												<p className="text-sm text-gray-600">
													Get notified about new job matches
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={notificationSettings.jobAlerts}
													onChange={(e) =>
														setNotificationSettings({
															...notificationSettings,
															jobAlerts: e.target.checked,
														})
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
											</label>
										</div>
										<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
											<div>
												<h3 className="font-semibold text-gray-900">
													Application Updates
												</h3>
												<p className="text-sm text-gray-600">
													Updates on your job applications
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={notificationSettings.applicationUpdates}
													onChange={(e) =>
														setNotificationSettings({
															...notificationSettings,
															applicationUpdates: e.target.checked,
														})
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
											</label>
										</div>
										<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
											<div>
												<h3 className="font-semibold text-gray-900">
													Weekly Digest
												</h3>
												<p className="text-sm text-gray-600">
													Weekly summary of your activity
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={notificationSettings.weeklyDigest}
													onChange={(e) =>
														setNotificationSettings({
															...notificationSettings,
															weeklyDigest: e.target.checked,
														})
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
											</label>
										</div>
									</div>

									<div className="flex justify-end pt-4">
										<Button type="submit" disabled={loading} className="px-8">
											{loading ? "Saving..." : "Save Preferences"}
										</Button>
									</div>
								</form>
							)}
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Settings;
