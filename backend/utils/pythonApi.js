const fs = require('fs');
const path = require('path');

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

/**
 * Call Python AI Service to extract text, score, and analyze skills from resume.
 * @param {string} filePath - Absolute path to the resume file on local disk.
 */
async function analyzeResume(filePath) {
  try {
    const filename = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine MIME type
    let mimeType = 'application/pdf';
    if (filename.endsWith('.docx')) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (filename.endsWith('.doc')) {
      mimeType = 'application/msword';
    } else if (filename.endsWith('.txt')) {
      mimeType = 'text/plain';
    }

    // Construct FormData natively (supported in Node v20+)
    const formData = new FormData();
    const fileBlob = new Blob([fileBuffer], { type: mimeType });
    formData.append('resume', fileBlob, filename);

    const response = await fetch(`${PYTHON_API_URL}/api/python/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Python API responded with ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Python Analyze Resume API:', error.message);
    // Return mock analysis fallback in case the python service is offline/erroring
    return {
      success: false,
      error: error.message,
      score: 70,
      suggestions: ['Add more technical skills.', 'Highlight achievements with metrics.'],
      skills: ['JavaScript', 'HTML', 'CSS'],
      extractedText: 'Fallback text extraction due to service connection issue.',
    };
  }
}

/**
 * Compare student skills against job specifications.
 * @param {Array<string>} studentSkills 
 * @param {Array<string>} jobRequirements 
 */
async function getSkillMatch(studentSkills, jobRequirements) {
  try {
    const response = await fetch(`${PYTHON_API_URL}/api/python/skill-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentSkills, jobRequirements }),
    });

    if (!response.ok) {
      throw new Error(`Python API responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Python Skill Match API:', error.message);
    return {
      success: false,
      matchPercentage: 50.0,
      matchedSkills: [],
      missingSkills: jobRequirements,
    };
  }
}

/**
 * Retrieve recommended jobs for a student.
 * @param {string} studentId - Student document ID.
 */
async function getJobRecommendations(studentId) {
  try {
    const response = await fetch(`${PYTHON_API_URL}/api/python/recommendations/${studentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Python API responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Python Recommendations API:', error.message);
    return {
      success: false,
      count: 0,
      data: [],
    };
  }
}

module.exports = {
  analyzeResume,
  getSkillMatch,
  getJobRecommendations,
};
