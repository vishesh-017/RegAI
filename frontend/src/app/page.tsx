import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Bot, FileText, CheckCircle2, Server, Lock, ChevronRight, BarChart2, GitCompare, Building2, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function LandingPage() {
  return (
    <div className="w-full bg-background font-sans selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 rounded-md p-1">
                <img src="/logo.svg" className="h-5 w-5 text-white" alt="BrahmOS" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-foreground">BrahmOS</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
                <a href="#tech" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Technology</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link href="/dashboard" className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                Launch App <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8 border border-primary/20">
            <SparklesIcon className="h-3.5 w-3.5" />
            BrahmOS Regulatory AI 2.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground mb-8 max-w-4xl mx-auto leading-tight">
            From Regulatory Text to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Operational Action</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop manually reading circulars. BrahmOS uses advanced AI to automatically extract obligations, assign workflows, and ensure 100% compliance across your enterprise.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="#workflow" className="w-full sm:w-auto btn-secondary px-8 py-4 text-lg flex items-center justify-center gap-2">
              See How It Works
            </Link>
          </div>
        </div>
      </div>

      {/* Supported Regulators */}
      <div className="py-12 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-10">Trusted by institutions regulated by</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70 hover:opacity-100 transition-opacity">
            {[
              { name: "SEBI", icon: ShieldCheck },
              { name: "RBI", icon: Building2 },
              { name: "IRDAI", icon: ShieldCheck },
              { name: "PFRDA", icon: Building2 },
              { name: "NSE", icon: TrendingUp },
              { name: "BSE", icon: TrendingUp },
              { name: "CDSL", icon: Server },
              { name: "NSDL", icon: Server },
            ].map(reg => (
              <div key={reg.name} className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-all duration-300">
                <reg.icon className="h-6 w-6" />
                <span className="text-2xl font-black tracking-tighter">{reg.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem vs Solution */}
      <div className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                The compliance bottleneck is slowing you down.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Manually reading 100-page circulars, tracking obligations in spreadsheets, and chasing departments for updates is a recipe for compliance failure and massive fines.
              </p>
              <ul className="space-y-4">
                {[
                  "Missed critical deadlines due to human error",
                  "Siloed communication across risk departments",
                  "Lack of a centralized audit trail"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <XCircleIcon className="h-6 w-6 text-red-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 dark:opacity-40"></div>
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bot className="h-8 w-8 text-indigo-600" />
                  The BrahmOS Solution
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our LLM-powered engine parses circulars in seconds, mapping exact rules to departments, generating workflow tasks, and enforcing a strict human-in-the-loop review layer.
                </p>
                <ul className="space-y-4">
                  {[
                    "AI extraction in under 5 seconds",
                    "Automated task delegation to departments",
                    "Immutable cryptographic audit logs"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                      <span className="text-slate-900 dark:text-slate-200 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bento Grid */}
      <div id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">Enterprise Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to automate your regulatory compliance lifecycle.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
              <GitCompare className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold tracking-tight text-card-foreground mb-3">Regulatory Change Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Instantly compare a new circular against previous versions. Our AI highlights Added Rules, Modified Deadlines, and Penalty Changes with pinpoint accuracy, so you never miss a subtle regulatory shift.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
              <ShieldCheck className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold tracking-tight text-card-foreground mb-3">Trust Layer</h3>
              <p className="text-muted-foreground">
                Every AI generation requires explicit human approval. Edits are tracked securely in our immutable Audit Logs.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
              <BarChart2 className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold tracking-tight text-card-foreground mb-3">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Monitor compliance health, department performance, and task completion metrics in a beautiful interactive dashboard.
              </p>
            </div>

            <div className="md:col-span-2 bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
              <Zap className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold tracking-tight text-card-foreground mb-3">Omnibar Global Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hit <kbd className="px-2 py-1 bg-muted rounded mx-1 text-xs font-mono border border-border">Ctrl + K</kbd> to instantly search across thousands of Circulars, Obligations, Workflow Tasks, and Reports in milliseconds. Your entire organization&apos;s compliance brain at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Stepper */}
      <div id="workflow" className="py-24 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Three simple steps to absolute compliance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Upload Circular", desc: "Drag and drop your PDF regulatory circulars securely into the system." },
              { num: "02", title: "AI Extraction", desc: "Our engine maps out rules, confidence scores, and source citations." },
              { num: "03", title: "Assign & Track", desc: "Approve the generated obligations and track department execution." }
            ].map((step, i) => (
              <div key={i} className="relative p-8 border border-border rounded-xl bg-card">
                <div className="text-5xl font-black text-muted/30 mb-6">{step.num}</div>
                <h3 className="text-xl font-bold tracking-tight text-card-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
                {i !== 2 && <ChevronRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-8 w-8 text-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div id="tech" className="py-24 bg-background text-center border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10">Built with modern enterprise technology</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl text-foreground"><Server className="h-6 w-6" /> Next.js 14</div>
            <div className="flex items-center gap-2 font-bold text-xl text-foreground"><DatabaseIcon className="h-6 w-6" /> Prisma ORM</div>
            <div className="flex items-center gap-2 font-bold text-xl text-foreground"><PaintbrushIcon className="h-6 w-6" /> Tailwind CSS</div>
            <div className="flex items-center gap-2 font-bold text-xl text-foreground"><Bot className="h-6 w-6" /> OpenAI / Gemini</div>
          </div>
        </div>
      </div>

      {/* Enterprise Statistics */}
      <div className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-black mb-3 tracking-tighter">
                <AnimatedCounter end={14500} suffix="+" />
              </div>
              <div className="text-background/60 font-bold tracking-[0.2em] uppercase text-xs">Circulars Processed</div>
            </div>
            <div className="p-6 border-y md:border-y-0 md:border-x border-background/10">
              <div className="text-5xl md:text-6xl font-black mb-3 tracking-tighter">
                <AnimatedCounter end={320} suffix="+" />
              </div>
              <div className="text-background/60 font-bold tracking-[0.2em] uppercase text-xs">Organizations Supported</div>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-black mb-3 tracking-tighter">
                <AnimatedCounter end={1250} suffix="K+" />
              </div>
              <div className="text-background/60 font-bold tracking-[0.2em] uppercase text-xs">Compliance Tasks Automated</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-background border-y border-border py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">Ready to automate compliance?</h2>
          <p className="text-muted-foreground text-lg mb-10">Join forward-thinking organizations using BrahmOS to eliminate regulatory risk.</p>
          <Link href="/dashboard" className="inline-flex items-center justify-center btn-primary px-8 py-4 text-lg">
            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary rounded-md p-1">
                <img src="/logo.svg" className="h-5 w-5 text-primary-foreground" alt="BrahmOS" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-foreground">BrahmOS</span>
            </div>
            <p className="text-sm max-w-sm">
              The premier AI platform for regulatory change management. Transforming compliance into a strategic advantage.
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Enterprise</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border text-xs text-center uppercase tracking-widest text-muted-foreground">
          &copy; {new Date().getFullYear()} BrahmOS Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}



// Inline missing icons for quick rendering
function SparklesIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}

function XCircleIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
}

function DatabaseIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
}

function PaintbrushIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
}
