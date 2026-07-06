import os
from pymongo import MongoClient
from bson import ObjectId

def get_mongo_client():
    """Create MongoDB client using environment configurations."""
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/placement_portal')
    return MongoClient(mongo_uri)

def get_recommendations(student_id):
    """
    Generate a ranked list of job opportunities for a specific student profile.
    Filters:
    - Excludes jobs already applied to.
    - Excludes jobs where the student is strictly ineligible (CGPA or Department restrictions).
    
    Scores (Max 100):
    - Skill Match (Max 45)
    - Department match (Max 25)
    - CGPA eligibility margin (Max 20)
    - Bookmark interest match (Max 10)
    """
    client = get_mongo_client()
    db_name = os.getenv('MONGO_DB_NAME', 'placement_portal')
    db = client[db_name]

    try:
        # 1. Fetch Student Profile
        student = db.students.find_one({"_id": ObjectId(student_id)})
        if not student:
            return []

        student_skills = [s.lower().strip() for s in student.get('skills', [])]
        student_dept = student.get('department')
        student_cgpa = student.get('cgpa', 0.0)

        # 2. Fetch student applications to exclude already applied jobs
        applications = list(db.applications.find({"student": ObjectId(student_id)}))
        applied_job_ids = {str(app['job']) for app in applications}

        # 3. Fetch bookmarked job IDs to calculate interest boosts
        bookmarks = list(db.bookmarks.find({"student": ObjectId(student_id)}))
        bookmarked_job_ids = {str(bm['job']) for bm in bookmarks}

        # 4. Load all active jobs from the database
        active_jobs = list(db.jobs.find({"status": "Active"}))
        recommended_jobs = []

        for job in active_jobs:
            job_id_str = str(job['_id'])
            
            # Exclusion: Already applied
            if job_id_str in applied_job_ids:
                continue

            # Load job eligibility requirements
            eligibility = job.get('eligibilityCriteria', {})
            min_cgpa = eligibility.get('minCgpa', 0.0)
            allowed_depts = eligibility.get('allowedDepartments', [])

            # Eligibility Check: CGPA constraint
            if student_cgpa < min_cgpa:
                continue

            # Eligibility Check: Department constraint
            if allowed_depts and len(allowed_depts) > 0:
                if student_dept not in allowed_depts:
                    continue

            # Score calculations (Job qualifies, let's rank it)
            score = 0.0

            # A. Skill Match (Max 45 points)
            # Compare student skills with job requirements/descriptions
            requirements = [r.lower().strip() for r in job.get('requirements', [])]
            if requirements:
                matched_skills = set(student_skills).intersection(set(requirements))
                skill_percentage = len(matched_skills) / len(requirements)
                score += (skill_percentage * 45.0)
            else:
                # If a job requires no specific skills, give standard full score
                score += 45.0

            # B. Department Preference Match (Max 25 points)
            # If job targets the candidate's department specifically, give a high boost
            if allowed_depts and student_dept in allowed_depts:
                score += 25.0
            elif not allowed_depts:
                # If open to all departments, give base score
                score += 20.0

            # C. CGPA Margin Match (Max 20 points)
            # Reward students who exceed the minimum criteria significantly
            cgpa_diff = student_cgpa - min_cgpa
            if cgpa_diff >= 2.0:
                score += 20.0
            elif cgpa_diff >= 1.0:
                score += 15.0
            else:
                score += 10.0

            # D. Bookmark/Interest match (Max 10 points)
            # Give bonus points if they saved/bookmarked this job
            if job_id_str in bookmarked_job_ids:
                score += 10.0

            # Format job object with company names and details
            company = db.companies.find_one({"_id": job.get('company')})
            company_data = {}
            if company:
                company_data = {
                    "name": company.get('name'),
                    "logo": company.get('logo'),
                    "industry": company.get('industry')
                }

            recommended_jobs.append({
                "jobId": job_id_str,
                "title": job.get('title'),
                "jobType": job.get('jobType'),
                "workMode": job.get('workMode'),
                "location": job.get('location', []),
                "salaryRange": job.get('salaryRange', {}),
                "company": company_data,
                "score": round(score, 1)
            })

        # Sort recommendations by highest recommendation score
        recommended_jobs.sort(key=lambda x: x['score'], reverse=True)

        return recommended_jobs
    except Exception as e:
        print(f"Error compiling recommendations: {e}")
        return []
    finally:
        client.close()
