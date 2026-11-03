import { BlogPost } from '@/types';

export const blogsData: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'scaling-nextjs-enterprise-best-practices',
    title: 'Scaling Next.js App Router for High-Throughput Enterprise Platforms',
    excerpt:
      'A deep dive into caching strategies, server actions, streaming SSR, and edge middleware patterns for mission-critical web applications.',
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
### The Evolution of Modern Enterprise Frontends

As enterprise web applications scale in complexity and user traffic, traditional single-page application (SPA) architectures often buckle under heavy bundle sizes and slow initial paint times. Next.js App Router with React Server Components provides a paradigm shift that fundamentally improves performance metrics.

#### 1. Leveraging React Server Components (RSC)
By default, components in the Next.js App Router are Server Components. They execute solely on the server and render zero JavaScript bytes into client bundles. This dramatically reduces Time to Interactive (TTI), especially on resource-constrained mobile devices.

\`\`\`typescript
// Server Component directly fetching with granular caching
async function DashboardData() {
  const response = await fetch('https://api.internal/telemetry', {
    next: { revalidate: 60 }
  });
  const data = await response.json();
  return <MetricsTable items={data} />;
}
\`\`\`

#### 2. Streaming SSR with Suspense Boundaries
Rather than forcing users to wait for the slowest database query before seeing any content, wrap slower segments in React \`<Suspense>\`. Next.js streams the critical layout instantly, filling in interactive tables as background tasks resolve.

#### 3. Edge Middleware for Authentication & Routing
Moving auth verification and regional routing to the edge eliminates redundant roundtrips to central servers, cutting redirect latency by upwards of 70%.

### Key Takeaways
- Segregate client interactivity from read-only data presentation.
- Implement tagged cache invalidation using Next.js \`revalidateTag\`.
- Keep third-party client dependencies isolated to leaf nodes.
    `,
  },
  {
    id: 'blog-2',
    slug: 'rag-architecture-enterprise-documentation',
    title: 'Architecting Private Enterprise RAG: Beyond Naive Vector Search',
    excerpt:
      'Why naive semantic search fails in enterprise contexts, and how hybrid search with reranking delivers 99%+ answer accuracy.',
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
### Why Standard Vector Search Falls Short

Retrieval-Augmented Generation (RAG) is the primary method for grounding LLMs on proprietary data. However, many production setups suffer when relying purely on cosine similarity over standard embeddings.

#### The Pitfalls of Naive Embeddings:
1. **Loss of Keyword Precision:** Exact product codes, serial numbers, and legal citations get lost in continuous vector spaces.
2. **Context Window Clutter:** Returning loosely related chunks confuses the generator model and increases token bills.
3. **Outdated Temporal Records:** Vectors alone do not distinguish between last week's policy change and five-year-old superseded memos.

#### The Three-Pillar Solution:
- **Hybrid Search (BM25 + Dense Vectors):** Combine sparse term-frequency matching with semantic embeddings via Reciprocal Rank Fusion (RRF).
- **Cross-Encoder Reranking:** Run candidate passages through a cross-encoder model like Cohere or BGE-Reranker before feeding them into the context window.
- **Strict Citation Verification:** Force the generator to cite chunk IDs and reject outputs that cannot be verified against retrieved text.
    `,
  },
  {
    id: 'blog-3',
    slug: 'zero-downtime-kubernetes-migration-guide',
    title: 'Zero-Downtime Kubernetes Migration: Strategies for Live Production Systems',
    excerpt:
      'Lessons learned migrating 40+ microservices and multi-terabyte stateful databases without interrupting end-user transactions.',
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
### Planning the Shift Without Taking the System Offline

Moving a high-throughput enterprise infrastructure to Kubernetes is not merely a technical overhaul; it is a live surgical operation. Here is the field-tested playbook we use at Sbu Tech to guarantee zero downtime.

#### The Phased Migration Pattern
1. **Shadow Traffic Validation:** Duplicate production ingress requests to the new Kubernetes cluster using Envoy or service mesh mirrors.
2. **Dual Database Writes:** Write updates to both legacy and new databases with asynchronous reconciliation workers.
3. **DNS Canary Shifts:** Transition 1%, then 5%, then 25%, and finally 100% of live traffic via Route53 weighted records.
4. **Instant Rollback Gates:** Keep the old infrastructure warm for 72 hours following cutover before commencing teardown.
    `,
  },
  {
    id: 'blog-4',
    slug: 'design-systems-that-engineers-actually-use',
    title: 'Building Design Systems That Engineers and Designers Both Love',
    excerpt:
      'How to bridge the Figma-to-code gap using design tokens, strict component contracts, and automated visual regression testing.',
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
### The Disconnect Between Design and Code

All too often, companies spend months designing a beautiful Figma design system, only for frontend developers to create custom CSS hacks that drift out of sync within weeks.

#### Principles of High-Adoption Design Systems:
- **Shared Vocabulary:** Tokens in Figma must match the Tailwind config variable names 1:1.
- **Strict Composition Over Configuration:** Prefer compound components and slots over components with 40 distinct Boolean props.
- **Living Storybook Documentation:** Treat component documentation as a first-class citizen with automated visual diffs on every pull request.
    `,
  },
];
