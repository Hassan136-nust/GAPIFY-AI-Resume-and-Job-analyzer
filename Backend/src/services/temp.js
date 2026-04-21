const resume = `Education
National University of Sciences and Technology (NUST) BS Computer Science — 4th Semester — CGPA: 3.32

Skills
Languages: Python, C++, Java, JavaScript, PL/SQL
Frontend: React.js, HTML, CSS, Tailwind CSS, Bootstrap
Backend: Node.js, Express.js, MongoDB, REST APIs, JWT Authentication, CRUD, MVC, WebSockets (Socket.IO)
Cloud & DevOps: Docker, AWS (ECR, ECS, ALB), Nginx
Tools: Git, GitHub, VS Code, PyCharm, Postman, Figma
AI Tools: Antigravity, Cursor, GitHub Copilot, Kiro, Lovable
Core Concepts: DSA, OOP, DB Systems, Networking, Real-Time Systems, CRDTs, REST APIs

Projects
UrbanPulse: GeoSpatial Urban Intelligence Platform (MERN Stack)
- Built a full-stack MERN-based geospatial analysis system using OpenStreetMap and Overpass APIs.
- Developed backend services for spatial data processing along with infrastructure scoring and route analysis modules.

Real-Time Collaborative Code Editor (Docker + AWS Deployment)
- Built a multi-user real-time code editor with live cursor synchronization using CRDTs and WebSockets.
- Deployed on AWS (ECR, ECS, ALB) enabling scalable and containerized cloud access.

Encrypted VPN with Login System
- Developed a secure VPN system with encrypted client-server communication and authentication mechanisms.
- Implemented session management and low-level packet handling using a custom network architecture.

Dimensional Aspect-Based Sentiment Analysis (SemEval-2026)
- Developed an NLP-based sentiment analysis system using deep learning for aspect-level classification.
- Performed data preprocessing, feature engineering, and model optimization to improve accuracy.

Recommendation System with Graph Analysis
- Built a graph-based recommendation engine using user-item interaction networks.
- Applied network analysis techniques to extract patterns and improve recommendation quality.

Chess Arena - Real-Time Multiplayer Game (Docker + Render Deployment)
- Built a real-time multiplayer chess game with live chat using WebSockets for instant synchronization across devices.
- Implemented player roles and game logic using Socket.IO.
- Containerized with Docker and deployed on Render, debugging production WebSocket issues.`;

const selfDescription = `I am a 4th-semester BS Computer Science student at NUST with a strong passion for full-stack development, cloud computing, and real-time systems. I have hands-on experience building scalable web applications using the MERN stack, deploying containerized solutions on AWS and Render, and implementing features like real-time collaboration with CRDTs and WebSockets. My technical toolkit includes Python, C++, Java, JavaScript, and various DevOps tools like Docker and AWS services. I enjoy solving complex problems, whether it's building a geospatial intelligence platform, an encrypted VPN, or an NLP-based sentiment analysis system. I am constantly exploring AI-assisted development tools and modern software architectures to build efficient, real-world applications.`;

const jobDescription = `We are looking for a motivated Full-Stack Developer Intern / Junior Software Engineer to join our engineering team. You will work on building scalable web applications, real-time features, and cloud-deployed systems. The ideal candidate has hands-on experience with modern JavaScript frameworks, backend development, and basic DevOps practices.

Responsibilities:
- Develop and maintain full-stack web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js).
- Build and integrate RESTful APIs and WebSocket-based real-time features (e.g., live chat, collaborative editing).
- Work with geospatial data and mapping APIs (OpenStreetMap, Overpass) for urban intelligence features.
- Deploy and manage containerized applications using Docker and cloud platforms like AWS (ECR, ECS, ALB) or Render.
- Implement secure authentication (JWT) and session management.
- Collaborate with team members using Git/GitHub and participate in code reviews.
- Optimize application performance and debug production issues, including WebSocket and network-related problems.
- Assist in NLP or graph-based features such as sentiment analysis or recommendation engines.

Required Skills:
- Proficiency in Python, JavaScript, and at least one of: C++ or Java.
- Strong understanding of Data Structures & Algorithms (DSA), OOP, and Database Systems.
- Experience with React.js, Tailwind CSS, and Node.js/Express.js.
- Knowledge of WebSockets (Socket.IO) and real-time system design.
- Familiarity with Docker, AWS basics, and Nginx.
- Hands-on experience with Git, Postman, and VS Code.

Good to Have:
- Exposure to AI tools like Cursor, Copilot, or similar.
- Understanding of CRDTs or collaborative editing systems.
- Basic knowledge of networking or VPN concepts.
- Previous experience deploying live projects (Render, AWS, or similar).

Education:
- Currently pursuing a BS in Computer Science (or related field) with at least 2 semesters completed.`;

module.exports={
    resume,selfDescription,jobDescription
}