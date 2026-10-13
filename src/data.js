export const LINKS = {
  github: 'https://github.com/varadpalod',
  linkedin: 'https://www.linkedin.com/in/varad-palod',
  leetcode: 'https://leetcode.com/u/varad-palod/'
}

// repo / demo are optional: the case-study dialog hides a link when it is missing.
export const PROJECTS = [
  {
    num: '01',
    title: 'Project AEGIS',
    pillTitle: 'Project AEGIS (JARVIS)',
    desc: 'Secure, voice-driven personal AI assistant with face and voice authentication and permission-gated agents.',
    card: '#F1EDFF',
    numColor: '#7665B5',
    folder: '#C9B8FF',
    folderLabel: '01 / AEGIS',
    stack: ['Python', 'FastAPI', 'OpenCV', 'Gemini', 'SQLAlchemy', 'React'],
    problem:
      'Most AI assistants act on any prompt with no notion of who is speaking or how risky the request is. Deleting a file should need stronger proof of identity than asking for the weather.',
    arch:
      'A FastAPI backend with JWT and bcrypt auth, tiered security levels (password, PIN, voice print, face) and an audit log. A planner decomposes each prompt into steps for file, browser, coding and vault agents, and a security gateway blocks any step above the session level. Face verification uses OpenCV YuNet detection and SFace embeddings, and Gemini also screens prompts for injection, with a rule-based fallback.',
    solution:
      'A working end-to-end prototype: a multi-stage voice pipeline (wake word, speech recognition, intent analysis, security gateway, tool runtime), a memory service that feeds past preferences back into prompts, and a React console with wake-word listening and a live audit trail. Written up in a full product requirements spec.',
    repo: 'https://github.com/varadpalod/inevitable'
  },
  {
    num: '02',
    title: 'Optimal Execution Engine',
    pillTitle: 'Optimal Execution Engine',
    desc: 'Reinforcement-learning agent that sells large orders at lower cost than TWAP, tested on real Binance data.',
    card: '#FFF1AD',
    numColor: '#9D7720',
    folder: '#FFF1AD',
    folderLabel: '02 / EXECUTION',
    stack: ['Python', 'PyTorch', 'Stable-Baselines3', 'Gymnasium', 'FastAPI', 'React'],
    problem:
      'Selling a large order in one go moves the market against you. The goal is to split it over time so the total price is as good as possible.',
    arch:
      'A market simulator that models selling at the bid, market impact and resting limit orders. Three classic baselines (TWAP, VWAP, Almgren-Chriss) are compared with a Soft Actor-Critic agent trained with Stable-Baselines3 on Binance data. Results are served by a FastAPI backend to a React and Recharts dashboard.',
    solution:
      'On held-out real data the SAC agent beat TWAP by about 1.7 bps in 71% of episodes. Under much harsher limit-order fill assumptions the edge shrank to about 0.4 bps, which is reported openly. VWAP and Almgren-Chriss did not beat TWAP.',
    repo: 'https://github.com/varadpalod/trade-book'
  },
  {
    num: '03',
    title: 'ValuSense Pune',
    pillTitle: 'ValuSense Pune',
    desc: 'Sentiment-aware real estate intelligence for Pune: demand forecasts and locality rankings for builders and investors.',
    card: '#EDF3FF',
    numColor: '#4B76B5',
    folder: '#B9D9FF',
    folderLabel: '03 / VALUSENSE',
    stack: ['Python', 'XGBoost', 'Streamlit', 'NLTK VADER', 'spaCy', 'PyDeck'],
    problem:
      'Property pricing and launch decisions rely on listing data alone, and miss how buyers actually feel about a locality: price, infrastructure, investment confidence and urgency.',
    arch:
      'A pipeline that scores locality-level sentiment (VADER, with optional Gemini), aggregates it per locality and joins it with property features. An XGBoost model with cross-validation predicts demand, and an insights layer turns the output into rankings and alerts.',
    solution:
      'A seven-tab Streamlit dashboard with a 3D geospatial heatmap, investment rankings, affordability view, demand predictor and sentiment alerts. It gives builders, brokers and investors different, actionable views of the same data.',
    repo: 'https://github.com/varadpalod/valusense-pune'
  },
  {
    num: '04',
    title: 'Compliance Checker',
    pillTitle: 'Compliance Checker',
    desc: 'Policy compliance workspace with a semantic-search assistant and audit trail. PFISOC Alcista Hackathon 2025.',
    card: '#FFE8F4',
    numColor: '#A35D84',
    folder: '#FFB7D5',
    folderLabel: '04 / COMPLIANCE',
    stack: ['Python', 'Flask', 'SQLAlchemy', 'SQLite', 'Sentence-Transformers', 'HTML/CSS'],
    problem:
      'Teams keep policy documents and regulatory questions in scattered places, which makes compliance answers slow to find and hard to audit.',
    arch:
      'A Flask application with session-based auth, per-user policy uploads (PDF, DOC, DOCX, TXT) stored through SQLAlchemy, and dashboard, alerts, reports and regulations views. A retrieval assistant embeds a curated Q&A knowledge base with all-MiniLM-L6-v2 and answers by cosine similarity, falling back safely below a 0.55 confidence threshold.',
    solution:
      'Delivered a working multi-page platform in a hackathon sprint (57 commits). Every assistant interaction is written to an audit log with timestamp, user, matched question and confidence, so answers can be traced afterwards.',
    repo: 'https://github.com/yokelman/compliance-checker'
  },
  {
    num: '05',
    title: 'College ERP API',
    pillTitle: 'College ERP API',
    desc: 'Layered FastAPI and MySQL backend for managing students, attendance and users.',
    card: '#E6F9F1',
    numColor: '#2C8F72',
    folder: '#B9F2DF',
    folderLabel: '05 / ERP API',
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'MySQL', 'Pydantic'],
    problem:
      'Academic administration needs one reliable source of truth for student records and daily attendance, with data that stays consistent as it is edited.',
    arch:
      'A layered FastAPI service: routers handle HTTP, a service layer holds the business rules, Pydantic schemas validate input and output, and SQLAlchemy models map to MySQL. Users carry Admin, Faculty or Student roles and passwords are hashed with pwdlib.',
    solution:
      'Full CRUD APIs for students, attendance and users. Attendance enforces one record per student per day (a duplicate returns 409) and checks that the student exists before saving.',
    repo: 'https://github.com/varadpalod/college-erp-api'
  },
  {
    num: '06',
    title: 'Smart Hostel',
    pillTitle: 'Smart Hostel (Android)',
    desc: 'Android app that automates hostel attendance with geofencing, plus leave and complaint workflows.',
    card: '#FFF0CF',
    numColor: '#B07A1E',
    folder: '#FFD98E',
    folderLabel: '06 / HOSTEL',
    stack: ['Kotlin', 'Android', 'MVVM', 'Coroutines', 'Play Services Location', 'Material 3'],
    problem:
      'Manual hostel attendance and paper-based leave approvals are slow, easy to game with proxy check-ins, and give parents and rectors little visibility.',
    arch:
      'A Kotlin MVVM app with role-based dashboards for students, parents and the rector. Attendance uses Google Play Services geofencing, with device binding and checks that reject mock locations and low-accuracy GPS readings.',
    solution:
      'Students mark attendance only from inside the hostel on their registered phone. Leave requests move through a parent-then-rector approval chain, and complaints are tracked from Pending to Resolved.',
    repo: 'https://github.com/varadpalod/MVPM-SMAART_Hostel-Project'
  }
]

// Coordinates come straight from the design spec (px on a 900 x 312 board).
// Order matches the auto-typing sequence: P O R T F O L I O Enter.
export const KEYS = [
  { letter: 'P', label: 'Selected Work', x: 73, y: 0, w: 178, h: 173, face: '#ffb7d5', base: '#d94f8a', action: 'work', layer: 0.2 },
  { letter: 'O', label: 'About', x: 219, y: 0, w: 178, h: 173, face: '#c8b6ff', base: '#7153c7', action: 'about', layer: 0.2 },
  { letter: 'R', label: 'Process', x: 365, y: 0, w: 178, h: 173, face: '#b9f2df', base: '#2caa85', action: 'process', layer: 0.2 },
  { letter: 'T', label: 'Toolkit', x: 511, y: 0, w: 178, h: 173, face: '#ffd98e', base: '#d28a24', action: 'stack', layer: 0.2 },
  { letter: 'F', label: 'Projects', x: 0, y: 139, w: 178, h: 173, face: '#a9ddff', base: '#3886c9', action: 'work', layer: 0.5 },
  { letter: 'O', label: 'Background', x: 146, y: 139, w: 178, h: 173, face: '#f4b8ff', base: '#a34cbf', action: 'about', layer: 0.5 },
  { letter: 'L', label: 'Workflow', x: 292, y: 139, w: 178, h: 173, face: '#ffc3a0', base: '#d96c44', action: 'process', layer: 0.5 },
  { letter: 'I', label: 'Skills', x: 438, y: 139, w: 178, h: 173, face: '#c6d7ff', base: '#5a78c9', action: 'stack', layer: 0.5 },
  { letter: 'O', label: 'Contact', x: 584, y: 139, w: 178, h: 173, face: '#d9f28f', base: '#7aa52d', action: 'contact', layer: 0.5 },
  { letter: 'LET’S TALK', label: '', x: 657, y: 0, w: 218, h: 300, face: '#ffe446', base: '#eab800', action: 'contact', layer: 0, vertical: true }
]

export const PROCESS = [
  { kicker: '01 / ARCHITECT', title: 'System Design.', text: 'Define data models, evaluate constraints, and blueprint scalable API interactions.', sticker: 'Scalability First', tint: '#ffe0ee', sticky: '#ffb7d5' },
  { kicker: '02 / ENGINEER', title: 'Implementation.', text: 'Write clean, testable logic, build robust pipelines, and optimize algorithmic efficiency.', sticker: 'Clean, Tested Code', tint: '#d9f7ec', sticky: '#b9f2df' },
  { kicker: '03 / DEPLOY', title: 'Ship & Monitor.', text: 'Establish CI/CD pipelines, ensure containerized deployment, and monitor system health.', sticker: 'CI/CD Pipeline', tint: '#fff0cf', sticky: '#ffd98e' }
]

export const EMAIL = 'varadpalod12@gmail.com'

export const STACK_CATS = {
  Languages: { face: '#ffb7d5', base: '#d94f8a' },
  Backend: { face: '#c8b6ff', base: '#7153c7' },
  'Data & ML': { face: '#b9f2df', base: '#2caa85' },
  'Frontend & Tools': { face: '#ffd98e', base: '#d28a24' }
}

// Technologies used across the projects above. Edit freely (keep a multiple of 6 for a tidy grid).
export const STACK = [
  { name: 'Python', cat: 'Languages' },
  { name: 'JavaScript', cat: 'Languages' },
  { name: 'SQL', cat: 'Languages' },
  { name: 'FastAPI', cat: 'Backend' },
  { name: 'Flask', cat: 'Backend' },
  { name: 'REST', cat: 'Backend' },
  { name: 'SQLAlchemy', cat: 'Backend' },
  { name: 'MySQL', cat: 'Backend' },
  { name: 'JWT', cat: 'Backend' },
  { name: 'PyTorch', cat: 'Data & ML' },
  { name: 'XGBoost', cat: 'Data & ML' },
  { name: 'scikit-learn', cat: 'Data & ML' },
  { name: 'OpenCV', cat: 'Data & ML' },
  { name: 'RL / SAC', cat: 'Data & ML' },
  { name: 'NLP', cat: 'Data & ML' },
  { name: 'React', cat: 'Frontend & Tools' },
  { name: 'Streamlit', cat: 'Frontend & Tools' },
  { name: 'Git', cat: 'Frontend & Tools' }
]

/** Chips per row for a given container width in px (shared by the DOM and the 3D scene). */
export const stackCols = (px) => (px >= 600 ? 6 : 3)
