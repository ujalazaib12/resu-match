import DashboardLayout from '../../components/layout/DashboardLayout';
import ResumeUpload from '../../components/dashboard/ResumeUpload';

const Resume = () => {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Resume Management</h1>
                <ResumeUpload />
            </div>
        </DashboardLayout>
    );
};

export default Resume;
