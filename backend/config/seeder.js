const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already seeded. Skipping initial seeder.');
      return;
    }

    console.log('Database is empty. Seeding initial records for production...');

    // 1. Create Default Users (Plain passwords get hashed by pre-save hooks)
    const studentUser = await User.create({
      email: 'aarav.sharma@placementpro.ai',
      password: 'student123',
      role: 'student',
      isVerified: true
    });

    const recruiterUser = await User.create({
      email: 'recruiter@google.com',
      password: 'recruiter123',
      role: 'recruiter',
      isVerified: true
    });

    const adminUser = await User.create({
      email: 'admin@placementpro.ai',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    console.log('✔ Users seeded (student, recruiter, admin)');

    // 2. Create Companies
    const google = await Company.create({
      name: 'Google',
      industry: 'Technology & AI',
      website: 'https://google.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      description: 'Global leader in search, cloud technology, and artificial intelligence.',
      locations: ['Bengaluru', 'Hyderabad', 'Remote'],
      establishedYear: 1998,
      contactEmail: 'careers@google.com'
    });

    const meta = await Company.create({
      name: 'Meta',
      industry: 'Social Media & Tech',
      website: 'https://meta.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
      description: 'Empowering connections, community-building, and digital experiences.',
      locations: ['Hyderabad', 'Remote'],
      establishedYear: 2004,
      contactEmail: 'careers@meta.com'
    });

    console.log('✔ Companies seeded (Google, Meta)');

    // 3. Create Profiles
    const studentProfile = await Student.create({
      user: studentUser._id,
      firstName: 'Aarav',
      lastName: 'Sharma',
      phoneNumber: '+919876543210',
      rollNumber: 'CS2022001',
      department: 'CSE',
      batch: '2022-2026',
      cgpa: 8.5,
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Python', 'C++', 'Git', 'Linux'],
      education: [
        {
          institution: 'National Institute of Technology',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: 2022,
          endYear: 2026,
          grade: '8.5 CGPA'
        }
      ],
      experience: [
        {
          companyName: 'TechCorp Solutions',
          role: 'Fullstack Intern',
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-07-31'),
          current: false,
          description: 'Contributed to front-end features using React and Node API backend.'
        }
      ],
      projects: [
        {
          title: 'PlacementPro Portal',
          description: 'AI-enabled college recruitment and student matchmaking system.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
          link: 'https://github.com'
        }
      ]
    });

    const recruiterProfile = await Recruiter.create({
      user: recruiterUser._id,
      company: google._id,
      firstName: 'Priya',
      lastName: 'Patel',
      phoneNumber: '+918765432109',
      jobTitle: 'HR Recruiting Lead',
      isApprovedByAdmin: true
    });

    console.log('✔ Profiles seeded (Aarav Sharma, Priya Patel)');

    // 4. Create Active Jobs
    const job1 = await Job.create({
      title: 'Senior Frontend Engineer',
      description: 'We are seeking a senior React engineer to lead design system operations and user experience scaling.',
      company: google._id,
      postedBy: recruiterUser._id,
      jobType: 'Full-time',
      workMode: 'Hybrid',
      location: ['Bengaluru (Hybrid)'],
      salaryRange: { min: 2800000, max: 3600000, currency: 'INR' },
      requirements: ['React', 'Tailwind CSS', 'TypeScript', 'JavaScript'],
      responsibilities: ['Build premium interfaces', 'Mentor junior developers', 'Optimize render paths'],
      eligibilityCriteria: { minCgpa: 7.0, allowedDepartments: ['CSE', 'IT', 'ECE', 'MNC'] },
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      numberOfOpenings: 3,
      status: 'Active'
    });

    const job2 = await Job.create({
      title: 'AI Research Intern',
      description: 'Work alongside world-class researchers to build and optimize generative AI pipelines and vector graphs.',
      company: google._id,
      postedBy: recruiterUser._id,
      jobType: 'Internship',
      workMode: 'On-site',
      location: ['Bengaluru (Onsite)'],
      salaryRange: { min: 1500000, max: 2000000, currency: 'INR' },
      requirements: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning'],
      responsibilities: ['Analyze vector representations', 'Train baseline transformers', 'Optimize batch loading'],
      eligibilityCriteria: { minCgpa: 8.0, allowedDepartments: ['CSE', 'IT', 'MNC'] },
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      numberOfOpenings: 5,
      status: 'Active'
    });

    const job3 = await Job.create({
      title: 'Software Engineer',
      description: 'Contribute directly to core messaging infrastructures and globally scaled product features.',
      company: meta._id,
      postedBy: recruiterUser._id,
      jobType: 'Full-time',
      workMode: 'Remote',
      location: ['Remote (India)'],
      salaryRange: { min: 2000000, max: 2800000, currency: 'INR' },
      requirements: ['React', 'Node.js', 'Express', 'MongoDB'],
      responsibilities: ['Write scalable APIs', 'Model schemas', 'Deploy server containers'],
      eligibilityCriteria: { minCgpa: 7.5, allowedDepartments: ['CSE', 'IT', 'ECE', 'MNC', 'EEE'] },
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      numberOfOpenings: 4,
      status: 'Active'
    });

    console.log('✔ Jobs seeded (Frontend Engineer, AI Research, Software Engineer)');

    // 5. Create Applications
    await Application.create({
      job: job1._id,
      student: studentProfile._id,
      status: 'Offered',
      resumeUrl: '/uploads/demo_resume.pdf',
      feedback: 'Excellent code reviews and high score on UI system design assignment.'
    });

    await Application.create({
      job: job2._id,
      student: studentProfile._id,
      status: 'Applied',
      resumeUrl: '/uploads/demo_resume.pdf'
    });

    console.log('✔ Applications seeded');
    console.log('🎉 Seeding successfully completed!');
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
}

module.exports = seedDatabase;
