import { CgSpinner } from "react-icons/cg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Button = ({
	children,
	variant = "primary",
	isLoading = false,
	icon: Icon,
	rightIcon: RightIcon,
	className = "",
	disabled,
	type = "button",
	to,
	href,
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center font-semibold py-2 px-4 transition-all duration-200 uppercase text-sm cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

	const variants = {
		primary:
			"bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-blue-500 border border-transparent",
		secondary:
			"bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow-md focus:ring-gray-500",
		outline:
			"bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500",
		ghost:
			"bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
		danger:
			"bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus:ring-red-500 border border-transparent",
	};

	// Default to 'primary' if variant prop is invalid or missing
	const variantClass = variants[variant] || variants.primary;

	const classes = `
		${baseStyles}
		${variantClass}
		${className}
	`;

	const content = (
		<>
			{isLoading ? (
				<CgSpinner className="w-5 h-5 animate-spin mr-2" />
			) : Icon ? (
				<Icon className={`w-5 h-5 ${children ? "mr-2" : ""}`} />
			) : null}
			{isLoading ? "Loading..." : children}
			{!isLoading && RightIcon && (
				<RightIcon className={`w-5 h-5 ${children ? "ml-2" : ""}`} />
			)}
		</>
	);

	if (to) {
		return (
			<Link to={to} className={classes} {...props}>
				{content}
			</Link>
		);
	}

	if (href) {
		return (
			<a href={href} className={classes} {...props}>
				{content}
			</a>
		);
	}

	return (
		<button
			type={type}
			disabled={isLoading || disabled}
			className={classes}
			{...props}
		>
			{content}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf([
		"primary",
		"secondary",
		"outline",
		"ghost",
		"danger",
	]),
	size: PropTypes.oneOf(["sm", "md", "lg"]),
	isLoading: PropTypes.bool,
	icon: PropTypes.elementType,
	rightIcon: PropTypes.elementType,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	type: PropTypes.oneOf(["button", "submit", "reset"]),
	to: PropTypes.string,
	href: PropTypes.string,
};

export default Button;
