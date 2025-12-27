import React from "react";
import PropTypes from "prop-types";

const InputField = ({
	label,
	type = "text",
	placeholder,
	value,
	onChange,
	error,
	icon: Icon,
	className = "",
	...rest
}) => {
	return (
		<div className={`w-full ${className}`}>
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
					{rest.required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}
			<div className="relative">
				{Icon && (
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon className="h-5 w-5 text-gray-400" />
					</div>
				)}
				{type === "textarea" || rest.multiline ? (
					<textarea
						className={`block w-full rounded-lg border ${
							error ? "border-red-500" : "border-gray-300"
						} ${Icon ? "pl-10" : "pl-4"} ${
							rest.rightElement ? "pr-10" : "pr-4"
						} py-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm shadow-sm hover:border-blue-300 min-h-[100px] resize-y`}
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						{...rest}
					/>
				) : (
					<input
						type={type}
						className={`block w-full rounded-lg border ${
							error ? "border-red-500" : "border-gray-300"
						} ${Icon ? "pl-10" : "pl-4"} ${
							rest.rightElement ? "pr-10" : "pr-4"
						} py-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm shadow-sm hover:border-blue-300`}
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						{...rest}
					/>
				)}
				{rest.rightElement && (
					<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
						{rest.rightElement}
					</div>
				)}
			</div>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
};

InputField.propTypes = {
	label: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	error: PropTypes.string,
	icon: PropTypes.elementType,
	className: PropTypes.string,
};

export default InputField;
