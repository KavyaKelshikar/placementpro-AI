import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import Python modules
from resume_analyzer.analyzer import extract_text, calculate_resume_score_and_suggestions
from skill_match.matcher import extract_skills_from_text, calculate_skill_match
from recommendation_engine.recommender import get_recommendations

# Load environment configs
load_dotenv()

app = Flask(__name__)
# Enable CORS for cross-port calls from the Node.js Express backend
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "service": "PlacementPro Python AI Service"
    }), 200

@app.route('/api/python/analyze', methods=['POST'])
def analyze_resume():
    """
    Endpoint: Extract text, calculate resume scores, extract skills, and suggest improvements.
    Expects: Multipart Form upload with 'resume' file field.
    """
    if 'resume' not in request.files:
        return jsonify({"success": False, "error": "No resume file field provided"}), 400
        
    file = request.files['resume']
    if file.filename == '':
        return jsonify({"success": False, "error": "Empty filename uploaded"}), 400

    temp_filepath = None
    try:
        # Create a secure temporary file to write uploaded file stream
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            file.save(temp_file.name)
            temp_filepath = temp_file.name

        # Extract text content
        extracted_text = extract_text(temp_filepath)
        if not extracted_text:
            return jsonify({"success": False, "error": "Could not extract text content from the uploaded document"}), 400

        # Run analysis algorithms
        analysis = calculate_resume_score_and_suggestions(extracted_text)
        skills = extract_skills_from_text(extracted_text)

        return jsonify({
            "success": True,
            "score": analysis["score"],
            "suggestions": analysis["suggestions"],
            "wordCount": analysis["wordCount"],
            "skills": skills,
            "extractedText": extracted_text
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Internal Resume analysis error: {str(e)}"}), 500
        
    finally:
        # Guarantee temporary file is deleted from local disk
        if temp_filepath and os.path.exists(temp_filepath):
            try:
                os.remove(temp_filepath)
            except Exception as delete_err:
                print(f"Error unlinking temp file: {delete_err}")

@app.route('/api/python/skill-match', methods=['POST'])
def skill_match():
    """
    Endpoint: Compare student skills with job requirements.
    Expects JSON: { "studentSkills": [...], "jobRequirements": [...] }
    """
    data = request.get_json() or {}
    student_skills = data.get('studentSkills', [])
    job_requirements = data.get('jobRequirements', [])

    if not isinstance(student_skills, list) or not isinstance(job_requirements, list):
        return jsonify({"success": False, "error": "studentSkills and jobRequirements parameters must be lists of strings"}), 400

    try:
        match_results = calculate_skill_match(student_skills, job_requirements)
        return jsonify({
            "success": True,
            "matchPercentage": match_results["matchPercentage"],
            "matchedSkills": match_results["matchedSkills"],
            "missingSkills": match_results["missingSkills"]
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/recommendations/<student_id>', methods=['GET'])
def recommend_jobs(student_id):
    """
    Endpoint: Recommend jobs based on student credentials and constraints.
    Expects URL param: student_id (Student document ID)
    """
    if not student_id:
        return jsonify({"success": False, "error": "Student profile ID parameter is required"}), 400

    try:
        recommendations = get_recommendations(student_id)
        return jsonify({
            "success": True,
            "count": len(recommendations),
            "data": recommendations
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Recommendation pipeline error: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.getenv('PYTHON_PORT', 8000))
    print(f"Starting Python AI Service on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
