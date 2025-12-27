import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RecommendedJobs from '../../components/dashboard/RecommendedJobs';
import { FiBriefcase, FiBookmark, FiBell, FiArrowRight, FiCheck, FiMapPin } from 'react-icons/fi';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        appliedJobs: 0,
        savedJobs: 0,
        recommendations: 0
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, applicationsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/applications?limit=5')
            ]);

            setStats(statsRes.data);
            setRecentApplications(applicationsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Hello, {user?.name || `${user?.firstName} ${user?.lastName}`}
                        </h1>
                        <p className="text-gray-500">Here is your daily activities and job alerts</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 rounded-xl p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.appliedJobs}</h3>
                                <p className="text-gray-600 font-medium">Applied jobs</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <FiBriefcase className="text-2xl text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.savedJobs}</h3>
                                <p className="text-gray-600 font-medium">Favorite jobs</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <FiBookmark className="text-2xl text-orange-500" />
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-xl p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">574</h3>
                                <p className="text-gray-600 font-medium">Job Alerts</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <FiBell className="text-2xl text-green-500" />
                            </div>
                        </div>
                    </div>

                    {/* Recommended Jobs */}
                    <div className="mb-8">
                        <RecommendedJobs />
                    </div>

                    {/* Profile Banner */}
                    <div className="bg-red-500 rounded-xl p-6 mb-8 flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
                                {user?.profile_picture_url ? (
                                    <img
                                        src={`http://localhost:5000/${user.profile_picture_url.replace(/\\/g, '/')}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Your profile editing is not completed.</h3>
                                <p className="text-red-100 text-sm">Complete your profile editing & build your custom Resume</p>
                            </div>
                        </div>
                        <Link to="/settings" className="bg-white text-red-500 px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                            Edit Profile <FiArrowRight />
                        </Link>
                    </div>

                    {/* Recently Applied */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Recently Applied</h2>
                            <Link
                                to="/applications"
                                className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center gap-1"
                            >
                                View all <FiArrowRight />
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-500 border-b border-gray-100">
                                <div className="col-span-5">Job</div>
                                <div className="col-span-3">Date Applied</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Action</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {recentApplications.map((application) => (
                                    <div key={application.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                                        <div className="col-span-5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                                                {application.company.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900">{application.jobTitle}</h3>
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">Full Time</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1"><FiMapPin size={12} /> {application.location || 'Remote'}</span>
                                                    <span>$50k-80k/month</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 text-sm text-gray-500">
                                            {new Date(application.appliedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                <FiCheck /> Active
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <Link
                                                to={`/jobs/${application.jobId}`}
                                                className="inline-block px-4 py-2 bg-gray-100 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {recentApplications.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">
                                        No applications yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
