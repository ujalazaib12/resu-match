import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';

const ResumeUpload = () => {
    const { user, updateUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setUploading(true);
        try {
            const response = await api.post('/users/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update user state with new resume and parsed skills
            updateUser(response.data.user);

            if (response.data.warning) {
                setMessage({ type: 'warning', text: response.data.message });
            } else {
                setMessage({ type: 'success', text: `Resume uploaded! Extracted ${response.data.extractedSkills.length} skills.` });
            }

        } catch (error) {
            console.error('Resume upload error:', error);
            setMessage({ type: 'error', text: 'Failed to upload/parse resume.' });
        } finally {
            setUploading(false);
        }
    };

    // Safely access skills
    const skills = user?.skills?.primary ?
        (typeof user.skills.primary === 'string' ? JSON.parse(user.skills.primary) : user.skills.primary)
        : [];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

            {/* Status Message */}
            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' :
                    message.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors relative">
                <input
                    type="file"
                    onChange={handleResumeUpload}
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUploadCloud size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                    {uploading ? 'Processing Resume...' : 'Upload your Resume'}
                </h3>
                <p className="text-gray-500 mt-2">
                    Drop your PDF here or click to browse. We will extract skills automatically.
                </p>
            </div>

            {/* Current Stats */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <FiFileText className="text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Current Resume</h4>
                    </div>
                    {user?.resume_url ? (
                        <a
                            href={`http://localhost:5000/${user.resume_url.replace(/\\/g, '/')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate block"
                        >
                            View Uploaded Resume
                        </a>
                    ) : (
                        <p className="text-sm text-gray-500">No resume uploaded yet.</p>
                    )}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <FiCheckCircle className="text-green-600" />
                        <h4 className="font-semibold text-gray-900">Extracted Skills</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                            skills.map((skill, idx) => (
                                <span key={idx} className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-medium text-gray-700">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No skills extracted yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
