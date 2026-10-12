export const PROJECTS = [
  {
    num: '01',
    title: 'Backend Architecture',
    pillTitle: 'Project 1 [Backend Architecture]',
    desc: 'High-performance distributed backend service engineered for low-latency data processing.',
    card: '#F1EDFF',
    numColor: '#7665B5',
    folder: '#FF7869',
    folderLabel: '01 / BACKEND API',
    stack: ['Go', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
    problem:
      'Lorem ipsum dolor sit amet: a legacy monolith struggled with p99 latency spikes and head-of-line blocking under bursty write traffic, limiting horizontal scale.',
    arch:
      'Consectetur adipiscing elit: an event-driven service mesh with idempotent consumers, a write-ahead log, partitioned queues, and a read-optimized cache layer behind a rate-limited API gateway.',
    solution:
      'Sed do eiusmod tempor: sharded the hot path, introduced backpressure and circuit breakers, and cut tail latency substantially while keeping the system observable with tracing and structured logs.'
  },
  {
    num: '02',
    title: 'ML Pipeline',
    pillTitle: 'Project 2 [ML Pipeline]',
    desc: 'End-to-end machine learning pipeline with automated data preprocessing and AI insights.',
    card: '#FFF1AD',
    numColor: '#9D7720',
    folder: '#FFF1AD',
    folderLabel: '02 / ML PIPELINE',
    stack: ['Python', 'PyTorch', 'scikit-learn', 'Airflow', 'MLflow', 'FastAPI'],
    problem:
      'Ut enim ad minim veniam: manual data cleaning and ad-hoc training scripts made experiments slow, unreproducible, and hard to hand off to production.',
    arch:
      'Quis nostrud exercitation: a DAG-orchestrated pipeline with schema validation, a feature store, versioned datasets, experiment tracking, and a containerized model-serving endpoint.',
    solution:
      'Duis aute irure dolor: automated preprocessing, training, evaluation gates, and rollbacks, so new models ship through the same reviewed path as application code.'
  },
  {
    num: '03',
    title: 'Full-Stack Web App',
    pillTitle: 'Project 3 [Full-Stack Web App]',
    desc: 'Scalable full-stack application featuring real-time state management and modular APIs.',
    card: '#EDF3FF',
    numColor: '#4B76B5',
    folder: '#B9D9FF',
    folderLabel: '03 / FULL-STACK',
    stack: ['TypeScript', 'React', 'Node.js', 'WebSockets', 'PostgreSQL', 'Tailwind'],
    problem:
      'Excepteur sint occaecat: users needed collaborative, real-time updates, but polling-based state sync caused stale views and wasted bandwidth.',
    arch:
      'Cupidatat non proident: a modular REST and WebSocket API, a normalized client-side store, optimistic updates with server reconciliation, and typed contracts shared across the stack.',
    solution:
      'Sunt in culpa qui officia: delivered live state sync with conflict handling, integration-tested endpoints, and a component library that kept the UI consistent.'
  },
  {
    num: '04',
    title: 'Compliance Engine',
    pillTitle: 'Project 4 [Compliance Engine]',
    desc: 'Automated regulatory compliance system utilizing AI to parse and manage constraints.',
    card: '#FFE8F4',
    numColor: '#A35D84',
    folder: '#C9B8FF',
    folderLabel: '04 / COMPLIANCE',
    stack: ['Python', 'LLM APIs', 'RAG', 'Elasticsearch', 'Celery', 'Terraform'],
    problem:
      'Lorem ipsum dolor sit amet: regulatory documents change constantly, and teams spent weeks mapping new constraints onto internal controls by hand.',
    arch:
      'Consectetur adipiscing elit: a document-ingestion pipeline with chunking and embeddings, a retrieval layer, rule extraction with human-in-the-loop review, and an auditable decision log.',
    solution:
      'Sed do eiusmod tempor: parsed regulations into structured constraints, flagged impacted controls automatically, and kept a traceable audit trail for every suggestion.'
  }
]

// Coordinates come straight from the design spec (px on a 900 x 312 board).
// Order matches the auto-typing sequence: P O R T F O L I O Enter.
export const KEYS = [
  { letter: 'P', label: 'Selected Work', x: 73, y: 0, w: 178, h: 173, face: '#ffb7d5', base: '#d94f8a', action: 'work', layer: 0.2 },
  { letter: 'O', label: 'About Me', x: 219, y: 0, w: 178, h: 173, face: '#c8b6ff', base: '#7153c7', action: 'about', layer: 0.2 },
  { letter: 'R', label: 'My Process', x: 365, y: 0, w: 178, h: 173, face: '#b9f2df', base: '#2caa85', action: 'process', layer: 0.2 },
  { letter: 'T', label: 'What I Do', x: 511, y: 0, w: 178, h: 173, face: '#ffd98e', base: '#d28a24', action: 'about', layer: 0.2 },
  { letter: 'F', label: 'Explore', x: 0, y: 139, w: 178, h: 173, face: '#a9ddff', base: '#3886c9', action: 'work', layer: 0.5 },
  { letter: 'O', label: 'A Little About Me', x: 146, y: 139, w: 178, h: 173, face: '#f4b8ff', base: '#a34cbf', action: 'about', layer: 0.5 },
  { letter: 'L', label: 'The Process', x: 292, y: 139, w: 178, h: 173, face: '#ffc3a0', base: '#d96c44', action: 'process', layer: 0.5 },
  { letter: 'I', label: 'My Approach', x: 438, y: 139, w: 178, h: 173, face: '#c6d7ff', base: '#5a78c9', action: 'about', layer: 0.5 },
  { letter: 'O', label: 'Contact Me', x: 584, y: 139, w: 178, h: 173, face: '#d9f28f', base: '#7aa52d', action: 'contact', layer: 0.5 },
  { letter: 'LET’S TALK', label: '', x: 657, y: 0, w: 218, h: 300, face: '#ffe446', base: '#eab800', action: 'contact', layer: 0, vertical: true }
]

export const PROCESS = [
  { kicker: '01 / ARCHITECT', title: 'System Design.', text: 'Define data models, evaluate constraints, and blueprint scalable API interactions.', sticker: 'Scalability First', tint: '#ffe0ee', sticky: '#ffb7d5' },
  { kicker: '02 / ENGINEER', title: 'Implementation.', text: 'Write clean, testable logic, build robust pipelines, and optimize algorithmic efficiency.', sticker: 'Logic -> APIs', tint: '#d9f7ec', sticky: '#b9f2df' },
  { kicker: '03 / DEPLOY', title: 'Ship & Monitor.', text: 'Establish CI/CD pipelines, ensure containerized deployment, and monitor system health.', sticker: 'CI/CD Pipeline', tint: '#fff0cf', sticky: '#ffd98e' }
]

export const EMAIL = 'varadpalod12@gmail.com'

export const STACK_CATS = {
  Languages: { face: '#ffb7d5', base: '#d94f8a' },
  Backend: { face: '#c8b6ff', base: '#7153c7' },
  'Data & ML': { face: '#b9f2df', base: '#2caa85' },
  Infra: { face: '#ffd98e', base: '#d28a24' }
}

// Placeholder stack: edit freely.
export const STACK = [
  { name: 'Go', cat: 'Languages' },
  { name: 'Python', cat: 'Languages' },
  { name: 'Java', cat: 'Languages' },
  { name: 'TypeScript', cat: 'Languages' },
  { name: 'SQL', cat: 'Languages' },
  { name: 'C++', cat: 'Languages' },
  { name: 'gRPC', cat: 'Backend' },
  { name: 'REST', cat: 'Backend' },
  { name: 'Kafka', cat: 'Backend' },
  { name: 'Redis', cat: 'Backend' },
  { name: 'PostgreSQL', cat: 'Backend' },
  { name: 'PyTorch', cat: 'Data & ML' },
  { name: 'scikit-learn', cat: 'Data & ML' },
  { name: 'Airflow', cat: 'Data & ML' },
  { name: 'MLflow', cat: 'Data & ML' },
  { name: 'Docker', cat: 'Infra' },
  { name: 'Kubernetes', cat: 'Infra' },
  { name: 'CI/CD', cat: 'Infra' }
]

/** Chips per row for a given container width in px (shared by the DOM and the 3D scene). */
export const stackCols = (px) => (px >= 600 ? 6 : 3)
