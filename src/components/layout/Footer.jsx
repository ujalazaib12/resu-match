import { Link } from "react-router-dom";
import {
	FiTwitter,
	FiLinkedin,
	FiGithub,
	FiFacebook,
	FiMail,
	FiPhone,
	FiMapPin,
} from "react-icons/fi";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-gray-300 mt-auto">
			<div className="px-4 sm:px-6 lg:px-20 py-6">
				<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
					{/* Brand Section */}
					<div className="lg:col-span-2">
						<Link to="/" className="inline-block mb-4">
							<span className="text-2xl font-bold text-blue-500 italic">
								ResuMatch.
							</span>
						</Link>
						<p className="text-gray-400 leading-relaxed mb-4">
							AI-powered job matching platform helping you find your dream
							career. Connect with top employers and take the next step in your
							professional journey.
						</p>
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm">
								<FiMail className="text-blue-500" size={16} />
								<a
									href="mailto:info@resumatch.com"
									className="hover:text-blue-500 transition-colors"
								>
									info@resumatch.com
								</a>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<FiPhone className="text-blue-500" size={16} />
								<a
									href="tel:+12025550178"
									className="hover:text-blue-500 transition-colors"
								>
									+1-202-555-0178
								</a>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<FiMapPin className="text-blue-500" size={16} />
								<span>Washington, DC, USA</span>
							</div>
						</div>
					</div>

					{/* Product Links */}
					<div>
						<h4 className="text-blue-400 font-semibold mb-4">For Candidates</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/jobs"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Browse Jobs
								</Link>
							</li>
							<li>
								<Link
									to="/dashboard"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Dashboard
								</Link>
							</li>
							<li>
								<Link
									to="/resume"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Upload Resume
								</Link>
							</li>
							<li>
								<Link
									to="/applications"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									My Applications
								</Link>
							</li>
						</ul>
					</div>

					{/* Company Links */}
					<div>
						<h4 className="text-blue-400 font-semibold mb-4">Company</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/about"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									to="/careers"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Careers
								</Link>
							</li>
							<li>
								<Link
									to="/blog"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Blog
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h4 className="text-blue-400 font-semibold mb-4">Legal</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/privacy"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									to="/terms"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									to="/cookies"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									Cookie Policy
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="hover:text-blue-500 transition-colors duration-200 text-sm"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-400 text-sm mb-4 md:mb-0">
						&copy; {currentYear} ResuMatch. All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
							aria-label="Twitter"
						>
							<FiTwitter size={18} />
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
							aria-label="LinkedIn"
						>
							<FiLinkedin size={18} />
						</a>
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
							aria-label="Facebook"
						>
							<FiFacebook size={18} />
						</a>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
							aria-label="GitHub"
						>
							<FiGithub size={18} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
