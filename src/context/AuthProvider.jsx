import { useState, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(() => !!localStorage.getItem("token"));
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const checkAuth = async () => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const response = await api.get("/users/me");
				setUser(response.data);
				setIsAuthenticated(true);
			} catch {
				localStorage.removeItem("token");
				setIsAuthenticated(false);
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const login = async (email, password) => {
		const response = await api.post("/users/login", { email, password });
		// Backend returns: { id, name, email, token }
		const { token, ...userData } = response.data;

		if (token) {
			localStorage.setItem("token", token);
			setUser(userData);
			setIsAuthenticated(true);
		} else {
			// Fallback if no token is returned (shouldn't happen on success usually)
			throw new Error("No authentication token received");
		}

		return userData;
	};

	const register = async (userData) => {
		let payload = userData;
		let headers = {};

		if (!(userData instanceof FormData)) {
			payload = {
				name: `${userData.firstName} ${userData.lastName}`,
				email: userData.email,
				password: userData.password,
			};
		} else {
			headers = { "Content-Type": "multipart/form-data" };
		}

		const response = await api.post("/users/register", payload, { headers });
		const { token, ...newUserData } = response.data;

		localStorage.setItem("token", token);
		setUser(newUserData);
		setIsAuthenticated(true);

		return newUserData;
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		setIsAuthenticated(false);
	};

	const updateUser = (updatedUser) => {
		setUser(updatedUser);
	};

	const value = {
		user,
		loading,
		isAuthenticated,
		login,
		register,
		logout,
		updateUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
