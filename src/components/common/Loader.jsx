import { motion } from "framer-motion";

const Loader = () => {
	const text = "ResuMatch";

	// Animation variants for each letter
	const letterVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.1, // Stagger delay based on index
				duration: 0.5,
				ease: "easeOut",
				repeat: Infinity,
				repeatType: "reverse",
				repeatDelay: 1.5, // Pause before repeating
			},
		}),
	};

	return (
		<div className="min-h-[400px] flex flex-col items-center justify-center bg-white">
			{/* Animated Text */}
			<div className="flex items-center justify-center overflow-hidden h-16">
				{text.split("").map((char, i) => (
					<motion.span
						key={`${char}-${i}`}
						custom={i}
						initial="hidden"
						animate="visible"
						variants={letterVariants}
						className="text-4xl md:text-5xl font-black text-blue-600 mx-px"
					>
						{char}
					</motion.span>
				))}
			</div>

			<p className="mt-4 text-gray-500 font-medium">
				Finding your perfect match...
			</p>

			{/* Optional: Simple decorative elements */}
			<motion.div
				className="mt-8 flex gap-2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1 }}
			>
				<div className="w-2 h-2 rounded-full bg-blue-200 animate-bounce delay-75"></div>
				<div className="w-2 h-2 rounded-full bg-blue-300 animate-bounce delay-150"></div>
				<div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-300"></div>
			</motion.div>
		</div>
	);
};

export default Loader;
