import { useState } from "react";
import axios from "axios";

// Mock Data for Pakistani Jobs
const MOCK_JOBS = [
	{
		id: 101,
		name: "Senior Software Engineer",
		company: { name: "Systems Limited", id: 1 },
		locations: [{ name: "Lahore, Pakistan" }],
		levels: [{ name: "Mid Level" }],
		contents:
			"<p>We are looking for a Senior Software Engineer with expertise in .NET and Angular...</p>",
		publication_date: new Date().toISOString(),
		type: "Full Time",
	},
	{
		id: 102,
		name: "MERN Stack Developer",
		company: { name: "Arbisoft", id: 2 },
		locations: [{ name: "Lahore, Pakistan" }],
		levels: [{ name: "Senior Level" }],
		contents:
			"<p>Arbisoft is hiring a talented MERN Stack Developer to join our dynamic team...</p>",
		publication_date: new Date().toISOString(),
		type: "Full Time",
	},
	{
		id: 103,
		name: "SQA Engineer",
		company: { name: "10Pearls", id: 3 },
		locations: [{ name: "Karachi, Pakistan" }],
		levels: [{ name: "Entry Level" }],
		contents:
			"<p>Join 10Pearls as an SQA Engineer. Experience with automation testing is a plus...</p>",
		publication_date: new Date().toISOString(),
		type: "Full Time",
	},
	{
		id: 104,
		name: "Product Manager",
		company: { name: "Sadapay", id: 4 },
		locations: [{ name: "Islamabad, Pakistan" }],
		levels: [{ name: "Senior Level" }],
		contents:
			"<p>Sadapay is looking for a Product Manager to lead our fintech innovations...</p>",
		publication_date: new Date().toISOString(),
		type: "Full Time",
	},
	{
		id: 105,
		name: "React Native Developer",
		company: { name: "Contour Software", id: 5 },
		locations: [{ name: "Lahore, Pakistan" }],
		levels: [{ name: "Mid Level" }],
		contents:
			"<p>Contour Software is seeking a React Native Developer for mobile app development...</p>",
		publication_date: new Date().toISOString(),
		type: "Full Time",
	},
	{
		id: 106,
		name: "UI/UX Designer",
		company: { name: "Folio3", id: 6 },
		locations: [{ name: "Karachi, Pakistan" }],
		levels: [{ name: "Mid Level" }],
		contents:
			"<p>Folio3 needs a creative UI/UX Designer with a strong portfolio...</p>",
		publication_date: new Date().toISOString(),
		type: "Contract",
	},
];

export const useMuseAPI = () => {
	// NOTE: To use Real Pakistani Jobs, sign up for JSearch on RapidAPI.
	// 1. Get Key: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
	// 2. Add VITE_RAPIDAPI_KEY=your_key to .env
	const RAPID_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
	const RAPID_API_HOST = "jsearch.p.rapidapi.com";

	const searchJobs = async (params) => {
		// If RapidAPI Key is present, use JSearch (Real Data)
		if (RAPID_API_KEY) {
			try {
				const options = {
					method: "GET",
					url: "https://jsearch.p.rapidapi.com/search",
					params: {
						query: `${params.query || "Software Engineer"} in ${
							params.location || "Pakistan"
						}`,
						page: params.page || "1",
						num_pages: "1",
					},
					headers: {
						"X-RapidAPI-Key": RAPID_API_KEY,
						"X-RapidAPI-Host": RAPID_API_HOST,
					},
				};

				const response = await axios.request(options);
				// Map JSearch response to match our app structure
				const results = response.data.data.map((job) => ({
					id: job.job_id,
					name: job.job_title,
					company: { name: job.employer_name, logo: job.employer_logo },
					locations: [
						{ name: `${job.job_city || ""}, ${job.job_country || ""}` },
					],
					levels: [{ name: job.job_employment_type }],
					contents: job.job_description,
					publication_date: job.job_posted_at_datetime_utc,
					refs: { landing_page: job.job_apply_link },
				}));

				return {
					results: results,
					page_count: 5, // JSearch doesn't always give page count easily
					page: params.page || 1,
				};
			} catch (error) {
				console.error("JSearch API Error:", error);
				// Fallback to mock data on error/limit reached
			}
		}

		// FALLBACK: Mock Data Filtering
		let filtered = [...MOCK_JOBS];

		if (params.query) {
			const q = params.query.toLowerCase();
			filtered = filtered.filter(
				(job) =>
					job.name.toLowerCase().includes(q) ||
					job.company.name.toLowerCase().includes(q)
			);
		}

		if (params.location) {
			const l = params.location.toLowerCase();
			filtered = filtered.filter((job) =>
				job.locations.some((loc) => loc.name.toLowerCase().includes(l))
			);
		}

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					results: filtered,
					page_count: 1,
					page: 1,
				});
			}, 500); // Simulate network delay
		});
	};

	const getJobById = async (jobId) => {
		// 1. Check Mock Data First
		const mockJob = MOCK_JOBS.find((j) => j.id == jobId);
		if (mockJob) {
			return new Promise((resolve) => resolve(mockJob));
		}

		// 2. Fetch from JSearch if enabled
		if (RAPID_API_KEY) {
			try {
				const options = {
					method: "GET",
					url: "https://jsearch.p.rapidapi.com/job-details",
					params: { job_id: jobId, extended_publisher_details: "false" },
					headers: {
						"X-RapidAPI-Key": RAPID_API_KEY,
						"X-RapidAPI-Host": RAPID_API_HOST,
					},
				};

				const response = await axios.request(options);
				const jobData = response.data.data[0];

				if (jobData) {
					return {
						id: jobData.job_id,
						name: jobData.job_title,
						company: {
							name: jobData.employer_name,
							logo: jobData.employer_logo,
						},
						locations: [
							{
								name: `${jobData.job_city || ""}, ${jobData.job_country || ""}`,
							},
						],
						levels: [{ name: jobData.job_employment_type }],
						contents: jobData.job_description,
						publication_date: jobData.job_posted_at_datetime_utc,
						refs: { landing_page: jobData.job_apply_link },
					};
				}
			} catch (error) {
				console.error("JSearch Details Error:", error);
			}
		}

		return null;
	};

	const getCompanies = async () => {
		return new Promise((resolve) => resolve([]));
	};

	return {
		searchJobs,
		getJobById,
		getCompanies,
	};
};
