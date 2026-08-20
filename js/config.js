/* ────────────────────────────────────────────────────────────
   Site content config — edit this file to update the site.
   No HTML knowledge needed: render.js turns this into the page.
   ──────────────────────────────────────────────────────────── */

export const CONFIG = {
  name: { first: 'Warren', last: 'Wong' },
  kicker: '// character_select',
  title: 'VP of Solutions Engineering',
  company: {
    name: 'EvoMap',
    url: 'https://evomap.ai',
    logo: 'assets/logos/evomap-logo.svg',
  },
  salesResource: {
    tag: 'RESOURCE',
    label: 'EvoMap Sales Resources',
    url: 'https://evomap.ai',
  },

  // type drives the icon; `copy` makes the chip copy-to-clipboard instead of a link
  contacts: [
    { type: 'email',    label: 'warren@evomap.ai', href: 'mailto:warren@evomap.ai' },
    { type: 'whatsapp', label: 'WhatsApp',         href: 'https://wa.me/85295415141' },
    { type: 'wechat',   label: 'WeChat · xwarren', copy: 'xwarren', toast: 'WeChat ID copied — xwarren' },
    { type: 'linkedin', label: 'LinkedIn',         href: 'https://hk.linkedin.com/in/warren-wong' },
    { type: 'github',   label: 'GitHub',           href: 'https://github.com/somethingwentwell' },
  ],

  // bottom strip: `b` renders bold; scroll link is inserted in the middle
  stats: [
    { b: '10+', text: 'yrs APAC' },
    { b: 'HK', text: 'based' },
    { b: '粤 · EN · 普', text: '' },
  ],
  scrollHint: 'scroll for full CV ↓',

  experience: [
    {
      id: 'exp-evomap',
      company: 'EvoMap',
      place: 'Shenzhen, China',
      role: 'VP of Solutions Engineering',
      date: 'May 2026 — Present',
      logo: 'assets/logos/evomap-logo.svg',
      current: true,
      chip: false, // current employer lives in the nameplate, not the past_exp rail
      bullets: [
        "Leading the Solutions Engineering function for EvoMap's self-evolving AI agent platform",
        'Owning pre-sales architecture, enterprise delivery and technical go-to-market across APAC',
      ],
      links: [
        { label: 'evomap.ai ↗', url: 'https://evomap.ai' },
        { label: 'Sales Resources ↗', url: 'https://evomap.ai', ghost: true },
      ],
      badges: ['Solutions Engineering', 'AI Agents', 'Enterprise GTM'],
    },
    {
      id: 'exp-dify',
      company: 'Dify',
      place: 'Hong Kong (Remote)',
      role: 'Head of Solution Architecture',
      date: 'Jan 2025 — Apr 2026',
      logo: 'assets/logos/dify.svg',
      chip: true,
      tip: 'Dify · Head of Solution Architecture',
      bullets: [
        'Established and scaled the global Solution Architecture department from zero at the open-source LLM app platform (150k+ GitHub stars)',
        'Led technical engagement for global key accounts from PoC to production-grade deployment',
        'Architected enterprise AI workflows & RAG pipelines — Mercedes-Benz (DE), DBS (SG), AIA (HK), HKMA (HK)',
      ],
      badges: ['Solution Architecture', 'RAG', 'GenAI Platform', 'Team Leadership'],
    },
    {
      id: 'exp-gitlab',
      company: 'GitLab',
      place: 'Hong Kong (Remote)',
      role: 'Senior Solution Architect',
      date: 'Jan 2022 — Feb 2024',
      logo: 'assets/logos/gitlab.svg',
      chip: true,
      tip: 'GitLab · Senior Solution Architect',
      bullets: [
        'Launched the GitLab SaaS platform (gitlab.hk) for the Hong Kong market',
        'Contributed to core GenAI feature development on the global GitLab GenAI team',
        'Key customers — Bank of East Asia, Bank of China, Melco Resorts, Hospital Authority',
      ],
      badges: ['DevOps/CICD', 'GenAI R&D', 'Kubernetes'],
    },
    {
      id: 'exp-kong',
      company: 'Kong',
      place: 'Hong Kong (Remote)',
      role: 'Senior Regional Field Engineer',
      date: 'Jul 2021 — Jan 2022',
      logo: 'assets/logos/kong.svg',
      chip: true,
      tip: 'Kong · Senior Regional Field Engineer',
      bullets: [
        'Led global bank API projects in APJ, implementing APIOps and GitOps practices',
        'Key customers — HSBC, MUFG, Standard Chartered, Transport for NSW (AU)',
      ],
      badges: ['API Management', 'Microservices', 'Lua/Nginx'],
    },
    {
      id: 'exp-microsoft',
      company: 'Microsoft',
      place: 'Hong Kong (Hybrid)',
      role: 'Cloud Solution Architect',
      date: 'Jul 2017 — Mar 2020',
      logo: 'assets/logos/microsoft.svg',
      chip: true,
      tip: 'Microsoft · Cloud Solution Architect',
      bullets: [
        'End-to-end support for prioritized ISVs on large-scale Kubernetes & DevOps projects',
        'Drove early Azure adoption (IoT, blockchain) through PoCs and hackathons — HKTVmall, MoneySQ, CryptoBLK',
      ],
      badges: ['Azure Architecture', 'Kubernetes', 'IoT'],
    },
  ],

  otherExperience: [
    {
      title: 'Microsoft — Technical Trainer',
      date: 'Jan 2025 — Oct 2025',
      text: 'Delivered Microsoft technical training focused on Microsoft Copilot, GitHub Copilot and application development.',
    },
    {
      title: 'Feva Works — Lead Trainer',
      date: 'Mar 2018 — Oct 2024',
      text: 'Led the trainer team delivering Microsoft AI & IoT curriculum and certification training in Cantonese, English and Mandarin.',
    },
    {
      title: 'Institute of Vocational Education — Tutor',
      date: 'Jul 2017 — Sep 2018',
      text: 'Ran Industrial Attachment programs focused on bot and mobile development.',
    },
  ],

  skills: [
    { group: 'GenAI & LLMOps', items: 'Dify · LangChain · RAG · AI Agents · Langfuse' },
    { group: 'Vector DBs', items: 'Milvus · Qdrant · Weaviate · ElasticSearch' },
    { group: 'Cloud & Infra', items: 'Azure · AWS · GCP · Alibaba · Kubernetes · Terraform · Helm' },
    { group: 'API & Middleware', items: 'Kong Gateway · Kong Mesh · Nginx · Lua · FastAPI · Node.js' },
    { group: 'DevOps', items: 'GitHub/GitLab · ArgoCD · Prometheus · Grafana' },
    { group: 'Programming', items: 'Python · TypeScript · SQL · Bash' },
  ],

  certifications: [
    'Microsoft MVP (2020 — 2025)',
    'CKAD — The Linux Foundation',
    'Google Professional Cloud Architect',
    'AWS Solutions Architect — Associate',
    'Azure Solutions Architect Expert',
    'Azure DevOps Engineer Expert',
    'Azure AI Engineer · Security Engineer',
    'Microsoft Certified Trainer',
  ],

  education: [
    { title: 'BSc Information Security', detail: 'The Hong Kong Polytechnic University — cryptography & blockchain' },
  ],

  languages: [
    'Cantonese — Native',
    'English — Fluent · Mandarin — Fluent',
  ],

  footer: {
    headline: "Let's build something.",
    fine: '© 2026 Warren Wong · handcrafted low-poly, no cows harmed',
  },
};
