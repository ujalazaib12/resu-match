import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiX, FiFile } from "react-icons/fi";
import PropTypes from "prop-types";

const FileUpload = ({
	label,
	onChange,
	value,
	accept = "image/*",
	className = "",
	required,
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef(null);

	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			const file = files[0];
			// Basic check for image if accept is image/*
			if (accept === "image/*" && !file.type.startsWith("image/")) {
				alert("Please upload an image file");
				return;
			}
			onChange(file);
		}
	};

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			onChange(e.target.files[0]);
		}
	};

	const removeFile = (e) => {
		e.stopPropagation();
		onChange(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const isImage = value?.type?.startsWith("image/");
	const previewUrl = value && isImage ? URL.createObjectURL(value) : null;

	return (
		<div className={`w-full ${className}`}>
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			<div
				className={`relative border-2 border-dashed rounded-lg transition-colors duration-200 cursor-pointer overflow-hidden ${
					isDragging
						? "border-blue-500 bg-blue-50"
						: "border-gray-300 bg-gray-50 hover:bg-gray-100"
				} ${value ? "p-2" : "p-6"}`}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current?.click()}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept={accept}
					onChange={handleFileSelect}
					className="hidden"
				/>

				<AnimatePresence mode="wait">
					{value ? (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 shadow-sm"
						>
							<div className="flex items-center gap-3 overflow-hidden">
								{isImage ? (
									<img
										src={previewUrl}
										alt="Preview"
										className="w-10 h-10 object-cover rounded bg-gray-100"
									/>
								) : (
									<div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
										<FiFile size={20} />
									</div>
								)}
								<div className="flex flex-col overflow-hidden">
									<span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
										{value.name}
									</span>
									<span className="text-xs text-gray-500">
										{(value.size / 1024 / 1024).toFixed(2)} MB
									</span>
								</div>
							</div>
							<button
								type="button"
								onClick={removeFile}
								className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
							>
								<FiX size={18} />
							</button>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="text-center"
						>
							<FiUploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
							<p className="text-sm text-gray-600 font-medium">
								Click to upload or drag and drop
							</p>
							<p className="text-xs text-gray-500 mt-1">
								{accept === "image/*"
									? "MAX. 5MB (JPG, PNG)"
									: "MAX. 5MB (JPG, PNG, PDF)"}
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

FileUpload.propTypes = {
	label: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.object,
	accept: PropTypes.string,
	className: PropTypes.string,
	required: PropTypes.bool,
};

export default FileUpload;
