import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight } from "react-icons/fi";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");
		setLoading(true);

		try {
			await api.post("/auth/forgot-password", { email });
			setMessage("Password reset link has been sent to your email.");
			setEmail("");
		} catch (err) {
			setError(
				err.response?.data?.message ||
				"Failed to send reset link. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSocialLogin = (provider) => {
		// Implement social login logic here
		console.log(`Login with ${provider}`);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-12">
			<div className="max-w-md w-full">
				<div className="bg-white p-8 rounded-xl shadow-lg">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold text-blue-600 mb-2">
							Forgot Password?
						</h1>
						<p className="text-gray-600 mb-6">
							Enter your email address and we&apos;ll send you a link to reset
							your password.
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
							{error}
						</div>
					)}

					{/* Success Message */}
					{message && (
						<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
							{message}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<InputField
							label="Email Address"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="Enter your email"
						/>

						<Button
							type="submit"
							isLoading={loading}
							className="w-full"
							rightIcon={FiArrowRight}
						>
							Reset Password
						</Button>
					</form>

					<div className="mt-8 text-center">
						<p className="text-sm text-gray-600">
							Remember your password?{" "}
							<Link
								to="/login"
								className="text-blue-600 hover:text-blue-700 font-medium"
							>
								Log in
							</Link>
						</p>
					</div>

					{/* Divider */}
					<div className="relative my-8">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-white text-gray-500">or</span>
						</div>
					</div>

					{/* Social Login Buttons */}
					<div className="grid grid-cols-2 gap-4">
						<Button
							variant="secondary"
							icon={FaFacebook}
							onClick={() => handleSocialLogin("facebook")}
							className="w-full text-gray-700"
						>
							Facebook
						</Button>

						<Button
							variant="secondary"
							icon={FcGoogle}
							onClick={() => handleSocialLogin("google")}
							className="w-full text-gray-700"
						>
							Google
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
