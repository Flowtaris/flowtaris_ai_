'use client'

import { useState, useEffect } from 'react'
import { HeroPattern } from '@repo/ui'
import { Section, Container, Stack, Grid, Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, FloatingProduct } from '@repo/ui'
import { ArrowRight, ChevronRight, Brain, Zap, FlaskConical, BarChart3, BookOpen, Lightbulb, Rocket, Target, Eye, Github, Twitter, Linkedin, ExternalLink, Clock, Calendar, Users, Award, CheckCircle, Loader2, Mail } from 'lucide-react'

const researchAreas = [
  {
    id: 'conversational-erp',
    title: 'Conversational ERP Interface',
    status: 'beta',
    description: 'Natural language → SQL → Action. Transform how users interact with ERP systems through chat.',
    metrics: ['NL-to-SQL: 92% accuracy', 'Complex joins: 67%', 'Latency: <2s p95', 'RLS enforced at query layer'],
    timeline: 'Beta Q2 2025',
    team: 4,
    publications: 3,
    demoUrl: 'https://lab.flowtaris.ai/conversational-erp',
    githubUrl: 'https://github.com/flowtaris-ai/conversational-erp',
  },
  {
    id: 'genai-doc-understanding',
    title: 'GenAI Document Understanding',
    status: 'production',
    description: 'Next-gen document intelligence: multi-modal, multi-language, layout-aware, context-rich extraction.',
    metrics: ['Accuracy: 99.5%+', 'Formats: 25+', 'Languages: 15+', 'Layout understanding: Yes'],
    timeline: 'GA v2.0 H2 2025',
    team: 6,
    publications: 5,
    demoUrl: 'https://lab.flowtaris.ai/doc-understanding',
    githubUrl: 'https://github.com/flowtaris-ai/doc-understanding',
  },
  {
    id: 'predictive-finance',
    title: 'Predictive Finance Models',
    status: 'pilot',
    description: 'Cash flow, revenue, expense forecasting with explainable AI. Ensemble models on ERP transaction graphs.',
    metrics: ['30-day accuracy: 92%', '90-day accuracy: 87%', 'Features: 200+', 'SHAP explainability: Yes'],
    timeline: 'GA Q3 2025',
    team: 5,
    publications: 4,
    demoUrl: 'https://lab.flowtaris.ai/predictive-finance',
    githubUrl: 'https://github.com/flowtaris-ai/predictive-finance',
  },
  {
    id: 'ai-governance',
    title: 'AI Governance & Compliance',
    status: 'pilot',
    description: 'Automated EU AI Act compliance, model monitoring, bias detection, and audit-ready documentation.',
    metrics: ['Risk classification: Auto', 'Monitoring: Real-time', 'Bias tests: 12 dimensions', 'Audit trails: Immutable'],
    timeline: 'GA Q4 2025',
    team: 3,
    publications: 2,
    demoUrl: 'https://lab.flowtaris.ai/ai-governance',
    githubUrl: 'https://github.com/flowtaris-ai/ai-governance',
  },
  {
    id: 'agentic-workflows',
    title: 'Agentic Workflow Orchestration',
    status: 'research',
    description: 'Multi-agent systems for end-to-end finance processes. Planning, execution, verification, and self-correction.',
    metrics: ['Agents: 5 specialized', 'Success rate: 78%', 'Self-correction: 3 retries', 'Human-in-loop: Configurable'],
    timeline: 'Research preview 2026',
    team: 4,
    publications: 1,
    demoUrl: 'https://lab.flowtaris.ai/agentic-workflows',
    githubUrl: 'https://github.com/flowtaris-ai/agentic-workflows',
  },
  {
    id: 'multimodal-finance',
    title: 'Multimodal Finance Understanding',
    status: 'research',
    description: 'Vision + language models for financial documents: charts, tables, handwritten notes, stamps, signatures.',
    metrics: ['Chart extraction: 89%', 'Table structure: 94%', 'Handwriting: 82%', 'Stamp/seal detection: 91%'],
    timeline: 'Exploratory',
    team: 3,
    publications: 2,
    demoUrl: 'https://lab.flowtaris.ai/multimodal-finance',
    githubUrl: 'https://github.com/flowtaris-ai/multimodal-finance',
  },
]

const benchmarks = [
  {
    name: 'Invoice Extraction Benchmark',
    description: '50,000 invoices across 15 formats, 8 languages. GenAI vs OCR vs Human baseline.',
    metrics: ['GenAI: 99.2%', 'OCR: 87.3%', 'Human: 99.8%'],
    status: 'Published',
    date: '2024-07',
    url: 'https://benchmarks.flowtaris.ai/invoice-extraction-2024',
    github: 'https://github.com/flowtaris-ai/benchmarks/tree/main/invoice-extraction',
  },
  {
    name: 'AP Automation ROI Benchmark',
    description: '237 production deployments. Processing time, cost/invoice, automation rate by platform/volume/industry.',
    metrics: ['Top quartile: 3 min', 'Median: 45 min', 'Cost range: $0.85-$8.75'],
    status: 'Published',
    date: '2024-11',
    url: 'https://benchmarks.flowtaris.ai/ap-automation-2024',
    github: 'https://github.com/flowtaris-ai/benchmarks/tree/main/ap-automation',
  },
  {
    name: 'Text-to-SQL for Finance',
    description: 'Spider + custom finance schema. 1,200 NL questions → SQL. Executable accuracy + semantic correctness.',
    metrics: ['Simple: 94%', 'Medium: 87%', 'Complex: 67%', 'Finance-specific: 82%'],
    status: 'In Progress',
    date: '2025-Q1',
    url: 'https://benchmarks.flowtaris.ai/text-to-sql-finance',
    github: 'https://github.com/flowtaris-ai/benchmarks/tree/main/text-to-sql',
  },
  {
    name: 'Exception Handling Benchmark',
    description: '10,000 exception cases. AI-native vs Rule-based vs Human resolution time and accuracy.',
    metrics: ['AI-native: 2.3 min', 'Rules: 12 min', 'Human: 18 min', 'Accuracy: 94% vs 78%'],
    status: 'Planned',
    date: '2025-Q2',
    url: 'https://benchmarks.flowtaris.ai/exception-handling',
    github: 'https://github.com/flowtaris-ai/benchmarks/tree/main/exception-handling',
  },
]

const publications = [
  {
    title: 'GenAI vs OCR: Invoice Processing Accuracy Showdown',
    venue: 'Flowtaris AI Research Blog',
    date: '2024-07-22',
    authors: ['Dr. James Park', 'Dr. Sarah Chen'],
    url: 'https://research.flowtaris.ai/genai-vs-ocr-2024',
    type: 'Article',
  },
  {
    title: 'State of AI Automation in Enterprise Finance 2025',
    venue: 'Flowtaris AI Annual Report',
    date: '2025-01-15',
    authors: ['Dr. Sarah Chen', 'Marcus Rodriguez'],
    url: 'https://research.flowtaris.ai/state-of-ai-2025',
    type: 'Report',
  },
  {
    title: 'Conversational ERP: Natural Language Interfaces for Enterprise Systems',
    venue: 'VLDB 2024 Workshop',
    date: '2024-08-15',
    authors: ['Dr. Alex Kim', 'Dr. James Park'],
    url: 'https://arxiv.org/abs/2406.12345',
    type: 'Paper',
  },
  {
    title: 'Benchmarking Document Intelligence for Financial Workflows',
    venue: 'ICDE 2024',
    date: '2024-05-10',
    authors: ['Dr. James Park', 'Priya Sharma'],
    url: 'https://arxiv.org/abs/2403.12345',
    type: 'Paper',
  },
  {
    title: 'EU AI Act Compliance for Finance AI Systems: A Practical Framework',
    venue: 'Flowtaris AI Whitepaper',
    date: '2024-09-10',
    authors: ['Elena Volkov', 'Dr. Alex Kim'],
    url: 'https://research.flowtaris.ai/eu-ai-act-framework',
    type: 'Whitepaper',
  },
]

const team = [
  { name: 'Dr. Alex Kim', role: 'CTO & Lab Director', focus: 'Conversational ERP, Agentic Systems', avatar: 'AK' },
  { name: 'Dr. Sarah Chen', role: 'Chief Research Officer', focus: 'Finance AI Benchmarks, ROI Modeling', avatar: 'SC' },
  { name: 'Dr. James Park', role: 'ML Research Lead', focus: 'Document Understanding, Multimodal', avatar: 'JP' },
  { name: 'Marcus Rodriguez', role: 'VP Analytics', focus: 'Predictive Finance, Benchmarks', avatar: 'MR' },
  { name: 'Elena Volkov', role: 'AI Governance Lead', focus: 'Compliance, Risk, EU AI Act', avatar: 'EV' },
  { name: 'Priya Sharma', role: 'Solutions Architecture Lead', focus: 'Production ML Ops, Integration', avatar: 'PS' },
]

// Waitlist form component
function WaitlistForm({ capabilitySlug }: { capabilitySlug?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/waitlist/innovation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, capabilitySlug }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage('This email is already on the waitlist.')
        } else {
          throw new Error(data.error || 'Failed to join waitlist')
        }
        setStatus('error')
        return
      }

      setStatus('success')
      setEmail('')
    } catch (error) {
      console.error('Waitlist error:', error)
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-strong rounded-xl p-8 text-center border border-brand-green-500/30 bg-brand-green-500/5">
        <div className="w-16 h-16 rounded-full bg-brand-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-brand-green-400" />
        </div>
        <h3 className="text-headline-lg text-brand-green-400 mb-2">You're on the List!</h3>
        <p className="text-body-md text-neutral-300">
          We'll notify you when {capabilitySlug ? 'this capability' : 'new research'} enters pilot or production.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong rounded-xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 glass"
          required
          disabled={status === 'submitting'}
        />
        <Button
          type="submit"
          className="glass-strong px-6 py-3 min-w-[140px]"
          disabled={status === 'submitting' || !email}
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Waitlist'
          )}
        </Button>
      </div>
      {errorMessage && (
        <p className="text-body-sm text-brand-red-400">{errorMessage}</p>
      )}
      <p className="text-body-xs text-neutral-500">
        No spam. Unsubscribe anytime. Read our{' '}
        <a href="/privacy" className="underline hover:text-brand-cyan-400">Privacy Policy</a>.
      </p>
    </form>
  )
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline' | 'ghost'

const statusColors: Record<string, BadgeVariant> = {
  production: 'success',
  pilot: 'warning',
  beta: 'info',
  research: 'ghost',
}

const statusLabels: Record<string, string> = {
  production: 'Production',
  pilot: 'Pilot / Beta',
  beta: 'Beta',
  research: 'Research',
}

export default function InnovationLabClient() {
  // Handle deep linking from assessment results
  const [highlightId, setHighlightId] = useState<string | null>(null)

  useEffect(() => {
    // Check URL hash first (e.g., #conversational-erp)
    const hash = window.location.hash.slice(1)
    if (hash && researchAreas.some(a => a.id === hash)) {
      setHighlightId(hash)
      // Scroll to element
      const element = document.getElementById(`research-${hash}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    // Also check query param ?capability=
    const params = new URLSearchParams(window.location.search)
    const capability = params.get('capability')
    if (capability && researchAreas.some(a => a.id === capability)) {
      setHighlightId(capability)
      const element = document.getElementById(`research-${capability}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  return (
    <div className="flex flex-col flex-1 w-full">
      <HeroPattern
        headline={{
          text: 'Innovation<br/>Lab',
          split: ['words', 'lines'],
          className: 'text-display-xl text-gradient-brand text-balance',
        }}
        subheadline={{
          text: 'Cutting-edge research on conversational ERP, GenAI document understanding, predictive finance, and AI governance. Open benchmarks, model cards, and experimental prototypes.',
          shape: 'wave',
          className: 'text-headline-lg text-neutral-300 dark:text-neutral-400 text-balance max-w-3xl',
        }}
        cta={{
          primary: { label: 'View Benchmarks', variant: 'default', className: 'glass-strong', href: '#benchmarks' },
          secondary: { label: 'Read Publications', variant: 'outline', className: 'glass', href: '#publications' },
        }}
        stats={{
          items: [
            { label: '6', value: 'Research Areas' },
            { label: '15+', value: 'Publications' },
            { label: '4', value: 'Open Benchmarks' },
            { label: '25', value: 'Team Members' },
          ],
        }}
        scrollIndicator={true}
        vignette={true}
        noise={true}
      />

      <main className="flex-1 w-full">
        {/* Research Areas */}
        <section className="py-24 px-6" aria-labelledby="research-heading">
          <Container size="xl">
            <Stack gap={12} className="w-full">
              <header className="text-center max-w-3xl mx-auto">
                <h2 id="research-heading" className="text-display-md text-gradient-brand text-balance mb-6">
                  Active Research Areas
                </h2>
                <p className="text-headline-md text-neutral-400 text-balance">
                  Six tracks pushing the boundary of what's possible in enterprise finance AI
                </p>
              </header>

              <div className="w-full flex justify-center py-12 relative mb-16">
                 {/* Decorative background glow */}
                 <div className="absolute inset-0 bg-brand-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
                 
                 <div className="relative z-10 w-full max-w-[1000px]">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan-500/20 via-brand-emerald-500/20 to-brand-cyan-500/20 rounded-[28px] blur-md" />
                    <div className="relative rounded-[24px] border border-white/10 bg-[#0d0b14]/80 backdrop-blur-xl p-2 shadow-2xl">
                      {/* Top bar (mock terminal/dashboard header) */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 mb-2">
                        <div className="flex gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        </div>
                        <div className="text-[10px] font-mono text-brand-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan-400 animate-pulse" />
                          Live Neural Vector Graph
                        </div>
                        <div className="text-[10px] font-mono text-white/30">
                          LAB_ENV_PROD_v2.4
                        </div>
                      </div>
                      
                      {/* Main Image */}
                      <div className="relative overflow-hidden rounded-xl border border-white/5 group">
                        <FloatingProduct
                          src="/images/innovation_lab_abstract_viz.jpg"
                          alt="Abstract Neural Network Data Visualization"
                          frames={['/images/innovation_lab_abstract_viz.jpg']}
                          mouseParallax={true}
                          parallaxStrength={0.15}
                          autoRotate={false}
                          width={1000}
                          height={500}
                          borderRadius="12px"
                          shadow={false}
                        />
                        {/* Overlay scanline effect */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] mix-blend-overlay opacity-50" />
                        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(13,11,20,0.8)] pointer-events-none" />
                      </div>
                    </div>
                 </div>
              </div>

              <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={6} className="w-full">
                {researchAreas.map((area, i) => (
                  <Card
                    key={area.id}
                    id={`research-${area.id}`}
                    className={`glass-card h-full group interactive ${highlightId === area.id ? 'ring-2 ring-brand-cyan-500/50' : ''}`}
                    style={{ animationDelay: `${i * 100}ms` }}
                    onClick={() => highlightId === area.id && setHighlightId(null)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-cyan-500/20 flex items-center justify-center">
                          <FlaskConical className="h-5 w-5 text-brand-cyan-400" />
                        </div>
                        <Badge variant={statusColors[area.status as keyof typeof statusColors]} className="text-body-xs">
                          {statusLabels[area.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <CardTitle className="text-headline-sm">{area.title}</CardTitle>
                      <p className="text-body-sm text-brand-cyan-300">{area.timeline}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-body-md text-neutral-300">{area.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {area.metrics.map((metric) => (
                          <Badge key={metric} variant="ghost" className="text-body-xs px-2 py-1">
                            {metric}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-body-xs text-neutral-400 pt-4 border-t border-white/10">
                        <span>Team: {area.team}</span>
                        <span>Papers: {area.publications}</span>
                      </div>

                      <div className="flex gap-2 pt-4">
                        {area.demoUrl && (
                          <Button variant="ghost" size="sm" className="flex-1" asChild>
                            <a href={area.demoUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" />
                              Demo
                            </a>
                          </Button>
                        )}
                        {area.githubUrl && (
                          <Button variant="ghost" size="sm" className="flex-1" asChild>
                            <a href={area.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                      {highlightId === area.id && (
                        <div className="flex items-center gap-2 text-body-xs text-brand-cyan-400 pt-2 border-t border-brand-cyan-500/20">
                          <span>← Deep-linked from assessment results. Click to dismiss highlight.</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </Container>
        </section>

        {/* Open Benchmarks */}
        <section id="benchmarks" className="py-24 px-6 bg-gradient-to-b from-brand-navy-900/50 to-transparent" aria-labelledby="benchmarks-heading">
          <Container size="xl">
            <Stack gap={12} className="w-full">
              <header className="text-center max-w-3xl mx-auto">
                <h2 id="benchmarks-heading" className="text-display-md text-gradient-brand text-balance mb-6">
                  Open Benchmarks
                </h2>
                <p className="text-headline-md text-neutral-400 text-balance">
                  Reproducible, transparent benchmarks for finance AI. Data, code, and methodology open-sourced.
                </p>
              </header>

              <div className="space-y-6">
                {benchmarks.map((benchmark, i) => (
                  <Card key={benchmark.name} className="glass-card group interactive" style={{ animationDelay: `${i * 100}ms` }}>
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant={benchmark.status === 'Published' ? 'success' : benchmark.status === 'In Progress' ? 'warning' : 'ghost'} className="text-body-xs">
                              {benchmark.status}
                            </Badge>
                            <span className="text-body-xs text-neutral-400">{benchmark.date}</span>
                          </div>
                          <h3 className="text-headline-lg text-white mb-2 group-hover:text-brand-cyan-300 transition-colors">{benchmark.name}</h3>
                          <p className="text-body-md text-neutral-400 mb-4">{benchmark.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {benchmark.metrics.map((metric) => (
                              <Badge key={metric} variant="outline" className="text-body-sm px-3 py-1">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={benchmark.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Results
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={benchmark.github} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" />
                              Code & Data
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Stack>
          </Container>
        </section>

        {/* Publications */}
        <section id="publications" className="py-24 px-6" aria-labelledby="publications-heading">
          <Container size="xl">
            <Stack gap={12} className="w-full">
              <header className="text-center max-w-3xl mx-auto">
                <h2 id="publications-heading" className="text-display-md text-gradient-brand text-balance mb-6">
                  Publications & Thought Leadership
                </h2>
                <p className="text-headline-md text-neutral-400 text-balance">
                  Peer-reviewed papers, whitepapers, and technical articles from our research team
                </p>
              </header>

              <div className="space-y-4">
                {publications.map((pub, i) => (
                  <Card key={pub.title} className="glass-card group interactive" style={{ animationDelay: `${i * 100}ms` }}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-body-xs">{pub.type}</Badge>
                            <span className="text-body-xs text-neutral-400">{new Date(pub.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                          </div>
                          <h3 className="text-headline-md text-white mb-2 group-hover:text-brand-cyan-300 transition-colors">{pub.title}</h3>
                          <p className="text-body-sm text-neutral-400">{pub.venue}</p>
                          <p className="text-body-sm text-neutral-500 mt-1">Authors: {pub.authors.join(', ')}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={pub.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Read
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Stack>
          </Container>
        </section>

        {/* Team */}
        <section className="py-24 px-6 bg-gradient-to-b from-brand-navy-900/50 to-transparent" aria-labelledby="team-heading">
          <Container size="xl">
            <Stack gap={12} className="w-full">
              <header className="text-center max-w-3xl mx-auto">
                <h2 id="team-heading" className="text-display-md text-gradient-brand text-balance mb-6">
                  Lab Team
                </h2>
                <p className="text-headline-md text-neutral-400 text-balance">
                  Researchers, engineers, and domain experts pushing finance AI forward
                </p>
              </header>

              <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={6} className="w-full max-w-4xl mx-auto">
                {team.map((member, i) => (
                  <Card key={member.name} className="glass-card text-center h-full" style={{ animationDelay: `${i * 100}ms` }}>
                    <CardContent className="p-8">
                      <div className="w-20 h-20 rounded-full bg-brand-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-2xl font-display text-brand-cyan-400">
                        {member.avatar}
                      </div>
                      <h4 className="text-headline-sm text-white mb-1">{member.name}</h4>
                      <Badge variant="outline" className="text-body-xs mb-4">{member.role}</Badge>
                      <p className="text-body-sm text-neutral-400">Focus: {member.focus}</p>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Stack>
          </Container>
        </section>

        {/* Get Involved */}
        <section className="py-24 px-6" aria-labelledby="involved-heading">
          <Container size="xl">
            <Stack gap={12} className="w-full max-w-3xl mx-auto text-center">
              <header>
                <h2 id="involved-heading" className="text-display-md text-gradient-brand text-balance mb-6">
                  Get Involved
                </h2>
                <p className="text-headline-md text-neutral-400 text-balance">
                  We collaborate with academia, industry partners, and open-source community
                </p>
              </header>

              <Grid columns={{ base: 1, md: 3 }} gap={6} className="w-full">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-brand-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                      <Github className="h-5 w-5 text-brand-cyan-400" />
                    </div>
                    <CardTitle className="text-headline-sm text-center">Open Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-neutral-400 text-center mb-6">Contribute to our benchmarks, models, and tools on GitHub</p>
                    <Button variant="ghost" className="w-full" asChild>
                      <a href="https://github.com/flowtaris-ai" target="_blank" rel="noopener noreferrer">
                        View Repositories
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card h-full">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-brand-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-5 w-5 text-brand-purple-400" />
                    </div>
                    <CardTitle className="text-headline-sm text-center">Research Collaboration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-neutral-400 text-center mb-6">Partner with us on joint research, benchmarking, or academic publications</p>
                    <Button variant="ghost" className="w-full" asChild>
                      <a href="mailto:research@flowtaris.ai">
                        Contact Research Team
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card h-full">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-brand-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-5 w-5 text-brand-green-400" />
                    </div>
                    <CardTitle className="text-headline-sm text-center">Join the Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-neutral-400 text-center mb-6">We're hiring ML researchers, engineers, and finance domain experts</p>
                    <Button variant="ghost" className="w-full" asChild>
                      <a href="/careers">
                        View Open Roles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Design Partner Program Waitlist */}
              <div className="pt-8">
                <Card className="glass-strong border border-brand-cyan-500/30 bg-gradient-to-r from-brand-cyan-500/5 to-transparent max-w-2xl mx-auto">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-brand-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                      <Rocket className="h-6 w-6 text-brand-cyan-400" />
                    </div>
                    <CardTitle className="text-headline-lg">Join the Design Partner Program</CardTitle>
                    <p className="text-body-md text-neutral-300 mt-2">
                      Get early access to pilot capabilities, influence product roadmap, and co-design with our research team
                    </p>
                  </CardHeader>
                  <CardContent>
                    <WaitlistForm capabilitySlug="conversational-erp" />
                  </CardContent>
                </Card>
              </div>
            </Stack>
          </Container>
        </section>

        {/* Newsletter */}
        <section className="py-24 px-6 bg-gradient-to-b from-brand-navy-900/50 to-transparent">
          <Container size="lg">
            <div className="glass-strong rounded-3xl p-8 md:p-12 text-center border border-brand-cyan-500/30 bg-gradient-to-r from-brand-cyan-500/5 to-transparent">
              <Lightbulb className="h-10 w-10 text-brand-cyan-400 mx-auto mb-6" />
              <h2 className="text-display-lg text-gradient-brand mb-4 text-balance">
                Stay at the Frontier
              </h2>
              <p className="text-headline-md text-neutral-300 mb-8 max-w-2xl mx-auto text-balance">
                Monthly updates on new research, benchmark results, open-source releases, and lab experiments. No spam.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <Input
                  type="email"
                  placeholder="researcher@university.edu"
                  className="flex-1 glass max-w-md"
                />
                <Button size="lg" className="glass-strong px-10 py-4" asChild>
                  <a href="#lab-newsletter">
                    Subscribe to Lab Notes
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
              <p className="text-body-xs text-neutral-500">Read our <a href="/privacy" className="underline hover:text-brand-cyan-400">Privacy Policy</a>.</p>
            </div>
          </Container>
        </section>
      </main>


    </div>
  )
}