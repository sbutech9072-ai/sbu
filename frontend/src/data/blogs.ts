import { BlogPost } from '@/types';

export const blogsData: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'scaling-nextjs-enterprise-best-practices',
    title: 'Scaling Next.js App Router for High-Throughput Enterprise Platforms',
    excerpt:
      'Field notes on caching boundaries, React Server Components, streaming Suspense, and edge auth routing on high-traffic Next.js deployments.',
    category: 'Engineering',
    readTime: '6 min read',
    publishedAt: '2025-10-15',
    author: {
      name: 'David Kim',
      role: 'Lead Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    tags: ['Next.js', 'React', 'Performance', 'Architecture'],
    isFeatured: true,
    content: `
### Why Large Client Bundles Hurt B2B Consoles

When an enterprise web application grows past a hundred routes, traditional single-page application (SPA) architectures start showing cracks. Users download megabytes of JavaScript just to render a read-only table, and initial page loads stall on waterfall API requests. Moving to the Next.js App Router with React Server Components fixes this at the architectural level, provided your team respects server/client boundaries.

#### 1. Keeping Data Fetching in React Server Components (RSC)
In the App Router, components run on the server by default and ship zero JavaScript to the browser. We keep heavy data formatting, markdown parsing, and permission checks strictly inside Server Components, passing only serialized props down to small interactive client islands.

\`\`\`typescript
// Server Component fetching internal telemetry with explicit tag revalidation
async function DashboardData() {
  const response = await fetch('https://api.internal/telemetry', {
    next: { revalidate: 60, tags: ['telemetry-summary'] }
  });
  const data = await response.json();
  return <MetricsTable items={data} />;
}
\`\`\`

#### 2. Streaming Slow Queries Behind Suspense Boundaries
Instead of blocking the entire HTTP response on your slowest analytical SQL query, wrap expensive widgets in React \`<Suspense>\`. The browser paints the navigation shell and fast summary cards immediately while the slower time-series payload streams over the same connection.

#### 3. Verifying Sessions at the Edge
Checking JWT signatures and tenant routing rules in Edge Middleware avoids unnecessary roundtrips to your origin database, cutting redirect latency by roughly 70% for globally distributed teams.

### Checklist Before You Ship
- Push \`'use client'\` directives as far down the component tree as possible.
- Invalidate cached fetches explicitly with \`revalidateTag\` on mutations rather than disabling caching globally.
- Audit bundle sizes in CI so a single chart library does not sneak into the shared root layout.
    `,
  },
  {
    id: 'blog-2',
    slug: 'rag-architecture-enterprise-documentation',
    title: 'Architecting Private Enterprise RAG: Beyond Naive Vector Search',
    excerpt:
      'Why pure cosine similarity fails on technical documents, and how BM25 hybrid retrieval with cross-encoder reranking pushes citation accuracy past 99%.',
    category: 'AI & Tech',
    readTime: '8 min read',
    publishedAt: '2025-09-28',
    author: {
      name: 'Amina Al-Mansoor',
      role: 'Principal AI Engineer',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    },
    tags: ['AI', 'Vector Search', 'LangChain', 'Python'],
    isFeatured: true,
    content: `
### Where Standard Vector Search Breaks Down

Retrieval-Augmented Generation (RAG) is the standard pattern for answering questions over internal company documents. Yet most prototypes fail within days of meeting real users because they rely solely on dense vector embeddings and fixed-character chunking.

#### Three Failure Modes We See in Production:
1. **Missed Exact Identifiers:** Dense embeddings blur exact part numbers, error codes, and legal statute references.
2. **Broken Table Context:** Splitting a PDF every 500 tokens slices financial tables and indemnity clauses right down the middle.
3. **Stale Policy Documents:** Cosine similarity alone cannot tell whether a memo was written last Tuesday or superseded four years ago.

#### The Production Architecture We Ship:
- **Hybrid Retrieval (BM25 + Dense Vectors):** Run sparse keyword matching alongside dense vector search, merging results with Reciprocal Rank Fusion (RRF).
- **Cross-Encoder Reranking:** Score the top 40 candidate chunks with a dedicated reranker (such as BGE-Reranker or Cohere Rerank) and pass only the top 5 into the LLM prompt.
- **Deterministic Citation Verification:** Require the model to output structured JSON referencing exact source chunk IDs, and reject any sentence whose citation span does not appear in the retrieved passage.
    `,
  },
  {
    id: 'blog-3',
    slug: 'zero-downtime-kubernetes-migration-guide',
    title: 'Zero-Downtime Kubernetes Migration: Strategies for Live Production Systems',
    excerpt:
      'How we migrated 45 live microservices and 12TB of transactional state to AWS EKS without dropping a single customer request.',
    category: 'Architecture',
    readTime: '7 min read',
    publishedAt: '2025-08-14',
    author: {
      name: 'Julian Alvarez',
      role: 'Staff DevOps Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    tags: ['DevOps', 'Kubernetes', 'AWS', 'IaC'],
    isFeatured: false,
    content: `
### Replacing the Engine While the Plane Is Flying

Migrating a live logistics or financial platform onto Kubernetes cannot rely on a "big bang" weekend maintenance window. When seaport trucks or payment terminals depend on your API 24/7, the cutover has to happen incrementally under real load.

#### Our Four-Stage Cutover Playbook
1. **Shadow Traffic Mirroring:** Replay a read-only copy of live production requests against the new EKS cluster using Envoy traffic mirroring to catch serialization and latency regressions early.
2. **Dual-Write Database Sync:** Write mutations to both legacy and target databases simultaneously while a background worker verifies row-level checksums.
3. **Weighted DNS Shifting:** Move live traffic in controlled steps (1%, 5%, 25%, 100%) via Route53 weighted records while watching error rates in Prometheus.
4. **Warm Standby Window:** Keep the legacy servers receiving replicated writes for 72 hours post-cutover so rollback remains a single DNS flip away.
    `,
  },
  {
    id: 'blog-4',
    slug: 'design-systems-that-engineers-actually-use',
    title: 'Building Design Systems That Engineers and Designers Both Love',
    excerpt:
      'How shared token naming, compound React primitives, and Storybook visual regression tests stop Figma files from drifting away from production code.',
    category: 'Design',
    readTime: '5 min read',
    publishedAt: '2025-07-20',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Product Design',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    },
    tags: ['Design Systems', 'Figma', 'UI/UX', 'Tailwind CSS'],
    isFeatured: false,
    content: `
### Why Most Figma Libraries Gather Dust

Teams often spend months polishing a Figma component library, only to find frontend engineers writing one-off Tailwind overrides two weeks later. The problem is rarely bad intent; it is usually a mismatch between how designers group layers and how engineers compose DOM nodes.

#### Rules That Keep Design and Code in Lockstep:
- **Identical Token Names:** If a surface color is called \`bg-surface-muted\` in Tailwind, it must have the exact same variable name in Figma. No mental translation tables.
- **Composition Over Prop Explosion:** Build small, composable sub-components (like \`Dialog.Root\`, \`Dialog.Header\`, \`Dialog.Footer\`) instead of a single monolithic component with 35 boolean props.
- **Automated Visual Diffs in CI:** Treat Storybook as the source of truth and run Playwright visual snapshots on every pull request so spacing regressions are caught before code review.
    `,
  },
];
