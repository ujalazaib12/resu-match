const fs = require('fs');

/**
 * Basic keyword list for skills extraction
 * This is a simple MVP. In a production app, this should be much larger or use an external API.
 */
const COMMON_SKILLS = [
    // Languages
    'javascript', 'js', 'typescript', 'ts', 'python', 'py', 'java', 'c++', 'cpp', 'c#', 'csharp', 'ruby', 'go', 'golang', 'php', 'swift', 'kotlin', 'sql', 'r', 'matlab', 'rust', 'scala', 'dart', 'shell', 'bash',
    // Frontend
    'react', 'react.js', 'reactjs', 'angular', 'angularjs', 'vue', 'vue.js', 'vuejs', 'next.js', 'nextjs', 'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'tailwind', 'bootstrap', 'jquery', 'redux', 'webpack', 'babel',
    // Backend
    'node.js', 'nodejs', 'node', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'laravel', 'symfony', 'asp.net', '.net', 'rails',
    // Database
    'postgresql', 'postgres', 'mysql', 'mongodb', 'mongo', 'redis', 'oracle', 'sqlite', 'mariadb', 'cassandra', 'firebase', 'firestore', 'dynamodb',
    // DevOps/Cloud
    'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'k8s', 'jenkins', 'git', 'github', 'gitlab', 'ci/cd', 'terraform', 'ansible', 'linux', 'ubuntu', 'nginx', 'apache',
    // Mobile
    'react native', 'flutter', 'ios', 'android', 'swiftui',
    // Data/AI
    'machine learning', 'deep learning', 'ai', 'data science', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'keras', 'nlp',
    // Design
    'figma', 'adobe xd', 'photoshop', 'illustrator', 'indesign', 'sketch', 'invision', 'ui/ux', 'user interface', 'user experience',
    // General/Soft
    'leadership', 'communication', 'agile', 'scrum', 'kanban', 'jira', 'confluence', 'teamwork', 'problem solving', 'critical thinking', 'time management',
    // Productivity
    'microsoft office', 'excel', 'word', 'powerpoint', 'outlook', 'google drive', 'slack', 'zoom', 'trello', 'notion',
    // Other
    'rest api', 'restful api', 'graphql', 'soap', 'microservices', 'mvc', 'oop', 'tdd', 'unit testing', 'jest', 'mocha'
];

/**
 * Extract skills from text using simple keyword matching
 */
const extractSkills = (text) => {
    // Normalize text: preserve newlines but collapse multiple spaces
    const lowerText = text.toLowerCase().replace(/\s+/g, ' ');
    const foundSkills = new Set();

    COMMON_SKILLS.forEach(skill => {
        // specific handling for C++ and C#
        let regexPattern;
        if (skill === 'c++' || skill === 'cpp') {
            regexPattern = '(?:c\\+\\+|cpp)';
        } else if (skill === 'c#' || skill === 'csharp') {
            regexPattern = '(?:c#|csharp)';
        } else if (skill === '.net') {
            regexPattern = '\\.net';
        } else if (skill === 'node') {
            // Avoid matching "node" in "node_modules" or general text too aggressively if purely standalone
            regexPattern = '\\bnode\\b';
        } else {
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            regexPattern = `\\b${escapedSkill}\\b`;
        }

        const regex = new RegExp(regexPattern, 'i');

        if (regex.test(lowerText)) {
            // Capitalize for display (simple capitalization, can be improved)
            const displaySkill = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            foundSkills.add(displaySkill);
        }
    });

    return Array.from(foundSkills);
};

const parseResume = async (filePath) => {
    try {
        console.log("Dynamically loading pdfjs-dist...");
        // Dynamically import pdfjs-dist (ESM) to avoid CommonJS require issues
        const pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');

        // Handle named vs default export
        const getDocument = pdfjsModule.getDocument || (pdfjsModule.default && pdfjsModule.default.getDocument);

        if (!getDocument) {
            throw new Error("Could not find getDocument in pdfjs-dist module. Keys: " + Object.keys(pdfjsModule));
        }

        const dataBuffer = fs.readFileSync(filePath);

        // Load PDF
        const loadingTask = getDocument({
            data: new Uint8Array(dataBuffer),
            useSystemFonts: true,
            disableFontFace: true,
            verbosity: 0 // Suppress info messages
        });

        const pdfDocument = await loadingTask.promise;
        let fullText = '';
        const numPages = pdfDocument.numPages;

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            // Concatenate text items with space
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        console.log("Resume Text Preview (First 200 chars):", fullText.substring(0, 200));

        // Basic extraction
        const skills = extractSkills(fullText);
        console.log(`Extracted ${skills.length} skills:`, skills);

        // Simple Summary heuristic
        const summary = fullText.substring(0, 500).replace(/\s+/g, ' ').trim() + '...';

        return {
            text: fullText,
            skills: skills,
            summary: summary
        };
    } catch (error) {
        console.error("Resume Parsing Error:", error);
        throw new Error("Failed to parse resume: " + error.message);
    }
};

module.exports = { parseResume };
