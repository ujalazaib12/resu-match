import { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import PropTypes from "prop-types";

/**
 * CustomDropdown - A reusable animated dropdown component
 *
 * @param {Object} props
 * @param {string} props.value - Currently selected value
 * @param {Function} props.onChange - Callback when selection changes
 * @param {Array} props.options - Array of options { label, value, icon?, badge?, ...customData }
 * @param {Object} props.selectedOption - Optional pre-computed selected option (overrides finding in options)
 * @param {string} props.placeholder - Placeholder text when no value selected
 * @param {React.Component} props.icon - Icon component to show on the left
 * @param {boolean} props.withSearch - Enable search functionality
 * @param {string} props.searchPlaceholder - Placeholder for search input
 * @param {Function} props.renderOption - Custom render function for options
 * @param {Function} props.filterOptions - Custom filter function for search
 * @param {string} props.className - Additional classes for the wrapper
 * @param {number} props.maxHeight - Max height for dropdown menu
 */
const CustomDropdown = ({
	value,
	onChange,
	options = [],
	selectedOption: providedSelectedOption,
	placeholder = "Select option",
	icon: Icon,
	withSearch = false,
	searchPlaceholder = "Type to search...",
	renderOption,
	filterOptions,
	className = "",
	maxHeight = 400,
	label,
	required,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const wrapperRef = useRef(null);

	// Find selected option - use provided one or find in options
	const selectedOption =
		providedSelectedOption || options.find((opt) => opt.value === value);

	// Filter options based on search
	const filteredOptions =
		withSearch && searchTerm
			? filterOptions
				? filterOptions(options, searchTerm)
				: options.filter((opt) =>
					opt.label.toLowerCase().includes(searchTerm.toLowerCase())
				)
			: options;

	// Handle outside click to close dropdown
	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (option) => {
		onChange(option.value);
		setSearchTerm("");
		setIsOpen(false);
	};

	// Default option renderer
	const defaultRenderOption = (option, isSelected) => (
		<div
			className={`px-4 py-2.5 text-sm cursor-pointer rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center ${isSelected ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
				}`}
		>
			{option.icon && <span className="mr-3">{option.icon}</span>}
			<span className="truncate flex-1">{option.label}</span>
			{option.badge && (
				<span className="ml-auto text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
					{option.badge}
				</span>
			)}
		</div>
	);

	const optionRenderer = renderOption || defaultRenderOption;

	return (
		<div className={`relative ${className}`} ref={wrapperRef}>
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}
			{/* Trigger Button */}
			<div
				className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
				onClick={() => setIsOpen(!isOpen)}
			>
				{Icon && <Icon className="text-gray-400 mr-2" size={16} />}
				{selectedOption?.icon && (
					<span className="mr-2">{selectedOption.icon}</span>
				)}
				<span className="flex-1 text-sm text-gray-700 truncate select-none">
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<FiChevronDown
					className={`text-gray-400 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
						}`}
					size={16}
				/>
			</div>

			{/* Animated Dropdown */}
			<AnimatePresence>
				{isOpen && (
					<Motion.div
						initial={{ opacity: 0, y: 10, scaleY: 0.9 }}
						animate={{ opacity: 1, y: 0, scaleY: 1 }}
						exit={{ opacity: 0, y: 10, scaleY: 0.9 }}
						transition={{ duration: 0.2 }}
						className="absolute top-full left-0 mt-2 px-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top flex flex-col"
						style={{ maxHeight: `${maxHeight}px` }}
					>
						{/* Search Input (if enabled) */}
						{withSearch && (
							<div className="px-3 pb-2 border-b border-gray-100 shrink-0">
								<div className="relative">
									<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<input
										type="text"
										className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
										placeholder={searchPlaceholder}
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										autoFocus
										onClick={(e) => e.stopPropagation()}
									/>
								</div>
							</div>
						)}

						{/* Options List */}
						<div className="overflow-y-auto pt-1 custom-scrollbar">
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option, index) => (
									<div
										key={option.value || index}
										onClick={() => handleSelect(option)}
										className="cursor-pointer"
									>
										{optionRenderer(option, value === option.value)}
									</div>
								))
							) : (
								<div className="px-4 py-8 text-sm text-gray-500 text-center flex flex-col items-center">
									<span className="text-2xl mb-2">🤔</span>
									No options found
								</div>
							)}
						</div>
					</Motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

CustomDropdown.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
			icon: PropTypes.node,
			badge: PropTypes.string,
		})
	).isRequired,
	selectedOption: PropTypes.shape({
		label: PropTypes.string.isRequired,
		value: PropTypes.string.isRequired,
		icon: PropTypes.node,
		badge: PropTypes.string,
	}),
	placeholder: PropTypes.string,
	icon: PropTypes.elementType,
	withSearch: PropTypes.bool,
	searchPlaceholder: PropTypes.string,
	renderOption: PropTypes.func,
	filterOptions: PropTypes.func,
	className: PropTypes.string,
	maxHeight: PropTypes.number,
	label: PropTypes.string,
	required: PropTypes.bool,
};

export default CustomDropdown;
