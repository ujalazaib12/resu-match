// Resume parsing helper functions
export const extractSkills = (text) => {
    // Common technical skills
    const skillKeywords = [
        'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Angular', 'Vue',
        'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git', 'TypeScript',
        'HTML', 'CSS', 'REST API', 'GraphQL', 'Machine Learning', 'AI',
        'Data Analysis', 'Project Management', 'Agile', 'Scrum'
    ];

    const foundSkills = [];
    const lowerText = text.toLowerCase();

    skillKeywords.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            foundSkills.push(skill);
        }
    });

    return foundSkills;
};

export const extractExperience = (text) => {
    const experiencePatterns = [
        /(\d+)\+?\s*years?\s*of\s*experience/i,
        /experience:\s*(\d+)\+?\s*years?/i,
    ];

    for (const pattern of experiencePatterns) {
        const match = text.match(pattern);
        if (match) {
            const years = parseInt(match[1]);
            if (years < 2) return 'Entry Level';
            if (years < 5) return 'Mid Level';
            if (years < 10) return 'Senior Level';
            return 'Executive';
        }
    }

    return 'Not specified';
};

export const extractEducation = (text) => {
    const educationKeywords = [
        'Bachelor', 'Master', 'PhD', 'Associate', 'Diploma',
        'B.S.', 'M.S.', 'B.A.', 'M.A.', 'MBA'
    ];

    const education = [];
    const lines = text.split('\n');

    lines.forEach(line => {
        educationKeywords.forEach(keyword => {
            if (line.includes(keyword)) {
                education.push(line.trim());
            }
        });
    });

    return [...new Set(education)]; // Remove duplicates
};
