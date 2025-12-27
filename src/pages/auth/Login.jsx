import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiMail, FiLock, FiTarget } from "react-icons/fi";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login(formData.email, formData.password);
			navigate("/dashboard");
		} catch (err) {
			setError(
				err.response?.data?.message ||
					"Failed to login. Please check your credentials."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-6">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
					{/* Header */}
					<div className="text-center mb-8">
						{/* <div className="inline-block p-3 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
							<FiTarget className="w-10 h-10 text-white" />
						</div> */}
						<h1 className="text-3xl font-bold text-blue-600 mb-2">
							Welcome Back
						</h1>
						<p className="text-gray-600 text-sm">
							Sign in to your ResuMatch account
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
							<span className="mr-2">⚠️</span> {error}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<InputField
							label="Email Address"
							icon={FiMail}
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							placeholder="Enter your email"
						/>

						<InputField
							label="Password"
							icon={FiLock}
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							placeholder="Enter your password"
						/>

						<div className="flex items-center justify-between">
							<Link
								to="/forgot-password"
								className="text-sm text-blue-600 hover:text-primary-700 font-medium transition-colors"
							>
								Forgot Password?
							</Link>
						</div>

						<Button
							type="submit"
							isLoading={loading}
							variant="primary"
							className="w-full py-3 text-lg"
						>
							Sign In
						</Button>
					</form>

					{/* Footer */}
					<div className="mt-2 text-center">
						<p className="text-gray-600 text-sm">
							Don&apos;t have an account?{" "}
							<Link
								to="/register"
								className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
							>
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
