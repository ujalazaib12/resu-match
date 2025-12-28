import axios from "axios";

const api = axios.create({
	baseURL:
		window.location.hostname === "localhost"
			? "http://localhost:5000/api"
			: "https://bountiful-elegance-production.up.railway.app/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		const isLoginRequest =
			error.config &&
			error.config.url &&
			error.config.url.includes("/users/login");
		const isLoginPage = window.location.pathname === "/login";

		if (error.response?.status === 401) {
			localStorage.removeItem("token");

			const currentPath = window.location.pathname;
			const protectedPaths = [
				"/dashboard",
				"/profile",
				"/resume",
				"/applications",
				"/settings",
				"/admin",
			];

			const isProtectedRoute = protectedPaths.some(
				(path) => currentPath.startsWith(path) || currentPath === "/jobs/saved"
			);

			if (isProtectedRoute && !isLoginRequest && !isLoginPage) {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default api;
