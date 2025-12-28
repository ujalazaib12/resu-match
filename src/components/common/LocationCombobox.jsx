import { Country, City } from "country-state-city";
import { FiMapPin } from "react-icons/fi";
import PropTypes from "prop-types";
import CustomDropdown from "./CustomDropdown";

const LocationCombobox = ({
	value,
	onChange,
	placeholder = "Select Location",
	label,
	required,
	className = "w-full",
}) => {
	// Get all countries - React Compiler will optimize this
	const countries = Country.getAllCountries().map((country) => ({
		label: country.name,
		value: country.name,
		type: "country",
		code: country.isoCode,
		icon: (
			<img
				src={`https://flagcdn.com/w20/${country.isoCode.toLowerCase()}.png`}
				alt={country.name}
				className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0"
				loading="lazy"
			/>
		),
	}));

	// Calculate the selected option object to easily show flag/label
	// React Compiler will automatically optimize this
	const selectedOption = (() => {
		if (!value) return null;
		if (value === "Remote")
			return {
				label: "Remote",
				type: "special",
				code: "W",
				icon: <span className="text-lg leading-none">🌍</span>,
			};

		// Check countries
		const country = countries.find((c) => c.value === value);
		if (country) return country;

		// If not a country, it might be a city (format: "City, Country")
		if (value.includes(",")) {
			const [_cityName, countryName] = value.split(",").map((s) => s.trim());
			const foundCountry = countries.find((c) => c.label === countryName);
			if (foundCountry) {
				return {
					label: value,
					value: value,
					type: "city",
					code: foundCountry.code,
					icon: (
						<img
							src={`https://flagcdn.com/w20/${foundCountry.code.toLowerCase()}.png`}
							alt={countryName}
							className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0"
							loading="lazy"
						/>
					),
				};
			}
		}

		return { label: value, value: value, type: "unknown", code: "" };
	})();

	// Custom filter function for location search
	const filterLocationOptions = (options, searchTerm) => {
		const search = searchTerm.toLowerCase().trim();

		if (!search) {
			return options;
		}

		// Filter base options (Remote + Countries)
		let results = options.filter((opt) =>
			opt.label.toLowerCase().includes(search)
		);

		// If search is long enough, search cities
		if (search.length >= 2) {
			const allCities = City.getAllCities();
			const matchedCities = [];

			for (const city of allCities) {
				if (matchedCities.length > 50) break; // Limit city suggestions

				if (city.name.toLowerCase().includes(search)) {
					const country = countries.find((c) => c.code === city.countryCode);
					const countryName = country ? country.label : city.countryCode;

					matchedCities.push({
						label: `${city.name}, ${countryName}`,
						value: `${city.name}, ${countryName}`,
						type: "city",
						code: city.countryCode,
						badge: "City",
						icon: (
							<img
								src={`https://flagcdn.com/w20/${city.countryCode.toLowerCase()}.png`}
								alt={countryName}
								className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0"
								loading="lazy"
							/>
						),
					});
				}
			}

			results = [...results, ...matchedCities];
		}

		return results;
	};

	// Prepare options with Remote at the top - React Compiler will optimize this
	const locationOptions = [
		{
			label: "Remote",
			value: "Remote",
			type: "special",
			code: "W",
			icon: <span className="text-lg leading-none">🌍</span>,
		},
		...countries,
	];

	// Custom render function for location options
	const renderLocationOption = (option, isSelected) => (
		<div
			className={`px-4 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center ${isSelected ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
				}`}
		>
			{option.type !== "special" && option.code && (
				<img
					src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
					alt={option.label}
					className="w-5 h-3.5 object-cover mr-3 rounded-sm shadow-sm shrink-0"
					loading="lazy"
				/>
			)}
			{option.type === "special" && (
				<span className="w-5 h-5 flex items-center justify-center mr-3 text-lg leading-none shrink-0">
					🌍
				</span>
			)}
			<span className="truncate flex-1">{option.label}</span>
			{option.badge && (
				<span className="ml-auto text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
					{option.badge}
				</span>
			)}
		</div>
	);

	return (
		<div className={className}>
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}
			<CustomDropdown
				value={value}
				onChange={onChange}
				options={locationOptions}
				selectedOption={selectedOption}
				placeholder={placeholder}
				icon={FiMapPin}
				withSearch={true}
				searchPlaceholder="Type to search country or city..."
				renderOption={renderLocationOption}
				filterOptions={filterLocationOptions}
				className="h-full min-w-[100px]"
				maxHeight={400}
				hasError={false} // Add error handling if needed later
			/>
		</div>
	);
};

LocationCombobox.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	label: PropTypes.string,
	required: PropTypes.bool,
	className: PropTypes.string,
};

export default LocationCombobox;
