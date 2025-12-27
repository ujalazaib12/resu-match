import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import DashboardLayout from '../../components/layout/DashboardLayout';

const Profile = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    const {
        name, email, phone, location,
        job_title, professional_summary,
        skills, job_preferences, resume_url
    } = user || {};

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                        <Link
                            to="/settings"
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    {/* Personal Information */}
                    <section className="bg-white rounded-xl shadow-md p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                                <p className="text-lg text-gray-900">{name || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                                <p className="text-lg text-gray-900">{email || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                                <p className="text-lg text-gray-900">{phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
                                <p className="text-lg text-gray-900">{location || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Current Job Title</label>
                                <p className="text-lg text-gray-900">{job_title || 'Not provided'}</p>
                            </div>
                        </div>
                        {professional_summary && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Professional Summary</label>
                                <p className="text-gray-800 leading-relaxed">{professional_summary}</p>
                            </div>
                        )}
                    </section>

                    {/* Skills Section */}
                    <section className="bg-white rounded-xl shadow-md p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>

                        {Array.isArray(skills?.primary) && skills.primary.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Primary Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.primary.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {Array.isArray(skills?.technical) && skills.technical.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Technical Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.technical.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(!Array.isArray(skills?.primary) || skills.primary.length === 0) &&
                            (!Array.isArray(skills?.technical) || skills.technical.length === 0) && (
                                <p className="text-gray-500 italic">No skills added yet.</p>
                            )}
                    </section>

                    {/* Job Preferences */}
                    <section className="bg-white rounded-xl shadow-md p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Preferences</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Desired Job Titles</label>
                                <p className="text-lg text-gray-900">
                                    {Array.isArray(job_preferences?.jobTitles) ? job_preferences.jobTitles.join(', ') : 'Not set'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Preferred Locations</label>
                                <p className="text-lg text-gray-900">
                                    {Array.isArray(job_preferences?.locations) ? job_preferences.locations.join(', ') : 'Not set'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Work Mode</label>
                                <p className="text-lg text-gray-900">
                                    {Array.isArray(job_preferences?.workMode) ? job_preferences.workMode.join(', ') : 'Not set'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Expected Salary</label>
                                <p className="text-lg text-gray-900">
                                    {job_preferences?.salary?.min && job_preferences?.salary?.max
                                        ? `${job_preferences.salary.currency || '$'} ${job_preferences.salary.min} - ${job_preferences.salary.max}`
                                        : 'Not set'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Resume Section */}
                    <section className="bg-white rounded-xl shadow-md p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Resume</h2>
                            <Link
                                to="/settings"
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Manage Resume
                            </Link>
                        </div>

                        {resume_url ? (
                            <div>
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
                                    <div className="text-4xl mr-4">📄</div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">Resume Uploaded</p>
                                        {typeof resume_url === 'string' && (
                                            <a
                                                href={`http://localhost:5000/${resume_url.replace(/\\/g, '/')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                                            >
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                    <span className="text-green-600 font-medium flex items-center gap-1">
                                        ✓ Uploaded
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">📄</div>
                                <p className="text-gray-600 mb-4">No resume uploaded yet</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
