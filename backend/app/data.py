"""Synthetic seed data (fictional students) used for the CampusLink matching demo."""
SLOTS = ["wkday_aft", "wkday_eve", "wkend_morn", "wkend_aft"]

PROFILES = [
 dict(id="P01", name="Ananya", year=3, mentor=True,  skills=["python","machine learning","pandas","scikit-learn"], interests="kaggle, nlp, research papers", avail=["wkday_eve","wkend_morn"]),
 dict(id="P02", name="Rohit",  year=4, mentor=True,  skills=["react","node.js","mongodb","javascript"], interests="web apps, hackathons, startups", avail=["wkend_aft","wkday_eve"]),
 dict(id="P03", name="Sneha",  year=2, mentor=False, skills=["figma","ui/ux","canva"], interests="app design, user research", avail=["wkend_morn","wkday_aft"]),
 dict(id="P04", name="Kiran",  year=2, mentor=False, skills=["flutter","dart","firebase"], interests="mobile apps, hackathons", avail=["wkend_aft","wkday_eve"]),
 dict(id="P05", name="Divya",  year=4, mentor=True,  skills=["sql","dbms","postgresql","data structures"], interests="databases, placements, teaching notes", avail=["wkday_eve","wkend_morn"]),
 dict(id="P06", name="Arjun",  year=1, mentor=False, skills=["html","css","javascript"], interests="learning web dev", avail=["wkday_aft","wkend_aft"]),
 dict(id="P07", name="Meera",  year=3, mentor=True,  skills=["deep learning","pytorch","computer vision","opencv"], interests="medical imaging, rppg, research", avail=["wkend_morn","wkend_aft"]),
 dict(id="P08", name="Vikram", year=2, mentor=False, skills=["python","fastapi","docker","rest api"], interests="backend, cloud, devops", avail=["wkday_eve","wkend_aft"]),
 dict(id="P09", name="Pooja",  year=1, mentor=False, skills=["python","c","arduino"], interests="iot, robotics club", avail=["wkday_aft","wkend_morn"]),
 dict(id="P10", name="Harsha", year=3, mentor=True,  skills=["react","tailwind","typescript","next.js"], interests="frontend, design systems, hackathons", avail=["wkday_eve","wkend_aft"]),
 dict(id="P11", name="Nisha",  year=4, mentor=True,  skills=["nlp","llm","langchain","python","rag"], interests="ai agents, chatbots, internships", avail=["wkend_morn","wkday_eve"]),
 dict(id="P12", name="Tarun",  year=2, mentor=False, skills=["java","spring boot","mysql"], interests="backend, placements", avail=["wkday_aft","wkend_aft"]),
 dict(id="P13", name="Lavanya",year=3, mentor=True,  skills=["aptitude","dsa","c++","competitive programming"], interests="placements, coding contests", avail=["wkday_eve","wkend_morn"]),
 dict(id="P14", name="Sachin", year=1, mentor=False, skills=["excel","power bi"], interests="data analysis, finance", avail=["wkday_aft"]),
 dict(id="P15", name="Bhavana",year=2, mentor=False, skills=["unity","c#","game design"], interests="games, 3d", avail=["wkend_aft"]),
 dict(id="P16", name="Deepak", year=3, mentor=True,  skills=["cybersecurity","linux","networking","ctf"], interests="security, ethical hacking", avail=["wkday_eve","wkend_morn"]),
]

# Labelled test requests. 'relevant' was hand-labelled BEFORE running the matcher.
REQUESTS = [
 dict(id="R1", kind="teammate", year=2, avail=["wkend_aft","wkday_eve"], text="Need a frontend developer for a hackathon, comfortable with React", relevant=["P02","P10"]),
 dict(id="R2", kind="mentor",   year=2, avail=["wkend_morn","wkday_eve"], text="Looking for a senior mentor in machine learning to guide my mini project", relevant=["P01","P07","P11"]),
 dict(id="R3", kind="teammate", year=2, avail=["wkend_morn","wkday_aft"], text="Need someone good at app UI design for our hackathon project", relevant=["P03","P10"]),
 dict(id="R4", kind="mentor",   year=2, avail=["wkday_eve","wkend_morn"], text="Need help with DBMS and SQL for upcoming exams", relevant=["P05","P12"]),
 dict(id="R5", kind="teammate", year=3, avail=["wkday_eve","wkend_morn"], text="Want a teammate to build a chatbot using LLMs for an internship project", relevant=["P11","P08"]),
 dict(id="R6", kind="mentor",   year=2, avail=["wkday_eve","wkend_morn"], text="How do I prepare for placements and coding rounds? Need a senior to guide me", relevant=["P13","P05"]),
 dict(id="R7", kind="teammate", year=2, avail=["wkend_aft","wkday_eve"], text="Need a mobile app developer for a cross platform app", relevant=["P04"]),
 dict(id="R8", kind="teammate", year=3, avail=["wkend_morn","wkend_aft"], text="Looking for someone with computer vision and OpenCV for a vital signs project", relevant=["P07"]),
 dict(id="R9", kind="teammate", year=2, avail=["wkday_eve","wkend_aft"], text="Need a backend API developer, Python preferred", relevant=["P08","P12"]),
]

