import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center animate-fadeIn">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                        404
                    </h1>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-xl text-gray-600 mb-8">
                    Oops! The page you're looking for doesn't exist.
                    It might have been moved or deleted.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/jobs"
                        className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transform hover:scale-105 transition-all duration-200 shadow-md"
                    >
                        Browse Jobs
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
