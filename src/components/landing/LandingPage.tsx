'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Sparkles,
  Layout,
  Shield,
  Eye,
  Download,
  Target,
  Star,
  ArrowRight,
  Check,
  Zap,
  FileText,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Sparkles,
    title: 'AI Writing Assistant',
    description:
      'Let AI craft compelling bullet points and summaries tailored to your experience and industry.',
  },
  {
    icon: Layout,
    title: 'Professional Templates',
    description:
      'Choose from a curated collection of modern, classic, and creative resume designs.',
  },
  {
    icon: Shield,
    title: 'ATS Friendly',
    description:
      'Every template is optimized to pass Applicant Tracking Systems so your resume gets seen.',
  },
  {
    icon: Eye,
    title: 'Real-time Preview',
    description:
      'See changes instantly as you edit — no guessing how your resume will look.',
  },
  {
    icon: Download,
    title: 'Multiple Export Formats',
    description:
      'Export your resume as PDF or DOCX with pixel-perfect formatting every time.',
  },
  {
    icon: Target,
    title: 'Job Tailoring',
    description:
      'AI tailors your resume to specific job descriptions, increasing your match rate.',
  },
];

const templates = [
  { name: 'Modern Professional', gradient: 'from-emerald-500 to-teal-600', premium: false },
  { name: 'Classic Elegant', gradient: 'from-teal-500 to-cyan-600', premium: false },
  { name: 'Creative Bold', gradient: 'from-amber-500 to-orange-600', premium: true },
  { name: 'Minimal Clean', gradient: 'from-stone-400 to-stone-600', premium: false },
  { name: 'Executive Suite', gradient: 'from-rose-500 to-pink-600', premium: true },
  { name: 'Tech Forward', gradient: 'from-emerald-600 to-green-700', premium: true },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at Stripe',
    quote:
      'ResumeAI helped me land 3 interviews in one week. The AI suggestions were spot-on and made my experience sound so much more impactful.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Senior Engineer at Netflix',
    quote:
      'The ATS optimization alone is worth it. I went from zero callbacks to multiple offers after switching to a ResumeAI template.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Lead at HubSpot',
    quote:
      'I love how easy it is to tailor my resume for different roles. The AI writing assistant saves me hours of work every time I apply.',
    rating: 5,
  },
];

const footerLinks = {
  Product: ['Features', 'Templates', 'Pricing', 'Changelog'],
  Resources: ['Blog', 'Resume Guide', 'Career Tips', 'Help Center'],
  Company: ['About', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Cookie Policy', 'GDPR'],
};

// ─── Section wrapper with in-view detection ────────────────────────────────────

function AnimatedSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Star rating component ─────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { setCurrentPage } = useAppStore();
  const templatesRef = useRef<HTMLDivElement>(null);

  const scrollToTemplates = () => {
    templatesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ─── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <FileText className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ResumeAI</span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#templates" className="hover:text-foreground transition-colors">
              Templates
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage('login')}
            >
              Log in
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-sm"
              onClick={() => setCurrentPage('signup')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 size-[500px] rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />
          <div className="absolute -bottom-40 right-1/4 size-[500px] rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-500/5" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col gap-6"
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge
                  variant="secondary"
                  className="w-fit gap-1.5 px-3 py-1 text-xs font-medium"
                >
                  <Zap className="size-3 text-emerald-500" />
                  Powered by AI
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
              >
                Build Professional Resume in Minutes{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  with AI
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed"
              >
                AI-powered resume builder with professional templates, ATS
                optimization, and expert writing assistance.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-md gap-2"
                  onClick={() => setCurrentPage('signup')}
                >
                  Start Building
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={scrollToTemplates}
                >
                  View Templates
                  <ChevronRight className="size-4" />
                </Button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-4 pt-2 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-500" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-500" /> Free forever plan
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-500" /> Cancel anytime
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Resume mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-2xl" />

                {/* Resume card mockup */}
                <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
                  {/* Title bar */}
                  <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/50">
                    <div className="size-3 rounded-full bg-red-400" />
                    <div className="size-3 rounded-full bg-amber-400" />
                    <div className="size-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs text-muted-foreground">
                      resume_sarah_chen.pdf
                    </span>
                  </div>

                  {/* Resume content mock */}
                  <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="h-5 w-36 rounded bg-foreground/15 mb-1" />
                        <div className="h-3 w-28 rounded bg-muted-foreground/20" />
                      </div>
                      <div className="size-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-emerald-500/30" />
                      <div className="h-2 w-full rounded bg-muted-foreground/10" />
                      <div className="h-2 w-5/6 rounded bg-muted-foreground/10" />
                      <div className="h-2 w-4/6 rounded bg-muted-foreground/10" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-emerald-500/30" />
                      <div className="h-2 w-full rounded bg-muted-foreground/10" />
                      <div className="h-2 w-3/4 rounded bg-muted-foreground/10" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-16 rounded bg-emerald-500/30" />
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Node.js', 'Python', 'SQL'].map(
                          (s) => (
                            <span
                              key={s}
                              className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                            >
                              {s}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating AI badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-4 top-8 rounded-xl border bg-card p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                      <Sparkles className="size-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">AI Suggestion</div>
                      <div className="text-[10px] text-muted-foreground">
                        +23% impact score
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating ATS badge */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                  className="absolute -left-4 bottom-16 rounded-xl border bg-card p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <Shield className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">ATS Score</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        98 / 100
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ───────────────────────────────────────────── */}
      <AnimatedSection
        id="features"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Sparkles className="size-3 text-emerald-500" /> Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to land your dream job
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From AI-powered writing to ATS optimization, ResumeAI gives you every
            advantage in today&apos;s competitive job market.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i}>
              <Card className="h-full transition-shadow duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <f.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {f.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ─── Templates Preview Section ──────────────────────────────────── */}
      <section
        id="templates"
        ref={templatesRef}
        className="bg-muted/40 border-y"
      >
        <AnimatedSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Layout className="size-3 text-emerald-500" /> Templates
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Choose Your Template
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Professionally designed templates that make a lasting impression on
              recruiters and hiring managers.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t, i) => (
              <motion.div key={t.name} variants={scaleIn} custom={i}>
                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* Gradient mock preview */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                    />
                    {/* Resume lines overlay */}
                    <div className="absolute inset-0 p-5 flex flex-col gap-2">
                      <div className="h-4 w-2/3 rounded bg-white/30" />
                      <div className="h-2 w-1/2 rounded bg-white/20" />
                      <div className="mt-3 space-y-1.5">
                        <div className="h-2 w-full rounded bg-white/15" />
                        <div className="h-2 w-5/6 rounded bg-white/15" />
                        <div className="h-2 w-4/6 rounded bg-white/15" />
                      </div>
                      <div className="mt-2 space-y-1.5">
                        <div className="h-2 w-full rounded bg-white/15" />
                        <div className="h-2 w-3/4 rounded bg-white/15" />
                      </div>
                      <div className="mt-auto flex flex-wrap gap-1">
                        {['Skill 1', 'Skill 2', 'Skill 3'].map((s) => (
                          <span
                            key={s}
                            className="rounded bg-white/20 px-1.5 py-0.5 text-[8px] text-white/70"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Premium badge */}
                    {t.premium && (
                      <div className="absolute top-3 right-3">
                        <Badge className="gap-1 bg-amber-500 text-white border-amber-500 shadow-sm">
                          <Crown className="size-3" />
                          Premium
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardFooter className="py-3">
                    <span className="text-sm font-medium">{t.name}</span>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ─── Pricing Section ────────────────────────────────────────────── */}
      <AnimatedSection
        id="pricing"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Zap className="size-3 text-emerald-500" /> Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free and upgrade when you need more power. No hidden fees, no
            surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div variants={fadeUp} custom={0}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">Free Plan</CardTitle>
                <CardDescription>
                  Perfect for getting started with your first resume.
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    '1 Resume',
                    '3 Templates',
                    '5 AI Credits',
                    'Basic Export',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentPage('signup')}
                >
                  Get Started Free
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Premium Plan */}
          <motion.div variants={fadeUp} custom={1}>
            <Card className="h-full relative border-emerald-500 shadow-lg shadow-emerald-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-sm">
                  Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Premium Plan</CardTitle>
                <CardDescription>
                  For serious job seekers who want every advantage.
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">$9.99</span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    'Unlimited Resumes',
                    'All Templates',
                    'Unlimited AI Credits',
                    'PDF & DOCX Export',
                    'Priority Support',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-sm"
                  onClick={() => setCurrentPage('signup')}
                >
                  Start Premium Trial
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ─── Testimonials Section ───────────────────────────────────────── */}
      <section className="bg-muted/40 border-y">
        <AnimatedSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Star className="size-3 text-emerald-500" /> Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Loved by thousands of job seekers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t just take our word for it — hear from people who landed
              their dream jobs with ResumeAI.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i}>
                <Card className="h-full">
                  <CardHeader>
                    <StarRating count={t.rating} />
                    <CardDescription className="mt-2 leading-relaxed text-foreground/80">
                      &ldquo;{t.quote}&rdquo;
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                        {t.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────────────────── */}
      <AnimatedSection className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          variants={scaleIn}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 sm:p-12 lg:p-16 text-center"
        >
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-white/10" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to build your perfect resume?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
              Join thousands of professionals who&apos;ve already upgraded their job
              search with ResumeAI.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-white/90 shadow-md gap-2"
                onClick={() => setCurrentPage('signup')}
              >
                Start Building Free
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-1">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <FileText className="size-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">ResumeAI</span>
              </button>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered resume builder that helps you create professional resumes
                in minutes.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
