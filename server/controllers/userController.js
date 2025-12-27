const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    console.log("Register request received");
    try {
        const {
            name, email, password,
            phone, location, linkedin, portfolio,
            jobTitle, yearsOfExperience, experienceLevel, currentCompany, industry, professionalSummary,
            // JSON strings for arrays
            primarySkills, secondarySkills, technicalSkills, softSkills, certifications, languages, education,
            desiredJobTitles, preferredLocations, workMode, jobType, salaryMin, salaryMax, salaryCurrency, companySize, preferredIndustries
        } = req.body;

        console.log("Register payload parsed:", { name, email, hasPassword: !!password });

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please include all required fields' });
        }

        // Check if user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log("User does not exist, proceeding...");

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Password hashed");

        // Helper to safe parse JSON
        const safeParse = (jsonString) => {
            try {
                if (!jsonString) return [];
                // If it's already an object (sometimes body parser does this), return it
                if (typeof jsonString === 'object') return jsonString;
                return JSON.parse(jsonString);
            } catch (e) {
                console.error("JSON Parse Error for:", jsonString, e);
                return [];
            }
        };

        // Handle File Uploads
        const resumeUrl = req.files && req.files['resume'] ? req.files['resume'][0].path : null;
        const profilePictureUrl = req.files && req.files['profilePicture'] ? req.files['profilePicture'][0].path : null;

        console.log("Files processed:", { resumeUrl, profilePictureUrl });

        // Construct JSONB objects safely
        const skillsData = {
            primary: safeParse(primarySkills),
            secondary: safeParse(secondarySkills),
            technical: safeParse(technicalSkills),
            soft: safeParse(softSkills),
            certifications: safeParse(certifications),
            languages: safeParse(languages)
        };

        const educationData = safeParse(education);

        const jobPreferencesData = {
            jobTitles: safeParse(desiredJobTitles),
            locations: safeParse(preferredLocations),
            workMode: safeParse(workMode),
            jobType: safeParse(jobType),
            salary: {
                min: salaryMin || null,
                max: salaryMax || null,
                currency: salaryCurrency || 'USD'
            },
            companySize: safeParse(companySize),
            industries: safeParse(preferredIndustries)
        };

        console.log("Inserting user into DB...");

        // Create user
        const query = `
            INSERT INTO users (
                name, email, password, 
                phone, location, linkedin_profile, portfolio_website,
                job_title, years_of_experience, experience_level, current_company, industry, professional_summary,
                skills, education, job_preferences,
                resume_url, profile_picture_url
            ) VALUES (
                $1, $2, $3, 
                $4, $5, $6, $7,
                $8, $9, $10, $11, $12, $13,
                $14, $15, $16,
                $17, $18
            ) RETURNING *`;

        const values = [
            name, email, hashedPassword,
            phone, location, linkedin, portfolio,
            jobTitle, yearsOfExperience, experienceLevel, currentCompany, industry, professionalSummary,
            JSON.stringify(skillsData),
            JSON.stringify(educationData),
            JSON.stringify(jobPreferencesData),
            resumeUrl, profilePictureUrl
        ];

        const newUser = await pool.query(query, values);

        console.log("User retrieved from DB, sending response");

        res.status(201).json({
            id: newUser.rows[0].id,
            name: newUser.rows[0].name,
            email: newUser.rows[0].email,
            profile_picture_url: newUser.rows[0].profile_picture_url,
            role: newUser.rows[0].role,
            token: generateToken(newUser.rows[0].id),
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
            profile_picture_url: user.rows[0].profile_picture_url,
            role: user.rows[0].role,
            token: generateToken(user.rows[0].id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// Update Personal Information
const updatePersonal = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, location, linkedIn, portfolio } = req.body;
        const name = `${firstName} ${lastName}`.trim();

        const query = `
            UPDATE users SET 
            name = $1, email = $2, phone = $3, location = $4, 
            linkedin_profile = $5, portfolio_website = $6
            WHERE id = $7
            RETURNING *`;

        const values = [name, email, phone, location, linkedIn, portfolio, req.user.id];
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Professional Background
const updateProfessional = async (req, res) => {
    try {
        const { currentTitle, yearsOfExperience, experienceLevel, currentCompany, industry, professionalSummary } = req.body;

        const query = `
            UPDATE users SET 
            job_title = $1, years_of_experience = $2, experience_level = $3, 
            current_company = $4, industry = $5, professional_summary = $6
            WHERE id = $7
            RETURNING *`;

        const values = [currentTitle, yearsOfExperience, experienceLevel, currentCompany, industry, professionalSummary, req.user.id];
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Skills & Education
const updateSkills = async (req, res) => {
    try {
        const {
            education,
            primarySkills, secondarySkills, technicalSkills, softSkills,
            certifications, languages
        } = req.body;

        const skillsData = {
            primary: primarySkills,
            secondary: secondarySkills,
            technical: technicalSkills,
            soft: softSkills,
            certifications: certifications,
            languages: languages
        };

        const query = `
            UPDATE users SET 
            skills = $1, education = $2
            WHERE id = $3
            RETURNING *`;

        const values = [JSON.stringify(skillsData), JSON.stringify(education), req.user.id];
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Job Preferences
const updatePreferences = async (req, res) => {
    try {
        const {
            salaryMin, salaryMax,
            desiredTitles, preferredLocations, companySizes, preferredIndustries,
            ...rest
        } = req.body;

        const preferences = {
            ...rest,
            jobTitles: desiredTitles,
            locations: preferredLocations,
            companySize: companySizes,
            industries: preferredIndustries,
            salary: {
                min: salaryMin,
                max: salaryMax,
                currency: 'USD'
            }
        };

        const query = `
            UPDATE users SET 
            job_preferences = $1
            WHERE id = $2
            RETURNING *`;

        const values = [JSON.stringify(preferences), req.user.id];
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
        if (!await bcrypt.compare(currentPassword, user.rows[0].password)) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Notifications (Mock)
const updateNotifications = async (req, res) => {
    res.json({ message: 'Notifications updated' });
};

// Update Profile Picture
const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const profilePictureUrl = req.file.path;

        const result = await pool.query(
            'UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING profile_picture_url',
            [profilePictureUrl, req.user.id]
        );

        res.json({ profilePictureUrl: result.rows[0].profile_picture_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// ... existing code ...

// Upload & Parse Resume
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No resume file uploaded' });
        }

        const resumeUrl = req.file.path;

        // Parse the resume
        let parsedData = { skills: [], summary: '', text: '' };
        try {
            parsedData = await parseResume(resumeUrl);
        } catch (parseError) {
            console.warn("Parsing failed, but file saved:", parseError);
        }

        const textLength = parsedData.text ? parsedData.text.length : 0;
        let warning = null;

        if (textLength < 50) {
            warning = "Could not extract sufficient text. Ensure your PDF is text-selectable and NOT an image scan.";
        } else if (!parsedData.skills || parsedData.skills.length === 0) {
            warning = "Text extracted but no matching skills found. Try adding standardized keywords (e.g. 'React', 'Project Management') to your resume.";
        }

        // Prepare skills data structure
        const skillsData = {
            primary: parsedData.skills || [],
            secondary: [],
            technical: [],
            soft: [],
            certifications: [],
            languages: []
        };

        // Update User in DB
        const query = `
            UPDATE users SET 
            resume_url = $1,
            skills = $2
            WHERE id = $3
            RETURNING *`;

        const result = await pool.query(query, [
            resumeUrl,
            JSON.stringify(skillsData),
            req.user.id
        ]);

        res.json({
            message: warning || 'Resume uploaded and processed successfully',
            warning: warning,
            user: result.rows[0],
            extractedSkills: parsedData.skills,
            parsedSummary: parsedData.summary,
            textLength: textLength
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Profile Picture
const deleteProfilePicture = async (req, res) => {
    try {
        await pool.query(
            'UPDATE users SET profile_picture_url = NULL WHERE id = $1',
            [req.user.id]
        );
        res.json({ message: 'Profile picture removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updatePersonal,
    updateProfessional,
    updateSkills,
    updatePreferences,
    updatePassword,
    updateNotifications,
    updateProfilePicture,
    deleteProfilePicture,
    uploadResume,
    deleteUser
};
