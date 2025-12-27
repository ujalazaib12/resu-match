export const formatJobDescription = (content) => {
	if (!content) return "";

	// If it's already HTML (contains <p>, <ul>, <br>), trust it but clean it
	if (/<[a-z][\s\S]*>/i.test(content)) {
		return content;
	}

	// Otherwise, it's likely a text blob. Let's format it.
	let formatted = content;

	// 1. Split headers (e.g., "Responsibilities:", "Requirements:")
	const headers = [
		"Responsibilities:",
		"Requirements:",
		"Qualifications:",
		"What We Offer:",
		"Job Description:",
		"Key Skills:",
		"Nice to Have:",
		"About Us:",
	];

	headers.forEach((header) => {
		// Add double break and wrap header in strong tag
		const regex = new RegExp(`(${header})`, "gi");
		formatted = formatted.replace(
			regex,
			"<br/><br/><strong class='text-gray-900 block mb-2 text-lg'>$1</strong>"
		);
	});

	// 2. Handle bullet points (•, -, or *)
	// We look for a bullet char followed by text until the next punctuation or bullet
	// const bulletRegex = /([•\-\*])\s*([^•\-\*]+)/g;

	// Better approach: Split by newline first if possible, or just replace bullets with list items
	// Since the screenshot shows a wall of text without newlines, we might have to force split

	formatted = formatted.replace(/•\s*/g, "<br/>• ");
	formatted = formatted.replace(/(?<=\.)\s+(?=[A-Z])/g, "<br/><br/>"); // Add spacing between sentences if they look like paragraphs

	// Convert specific bullet chars to styled spans/lists
	formatted = formatted.replace(
		/<br\/>•\s*([^<]+)/g,
		// Using a span with a bullet entity that's easier to style than an SVG in a string
		"<div class='flex items-start gap-3 ml-2'><span class='text-blue-500 text-lg leading-none mt-1'>•</span><span class='flex-1 leading-relaxed text-gray-700'>$1</span></div>"
	);

	return formatted;
};
