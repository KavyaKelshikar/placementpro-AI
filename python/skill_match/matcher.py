import re

# Comprehensive list of placement-relevant skills to scan for text indexing
SKILLS_DICTIONARY = [
    # Languages
    'python', 'javascript', 'typescript', 'java', 'c\\+\\+', 'c#', ' ruby ', ' php ', ' go ', ' rust ', ' html ', ' css ', ' sql ', ' r ', ' scala ', ' kotlin ', ' swift ',
    # Frameworks & Libraries
    'react', 'node', 'express', 'django', 'flask', 'spring boot', 'angular', 'vue', 'next\\.js', 'nest\\.js', 'flutter', 'react native', 'fastapi', 'bootstrap', 'tailwind', 'jquery', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras',
    # Databases
    'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'dynamodb', 'cassandra', 'oracle', 'mssql', 'firebase',
    # Cloud & DevOps
    'aws', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'git ', 'github', 'jenkins', 'gitlab', 'ci/cd', 'terraform', 'ansible', 'nginx', 'linux',
    # Architecture & Concepts
    'rest api', 'graphql', 'microservices', 'serverless', 'system design', 'machine learning', 'deep learning', 'data science', 'natural language processing', 'nlp', 'computer vision', 'agile', 'scrum', 'object-oriented programming', 'oop'
]

def extract_skills_from_text(text):
    """
    Scan raw text against a predefined list of placement skills and return matches.
    """
    text_lower = f" {text.lower()} "
    extracted_skills = []
    
    for skill_pat in SKILLS_DICTIONARY:
        # Match using word boundaries or pattern
        if re.search(r'\b' + skill_pat + r'\b', text_lower):
            # Format display name cleanly (e.g. remove regex escape backslashes)
            display_name = skill_pat.replace('\\', '').strip()
            # Capitalize standard names
            display_name = {
                'python': 'Python',
                'javascript': 'JavaScript',
                'typescript': 'TypeScript',
                'java': 'Java',
                'c++': 'C++',
                'c#': 'C#',
                'ruby': 'Ruby',
                'php': 'PHP',
                'go': 'Go',
                'rust': 'Rust',
                'html': 'HTML',
                'css': 'CSS',
                'sql': 'SQL',
                'react': 'React',
                'node': 'Node.js',
                'express': 'Express',
                'django': 'Django',
                'flask': 'Flask',
                'spring boot': 'Spring Boot',
                'angular': 'Angular',
                'vue': 'Vue.js',
                'next.js': 'Next.js',
                'nest.js': 'Nest.js',
                'flutter': 'Flutter',
                'react native': 'React Native',
                'fastapi': 'FastAPI',
                'mongodb': 'MongoDB',
                'postgresql': 'PostgreSQL',
                'mysql': 'MySQL',
                'redis': 'Redis',
                'aws': 'AWS',
                'gcp': 'GCP',
                'docker': 'Docker',
                'kubernetes': 'Kubernetes',
                'git': 'Git',
                'github': 'GitHub',
                'ci/cd': 'CI/CD',
                'rest api': 'REST API',
                'graphql': 'GraphQL',
                'machine learning': 'Machine Learning',
                'deep learning': 'Deep Learning',
                'data science': 'Data Science',
                'nlp': 'NLP',
                'oop': 'OOP'
            }.get(display_name, display_name.title())
            
            if display_name not in extracted_skills:
                extracted_skills.append(display_name)
                
    return extracted_skills

def calculate_skill_match(student_skills, job_requirements):
    """
    Compare student skills with job requirements to calculate matching metrics.
    - student_skills: list of string
    - job_requirements: list of string
    """
    # Normalize comparison case
    student_set = {s.lower().strip() for s in student_skills}
    job_set = {j.lower().strip() for j in job_requirements}

    if not job_set:
        return {
            "matchPercentage": 100.0,
            "matchedSkills": [],
            "missingSkills": []
        }

    # Match computation
    matched_set = student_set.intersection(job_set)
    missing_set = job_set.difference(student_set)

    # Remap matching lowercased skills back to original case representations
    original_matched = []
    for s in student_skills:
        if s.lower().strip() in matched_set and s not in original_matched:
            original_matched.append(s)

    original_missing = []
    for j in job_requirements:
        if j.lower().strip() in missing_set and j not in original_missing:
            original_missing.append(j)

    match_percentage = (len(matched_set) / len(job_set)) * 100

    return {
        "matchPercentage": round(match_percentage, 2),
        "matchedSkills": original_matched,
        "missingSkills": original_missing
    }
