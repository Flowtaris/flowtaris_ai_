'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
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

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <div className="flex flex-col flex-1 w-full bg-[#0a0812]">
      {/* --- CUSTOM 3D ANIMATED HERO --- */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Animated Background Gradients & Grids */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <motion.div 
            style={{ y, opacity }}
            className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-brand-cyan-500/10 blur-[120px]" 
          />
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "80%"]), opacity }}
            className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-purple-500/10 blur-[120px]" 
          />
        </div>

        <Container size="xl" className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan-500/30 bg-brand-cyan-500/10 backdrop-blur-md mb-8">
              <FlaskConical className="h-4 w-4 text-brand-cyan-400" />
              <span className="text-[12px] font-mono tracking-[0.2em] text-brand-cyan-300 uppercase">Research & Development</span>
            </div>
            
            <h1 className="text-display-2xl md:text-[120px] font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-600 mb-6 drop-shadow-2xl">
              Innovation<br/>
              <span className="text-gradient-brand">Lab</span>
            </h1>
            
            <p className="text-headline-lg md:text-display-sm text-neutral-400 max-w-3xl mx-auto text-balance mb-12">
              Cutting-edge research on <span className="text-white">conversational ERP</span>, <span className="text-white">GenAI document understanding</span>, and <span className="text-white">predictive finance</span>.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="glass-strong px-8 hover:ring-2 hover:ring-brand-cyan-500/50 transition-all duration-300" asChild>
                <a href="#research-tracks">Explore Tracks <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
              <Button size="lg" variant="outline" className="glass px-8 hover:bg-white/5 transition-all duration-300" asChild>
                <a href="#benchmarks">View Benchmarks</a>
              </Button>
            </div>
          </motion.div>
        </Container>
      </motion.section>

      <main className="flex-1 w-full relative z-20 bg-[#0a0812]">
        
        {/* --- INTERACTIVE BENTO / STICKY RESEARCH TRACKS --- */}
        <section id="research-tracks" className="py-32 px-6 relative" aria-labelledby="research-heading">
          <Container size="xl">
            <header className="text-center max-w-3xl mx-auto mb-24">
              <h2 id="research-heading" className="text-display-lg text-gradient-brand text-balance mb-6">
                Active Research Tracks
              </h2>
              <p className="text-headline-md text-neutral-400 text-balance">
                Six tracks pushing the boundary of what's possible in enterprise finance AI.
              </p>
            </header>

            <div className="flex flex-col gap-32">
              {researchAreas.map((area, i) => {
                // Assign unique visuals based on track
                const imageMap: Record<string, string> = {
                  'predictive-finance': '/images/predictive_finance_viz.jpg',
                  'agentic-workflows': '/images/agentic_workflow_viz.jpg',
                }
                const imageSrc = imageMap[area.id] || '/images/innovation_lab_abstract_viz.jpg'

                const isEven = i % 2 === 0;

                return (
                  <motion.div 
                    key={area.id}
                    id={`research-${area.id}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
                  >
                    {/* Visual Side (Bento styling) */}
                    <div className="w-full lg:w-1/2">
                      <div className="relative group perspective-1000">
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-cyan-500/20 to-brand-purple-500/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative rounded-[24px] overflow-hidden border border-white/10 bg-[#13111c] shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02] group-hover:rotate-y-2">
                           <div className="flex items-center px-4 py-3 border-b border-white/5 bg-black/40">
                             <div className="flex gap-2">
                               <div className="w-3 h-3 rounded-full bg-neutral-600" />
                               <div className="w-3 h-3 rounded-full bg-neutral-600" />
                               <div className="w-3 h-3 rounded-full bg-neutral-600" />
                             </div>
                             <div className="mx-auto text-[10px] font-mono tracking-widest text-brand-cyan-400 uppercase opacity-70">
                               TRACK_{area.id.toUpperCase().replace('-', '_')}
                             </div>
                           </div>
                           <img 
                             src={imageSrc} 
                             alt={area.title}
                             className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105 opacity-90 mix-blend-screen"
                           />
                        </div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                      <Badge variant={statusColors[area.status as keyof typeof statusColors]} className="text-body-sm px-3 py-1 mb-6 glass-strong uppercase tracking-widest">
                        {statusLabels[area.status as keyof typeof statusLabels]}
                      </Badge>
                      <h3 className="text-display-sm text-white mb-6 leading-tight">{area.title}</h3>
                      <p className="text-headline-sm text-neutral-400 mb-8 max-w-lg">{area.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-8">
                        {area.metrics.map((metric, idx) => (
                          <div key={idx} className="glass rounded-xl p-4 border border-white/5 hover:border-brand-cyan-500/30 transition-colors duration-300">
                            <span className="block text-body-sm text-brand-cyan-300 font-mono mb-1">{metric.split(':')[0]}</span>
                            <span className="block text-headline-sm text-white">{metric.split(':')[1] || metric}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        {area.demoUrl && (
                          <Button className="glass-strong" asChild>
                            <a href={area.demoUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" /> Live Demo
                            </a>
                          </Button>
                        )}
                        {area.githubUrl && (
                          <Button variant="outline" className="glass" asChild>
                            <a href={area.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" /> Source Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* Open Benchmarks (Preserved but styled up) */}
        <section id="benchmarks" className="py-32 px-6 bg-gradient-to-b from-[#13111c] to-[#0a0812] relative overflow-hidden" aria-labelledby="benchmarks-heading">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
          <Container size="xl" className="relative z-10">
            <Stack gap={12} className="w-full">
              <header className="text-center max-w-3xl mx-auto">
                <h2 id="benchmarks-heading" className="text-display-md text-white mb-6">
                  Open Benchmarks
                </h2>
                <p className="text-headline-md text-neutral-400">
                  Reproducible, transparent benchmarks for finance AI. Data, code, and methodology open-sourced.
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {benchmarks.map((benchmark, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    key={benchmark.name}
                  >
                    <Card className="glass-card group hover:border-brand-cyan-500/30 transition-all duration-500 h-full">
                      <CardContent className="p-8 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                          <Badge variant={benchmark.status === 'Published' ? 'success' : benchmark.status === 'In Progress' ? 'warning' : 'ghost'} className="text-body-xs uppercase tracking-wider">
                            {benchmark.status}
                          </Badge>
                          <span className="text-body-xs text-neutral-500 font-mono">{benchmark.date}</span>
                        </div>
                        <h3 className="text-headline-lg text-white mb-4 group-hover:text-brand-cyan-300 transition-colors">{benchmark.name}</h3>
                        <p className="text-body-md text-neutral-400 mb-8 flex-1">{benchmark.description}</p>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-white/5">
                          <div className="flex flex-wrap gap-2">
                            {benchmark.metrics.map((metric) => (
                              <Badge key={metric} variant="outline" className="text-body-xs px-2 py-1 bg-white/5">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="hover:bg-brand-cyan-500/10 hover:text-brand-cyan-300" asChild>
                              <a href={benchmark.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-white/10" asChild>
                              <a href={benchmark.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Stack>
          </Container>
        </section>

        {/* Newsletter & Footer CTA */}
        <section className="py-32 px-6">
          <Container size="lg">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[40px] p-8 md:p-16 text-center border border-white/10 bg-[#13111c] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan-500/10 via-transparent to-brand-purple-500/10 opacity-50" />
              <div className="relative z-10">
                <Lightbulb className="h-12 w-12 text-brand-cyan-400 mx-auto mb-8 animate-pulse" />
                <h2 className="text-display-lg text-white mb-6">
                  Stay at the Frontier
                </h2>
                <p className="text-headline-md text-neutral-400 mb-10 max-w-2xl mx-auto">
                  Monthly updates on new research, benchmark results, open-source releases, and lab experiments. No spam.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <Input
                    type="email"
                    placeholder="researcher@university.edu"
                    className="flex-1 glass max-w-md h-14 text-lg px-6 rounded-2xl"
                  />
                  <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-neutral-200 transition-colors" asChild>
                    <a href="#lab-newsletter">
                      Subscribe <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
                <p className="text-body-xs text-neutral-500">Read our <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.</p>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
    </div>
  )
}