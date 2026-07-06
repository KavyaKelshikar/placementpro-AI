import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Building2, CheckCircle2, ChevronRight, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Card from '../components/ui/Card';

const metrics = [
  { label: 'AI resume match score', value: '94%' },
  { label: 'Interview readiness', value: '12 hrs' },
  { label: 'Hiring partners', value: '180+' },
];

const features = [
  {
    title: 'AI resume intelligence',
    description: 'Surface skill gaps and personalize candidate recommendations with explainable insights.',
    icon: BrainCircuit,
  },
  {
    title: 'Trusted recruiter workflows',
    description: 'Give recruiters a premium operating system for pipeline management and outreach.',
    icon: ShieldCheck,
  },
  {
    title: 'Actionable performance analytics',
    description: 'Monitor placement velocity, profile strength, and hiring conversion in real time.',
    icon: TrendingUp,
  },
];

const testimonials = [
  {
    quote: 'PlacementPro AI gave our team a faster, more intelligent way to evaluate talent.',
    author: 'Maya Chen',
    role: 'Head of Talent, Northstar Labs',
  },
  {
    quote: 'The platform made my job search feel proactive, organized, and highly personalized.',
    author: 'Rohan Patel',
    role: 'Computer Science Graduate',
  },
];

const recruiters = ['Google', 'Microsoft', 'Amazon', 'Accenture', 'Infosys', 'TCS'];

const faqs = [
  { question: 'Who can use PlacementPro AI?', answer: 'The platform is designed for students, recruiters, and administrators with role-based experiences.' },
  { question: 'Does the system support document uploads?', answer: 'Yes, students can upload resumes and recruiters can manage job-related materials securely.' },
  { question: 'Is the platform production ready?', answer: 'The architecture is built for scaling with secure, modular services and responsive interfaces.' },
];

function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-soft backdrop-blur xl:grid-cols-[1.15fr_0.85fr] xl:p-12">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            <Sparkles className="h-4 w-4" />
            Next-generation placement intelligence
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Convert talent into offers with AI-native hiring operations.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              PlacementPro AI unifies student profiles, recruiter workflows, and recommendation intelligence into a single premium platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/auth" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Explore platform <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/student/dashboard" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              View dashboard
            </a>
          </div>
        </motion.div>
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Placement readiness</p>
              <p className="mt-2 text-3xl font-semibold">82.4%</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {metrics.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading eyebrow="Features" title="A premium operating system for hiring teams and candidates" description="Every feature is designed for clarity, speed, and measurable outcomes." />
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <Card key={title}>
              <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1fr_0.8fr]">
        <div>
          <SectionHeading eyebrow="Statistics" title="Real impact across placements and recruiter productivity" description="The platform helps institutions move faster with measurable operating leverage." />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: '3.2x', label: 'Faster shortlist turnaround' },
              { value: '91%', label: 'Resume-to-role relevance' },
              { value: '68%', label: 'Higher interview conversion' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
          <p className="text-sm text-slate-400">Trusted by modern campuses</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {recruiters.map((company) => (
              <div key={company} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">{company}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading eyebrow="Testimonials" title="Loved by students and hiring teams" description="Design choices prioritize trust, clarity, and modern SaaS polish." />
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author}>
              <div className="flex items-center gap-2 text-brand-600">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <CheckCircle2 key={idx} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-4 text-base leading-7 text-slate-600">“{testimonial.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-900">{testimonial.author}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" description="Everything you need to know about the platform experience." />
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-left text-sm font-semibold text-slate-800">
                {faq.question}
                <ChevronRight className="h-4 w-4" />
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-10 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-semibold">PlacementPro AI</p>
            <p className="mt-2 text-sm text-slate-400">AI-powered hiring platform for modern campuses and recruiting teams.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><Building2 className="h-4 w-4" /> Enterprise ready</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><ShieldCheck className="h-4 w-4" /> Secure access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
