-- CampusLink Seed Data
-- 30 Realistic Fictional Student Profiles + 15 Verified Library Resources

-- 1. Demo User Accounts (Pre-registered for instant login)
-- 00000000-0000-0000-0000-000000000001 : Demo Fresher (Year 1)
-- 00000000-0000-0000-0000-000000000002 : Demo Senior Mentor (Year 3)

insert into profiles (id, name, college_email, year, is_mentor, skills, interests, slots)
values
  ('00000000-0000-0000-0000-000000000001', 'Aarav Sharma', 'aarav.cs27@college.edu', 1, false, 
   array['python', 'c', 'html', 'css'], 'learning web dev, open source, hackathons', 
   array['wkday_aft', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000002', 'Ananya Roy', 'ananya.cs24@college.edu', 3, true, 
   array['python', 'machine learning', 'scikit-learn', 'pandas', 'deep learning'], 'kaggle, nlp, research papers, mentorship', 
   array['wkday_eve', 'wkend_morn']),

  ('00000000-0000-0000-0000-000000000003', 'Rohit Verma', 'rohit.it23@college.edu', 4, true, 
   array['react', 'node.js', 'mongodb', 'javascript', 'docker'], 'web apps, startups, hackathons', 
   array['wkend_aft', 'wkday_eve']),

  ('00000000-0000-0000-0000-000000000004', 'Sneha Kulkarni', 'sneha.des25@college.edu', 2, false, 
   array['figma', 'ui/ux', 'canva', 'design systems'], 'app design, user research, wireframing', 
   array['wkend_morn', 'wkday_aft']),

  ('00000000-0000-0000-0000-000000000005', 'Kiran Patel', 'kiran.cs25@college.edu', 2, false, 
   array['flutter', 'dart', 'firebase', 'mobile'], 'mobile apps, cross platform, hackathons', 
   array['wkend_aft', 'wkday_eve']),

  ('00000000-0000-0000-0000-000000000006', 'Divya Nair', 'divya.cs23@college.edu', 4, true, 
   array['sql', 'dbms', 'postgresql', 'data structures', 'database'], 'databases, query optimization, teaching notes', 
   array['wkday_eve', 'wkend_morn']),

  ('00000000-0000-0000-0000-000000000007', 'Arjun Mehta', 'arjun.ec27@college.edu', 1, false, 
   array['html', 'css', 'javascript', 'frontend'], 'learning web dev, frontend design', 
   array['wkday_aft', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000008', 'Meera Iyer', 'meera.ai24@college.edu', 3, true, 
   array['deep learning', 'pytorch', 'computer vision', 'opencv', 'vision'], 'medical imaging, rppg, computer vision research', 
   array['wkend_morn', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000009', 'Vikram Singh', 'vikram.cs25@college.edu', 2, false, 
   array['python', 'fastapi', 'docker', 'rest api', 'backend'], 'backend development, cloud systems, devops', 
   array['wkday_eve', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000010', 'Pooja Hegde', 'pooja.ee27@college.edu', 1, false, 
   array['python', 'c', 'arduino', 'iot'], 'iot devices, robotics club, hardware automation', 
   array['wkday_aft', 'wkend_morn']),

  ('00000000-0000-0000-0000-000000000011', 'Harsha Vardhan', 'harsha.cs24@college.edu', 3, true, 
   array['react', 'tailwind', 'typescript', 'next.js', 'frontend'], 'frontend architecture, design systems, hackathons', 
   array['wkday_eve', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000012', 'Nisha Gupta', 'nisha.ai23@college.edu', 4, true, 
   array['nlp', 'llm', 'langchain', 'python', 'rag', 'ai agents'], 'generative ai, chatbots, rag workflows, research', 
   array['wkend_morn', 'wkday_eve']),

  ('00000000-0000-0000-0000-000000000013', 'Tarun Reddy', 'tarun.it25@college.edu', 2, false, 
   array['java', 'spring boot', 'mysql', 'backend', 'api'], 'backend microservices, enterprise systems, placements', 
   array['wkday_aft', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000014', 'Lavanya Sundaram', 'lavanya.cs24@college.edu', 3, true, 
   array['aptitude', 'dsa', 'c++', 'competitive programming', 'data structures'], 'placement prep, leetcode, coding contests', 
   array['wkday_eve', 'wkend_morn']),

  ('00000000-0000-0000-0000-000000000015', 'Sachin Rao', 'sachin.ds27@college.edu', 1, false, 
   array['excel', 'power bi', 'data analysis', 'sql'], 'business intelligence, financial modeling', 
   array['wkday_aft']),

  ('00000000-0000-0000-0000-000000000016', 'Bhavana Gowda', 'bhavana.cs25@college.edu', 2, false, 
   array['unity', 'c#', 'game design', '3d'], 'game development, vr/ar simulations', 
   array['wkend_aft']),

  ('00000000-0000-0000-0000-000000000017', 'Deepak Joshi', 'deepak.cs24@college.edu', 3, true, 
   array['cybersecurity', 'linux', 'networking', 'ctf', 'security'], 'ethical hacking, penetration testing, ctf tournaments', 
   array['wkday_eve', 'wkend_morn']),

  ('00000000-0000-0000-0000-000000000018', 'Priya Menon', 'priya.cs24@college.edu', 3, true, 
   array['docker', 'kubernetes', 'cloud', 'devops', 'linux'], 'ci/cd pipelines, cloud infrastructure, terraform', 
   array['wkday_eve', 'wkend_morn']),

  ('00000000-0000-0000-0000-000000000019', 'Rahul Desai', 'rahul.it25@college.edu', 2, false, 
   array['python', 'django', 'postgresql', 'backend'], 'rest apis, backend testing, web applications', 
   array['wkday_aft', 'wkend_morn']),

  ('00000000-0000-0000-0000-000000000020', 'Karthik Bhat', 'karthik.cs23@college.edu', 4, true, 
   array['c++', 'dsa', 'competitive programming', 'algorithms'], 'icpc, codeforces master, placement guidance', 
   array['wkday_eve', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000021', 'Riya Sen', 'riya.des26@college.edu', 2, false, 
   array['figma', 'ui/ux', 'user research', 'design'], 'mobile interfaces, accessibility, prototyping', 
   array['wkend_morn', 'wkday_eve']),

  ('00000000-0000-0000-0000-000000000022', 'Aditya Mishra', 'aditya.ai25@college.edu', 2, false, 
   array['python', 'pytorch', 'machine learning', 'scikit-learn'], 'deep learning basics, math for ml', 
   array['wkday_aft', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000023', 'Varun Kapoor', 'varun.cs24@college.edu', 3, true, 
   array['sql', 'postgresql', 'mongodb', 'database', 'backend'], 'distributed databases, query profiling', 
   array['wkday_eve', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000024', 'Shreya Saxena', 'shreya.cs26@college.edu', 1, false, 
   array['python', 'html', 'css'], 'programming fundamentals, learning tech', 
   array['wkday_aft']),

  ('00000000-0000-0000-0000-000000000025', 'Tanvi Pillai', 'tanvi.cs23@college.edu', 4, true, 
   array['nlp', 'llm', 'python', 'huggingface', 'rag'], 'speech recognition, conversational ai, capstone guidance', 
   array['wkend_morn', 'wkday_eve']),

  ('00000000-0000-0000-0000-000000000026', 'Siddharth Roy', 'siddharth.ec24@college.edu', 3, true, 
   array['arduino', 'raspberry pi', 'c++', 'iot', 'robotics'], 'embedded systems, robotics team lead', 
   array['wkday_eve', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000027', 'Yash Singhania', 'yash.it25@college.edu', 2, false, 
   array['flutter', 'dart', 'rest api', 'mobile'], 'app development, state management, api integration', 
   array['wkend_aft', 'wkday_eve']),

  ('00000000-0000-0000-0000-000000000028', 'Akanksha Das', 'akanksha.cs24@college.edu', 3, true, 
   array['computer vision', 'opencv', 'deep learning', 'pytorch'], 'autonomous vehicles, object detection', 
   array['wkday_eve', 'wkend_morn']),

  ('00000000-0000-0000-0000-000000000029', 'Ishaan Malhotra', 'ishaan.cs25@college.edu', 2, false, 
   array['react', 'javascript', 'tailwind', 'frontend'], 'clean ui, component libraries, hackathon sprints', 
   array['wkday_aft', 'wkend_aft']),

  ('00000000-0000-0000-0000-000000000030', 'Neha Chawla', 'neha.cs23@college.edu', 4, true, 
   array['cybersecurity', 'network security', 'linux', 'wireshark'], 'soc operations, cryptography, thesis mentor', 
   array['wkday_eve', 'wkend_morn'])
on conflict (id) do nothing;

-- 2. 15 Curated Library Resources
insert into resources (id, owner_id, title, subject, tags, file_url, verified)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 
   'Database Management Systems (DBMS) Comprehensive Notes', 'Computer Science', 
   array['sql', 'dbms', 'normalization', 'indexing', 'transactions'], 
   'https://storage.supabase.co/notes/dbms_comprehensive.pdf', true),

  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 
   'Machine Learning & Deep Learning Formula Reference', 'Artificial Intelligence', 
   array['ml', 'pytorch', 'scikit-learn', 'deep learning', 'math'], 
   'https://storage.supabase.co/notes/ml_formulas.pdf', true),

  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000014', 
   'Data Structures & Algorithms Placement Handbook', 'Placements', 
   array['dsa', 'c++', 'algorithms', 'trees', 'dynamic programming'], 
   'https://storage.supabase.co/notes/dsa_placement_handbook.pdf', true),

  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000011', 
   'Modern React & Next.js App Router Architecture Guide', 'Web Development', 
   array['react', 'next.js', 'typescript', 'tailwind', 'frontend'], 
   'https://storage.supabase.co/notes/nextjs_architecture.pdf', true),

  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000012', 
   'LLM Engineering & RAG Implementation Cheatsheet', 'Artificial Intelligence', 
   array['nlp', 'llm', 'langchain', 'rag', 'embeddings'], 
   'https://storage.supabase.co/notes/llm_rag_cheatsheet.pdf', true),

  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000008', 
   'Computer Vision with OpenCV: Filter to Feature Extraction', 'Computer Science', 
   array['computer vision', 'opencv', 'python', 'image processing'], 
   'https://storage.supabase.co/notes/opencv_guide.pdf', true),

  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000009', 
   'FastAPI & Docker Microservices Production Blueprint', 'Backend Development', 
   array['fastapi', 'docker', 'python', 'rest api', 'backend'], 
   'https://storage.supabase.co/notes/fastapi_docker.pdf', true),

  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000017', 
   'Cybersecurity CTF Starter Pack: Networking & Web Exploits', 'Cybersecurity', 
   array['cybersecurity', 'linux', 'networking', 'ctf'], 
   'https://storage.supabase.co/notes/ctf_starter.pdf', true),

  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000005', 
   'Cross-Platform Mobile Development with Flutter & Dart', 'Mobile Development', 
   array['flutter', 'dart', 'mobile', 'firebase'], 
   'https://storage.supabase.co/notes/flutter_dart.pdf', true),

  ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004', 
   'UI/UX Design Systems & Prototyping in Figma', 'Design', 
   array['figma', 'ui/ux', 'design', 'user research'], 
   'https://storage.supabase.co/notes/figma_design_systems.pdf', true),

  ('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000018', 
   'DevOps Fundamentals: Kubernetes, Docker & CI/CD Pipelines', 'DevOps', 
   array['devops', 'kubernetes', 'docker', 'cloud'], 
   'https://storage.supabase.co/notes/devops_fundamentals.pdf', true),

  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000026', 
   'IoT Embedded Programming: Arduino & Raspberry Pi Guide', 'Hardware', 
   array['arduino', 'iot', 'robotics', 'c++'], 
   'https://storage.supabase.co/notes/iot_embedded.pdf', true),

  ('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000015', 
   'Data Analytics Masterclass: Power BI & SQL Queries', 'Data Analytics', 
   array['excel', 'power bi', 'sql', 'data analysis'], 
   'https://storage.supabase.co/notes/powerbi_analytics.pdf', true),

  ('10000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000020', 
   'Competitive Programming Master Techniques in C++', 'Placements', 
   array['c++', 'dsa', 'competitive programming', 'icpc'], 
   'https://storage.supabase.co/notes/competitive_programming.pdf', true),

  ('10000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000030', 
   'Network Security & Packet Inspection with Wireshark', 'Cybersecurity', 
   array['cybersecurity', 'networking', 'linux', 'wireshark'], 
   'https://storage.supabase.co/notes/wireshark_security.pdf', true)
on conflict (id) do nothing;
