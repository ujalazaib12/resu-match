import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { JobProvider } from "./context/JobProvider";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Resume from "./pages/dashboard/Resume";
import Applications from "./pages/dashboard/Applications";
import Settings from "./pages/dashboard/Settings";

// Job Pages
import JobSearch from "./pages/jobs/JobSearch";
import JobDetails from "./pages/jobs/JobDetails";
import SavedJobs from "./pages/jobs/SavedJobs";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

function AppContent() {
	const location = useLocation();
	const isDashboard =
		location.pathname.startsWith("/dashboard") ||
		location.pathname.startsWith("/admin") ||
		location.pathname.startsWith("/jobs/saved") ||
		location.pathname.startsWith("/profile") ||
		location.pathname.startsWith("/resume") ||
		location.pathname.startsWith("/applications") ||
		location.pathname.startsWith("/settings");

	const hideFooter = isDashboard;

	return (
		<div className="app flex flex-col h-screen overflow-hidden">
			<Navbar />
			<main
				className={`flex-1 min-w-0 flex flex-col ${isDashboard ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden"
					}`}
			>
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password" element={<ResetPassword />} />

					{/* Job Routes (Public) */}
					<Route path="/jobs" element={<JobSearch />} />
					<Route path="/jobs/:id" element={<JobDetails />} />

					{/* Protected Routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/resume"
						element={
							<ProtectedRoute>
								<Resume />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/applications"
						element={
							<ProtectedRoute>
								<Applications />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/jobs/saved"
						element={
							<ProtectedRoute>
								<SavedJobs />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/settings"
						element={
							<ProtectedRoute>
								<Settings />
							</ProtectedRoute>
						}
					/>

					{/* Admin Routes */}
					<Route
						path="/admin"
						element={
							<ProtectedRoute adminOnly={true}>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/users"
						element={
							<ProtectedRoute adminOnly={true}>
								<UserManagement />
							</ProtectedRoute>
						}
					/>

					{/* 404 Route */}
					<Route path="*" element={<NotFound />} />
				</Routes>
				{/* {!hideFooter && <Footer />} */}
			</main>
		</div>
	);
}

function App() {
	return (
		<Router>
			<ScrollToTop />
			<AuthProvider>
				<JobProvider>
					<AppContent />
				</JobProvider>
			</AuthProvider>
		</Router>
	);
}

export default App;
