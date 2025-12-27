import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import PropTypes from "prop-types";
import { JobContext } from "./JobContext";

export const JobProvider = ({ children }) => {
	const { isAuthenticated } = useAuth();
	const [savedJobs, setSavedJobs] = useState([]);
	const [applications, setApplications] = useState([]);

	const fetchSavedJobs = useCallback(async () => {
		try {
			const response = await api.get("/jobs/saved");
			setSavedJobs(response.data);
		} catch (error) {
			console.error("Error fetching saved jobs:", error);
		}
	}, []);

	const fetchApplications = useCallback(async () => {
		try {
			const response = await api.get("/applications");
			setApplications(response.data);
		} catch (error) {
			console.error("Error fetching applications:", error);
		}
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			const fetchData = async () => {
				await fetchSavedJobs();
				await fetchApplications();
			};
			fetchData();
		}
	}, [isAuthenticated, fetchSavedJobs, fetchApplications]);

	const saveJob = async (job) => {
		try {
			await api.post(`/jobs/${job.id}/save`, job);
			setSavedJobs([...savedJobs, job]);
		} catch (error) {
			console.error("Error saving job:", error);
			throw error;
		}
	};

	const unsaveJob = async (jobId) => {
		try {
			await api.delete(`/jobs/${jobId}/save`);
			setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
		} catch (error) {
			console.error("Error unsaving job:", error);
			throw error;
		}
	};

	const applyToJob = async (applicationData) => {
		try {
			const response = await api.post("/applications", applicationData);
			setApplications([...applications, response.data]);
			return response.data;
		} catch (error) {
			console.error("Error applying to job:", error);
			throw error;
		}
	};

	const value = {
		savedJobs: isAuthenticated ? savedJobs : [],
		applications: isAuthenticated ? applications : [],
		saveJob,
		unsaveJob,
		applyToJob,
		refreshSavedJobs: fetchSavedJobs,
		refreshApplications: fetchApplications,
	};

	return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

JobProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
