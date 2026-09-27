"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

interface LandingPageViewProps {
  onOpenWorkspace: () => void;
}

export function LandingPageView({ onOpenWorkspace }: LandingPageViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // 1. Hero Reveal Animations
      gsap.from(".hero-text-elem", {
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".hero-visual-card", {
        opacity: 0,
        y: 45,
        scale: 0.96,
        duration: 1.1,
        delay: 0.35,
        ease: "power3.out",
      });

      // 2. Section Reveal Animations with ScrollTrigger
      const sections = gsap.utils.toArray<HTMLElement>(".scroll-reveal-sec");
      sections.forEach((sec) => {
        const animElems = sec.querySelectorAll(".anim-fade-up");
        if (animElems.length > 0) {
          gsap.fromTo(
            animElems,
            { opacity: 0, y: 30 },
            {
              scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                once: true,
              },
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power2.out",
              clearProps: "opacity,transform",
            }
          );
        }
      });

      // 3. Problem Evolution Animated Steps
      gsap.fromTo(".problem-step-card",
        { opacity: 0, x: -24 },
        {
          scrollTrigger: {
            trigger: ".problem-section",
            start: "top 85%",
            once: true,
          },
          opacity: 1,
          x: 0,
          stagger: 0.18,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "opacity,transform",
        }
      );

      // 4. Stateful Invoicing Turn Animation
      gsap.fromTo(".stateful-turn-card",
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: ".stateful-section",
            start: "top 85%",
            once: true,
          },
          opacity: 1,
          y: 0,
          stagger: 0.16,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "opacity,transform",
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full font-sans bg-[#FFFFFF] text-[#0B0B0D] selection:bg-[#0B0B0D] selection:text-[#FFFFFF]">
      {/* ------------------------------------------------------------- */}
      {/* NAVBAR (Obsidian / Soft Translucent) */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#0B0B0D]/90 backdrop-blur-md z-50 border-b border-white/10 px-4 sm:px-8 text-white transition-all">
        <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenWorkspace}>
            <div className="h-9 w-9 rounded-lg bg-white text-[#0B0B0D] flex items-center justify-center font-black text-sm shadow-md">
              IF
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              InvoFlow
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm text-[#E7E7E5]/80 font-medium">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#stateful-invoicing" className="hover:text-white transition-colors">
              Why InvoFlow
            </a>
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F7F7F5] active:bg-[#E7E7E5] text-[#0B0B0D] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Create Invoice</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION (LIGHT SURFACE #FFFFFF) */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-36 pb-24 px-4 sm:px-8 bg-[#FFFFFF] text-[#0B0B0D] relative overflow-hidden border-b border-[#0B0B0D]/10">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-8">
          
          <div className="hero-text-elem inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7F7F5] border border-[#0B0B0D]/10 text-xs font-semibold text-[#0B0B0D] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#0B0B0D] animate-ping"></span>
            <span className="tracking-wide uppercase text-[10px] font-bold text-[#6B6B6B]">Session-Based Conversational Engine</span>
          </div>

          <h1 className="hero-text-elem font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl text-[#0B0B0D]">
            Turn Client Conversations Into Invoices.
          </h1>

          <p className="hero-text-elem max-w-2xl text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
            Paste what your client said. InvoFlow understands the request and turns it into a professional invoice that evolves as the conversation changes.
          </p>

          <div className="hero-text-elem flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0B0B0D] hover:bg-[#1c1b1d] active:bg-[#000000] text-white text-base font-bold shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <span>Create an Invoice</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#F7F7F5] hover:bg-[#E7E7E5] text-[#0B0B0D] text-base font-bold border border-[#0B0B0D]/10 transition-all text-center"
            >
              See How It Works
            </a>
          </div>

          {/* Hero Product Visual (Obsidian Black Surface contrast) */}
          <div className="hero-visual-card w-full max-w-4xl mt-8 rounded-2xl bg-[#0B0B0D] border border-white/10 p-6 sm:p-8 text-white text-left shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-white/20"></span>
                  <span className="w-3 h-3 rounded-full bg-white/20"></span>
                  <span className="w-3 h-3 rounded-full bg-white/20"></span>
                </div>
                <span className="text-xs font-mono text-[#E7E7E5]/60 pl-2">live-extraction-preview.inv</span>
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded">
                Verified Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Client Message Side */}
              <div className="md:col-span-5 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Client Message (WhatsApp / Email)
                </span>
                <p className="text-xs sm:text-sm text-[#F7F7F5] font-mono leading-relaxed italic">
                  &ldquo;I need 3 Instagram posts and a logo for my new brand.&rdquo;
                </p>
              </div>

              {/* Transformation Indicator */}
              <div className="md:col-span-2 flex justify-center py-2">
                <div className="h-10 w-10 rounded-full bg-white text-[#0B0B0D] flex items-center justify-center font-black shadow-lg">
                  →
                </div>
              </div>

              {/* InvoFlow Generated Item Side */}
              <div className="md:col-span-5 p-4 rounded-xl bg-white/10 border border-white/20 flex flex-col gap-3">
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Generated Invoice</span>
                  <span className="text-emerald-400 font-mono text-xs">₹7,400 INR</span>
                </span>
                
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-[#E7E7E5]">Social Media Post Design × 3</span>
                    <span className="font-mono text-white">₹2,400</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#E7E7E5]">Logo Design × 1</span>
                    <span className="font-mono text-white">₹5,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PROBLEM & EVOLUTION SECTION (OBSIDIAN BLACK #0B0B0D) */}
      {/* ------------------------------------------------------------- */}
      <section className="problem-section scroll-reveal-sec py-24 px-4 sm:px-8 bg-[#0B0B0D] text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          
          <div className="anim-fade-up text-center flex flex-col items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B]">The Real Problem</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              Client requirements change constantly.
            </h2>
            <p className="text-sm sm:text-base text-[#E7E7E5]/70 max-w-xl">
              Traditional invoice tools force you to re-type line items every time a client edits their request. InvoFlow statefully tracks the conversation.
            </p>
          </div>

          {/* Realistic Conversation Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Turn 1 */}
            <div className="problem-step-card p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#6B6B6B]">TURN 01</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white font-mono">₹7,400</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E7E7E5] font-mono italic">
                &ldquo;I need 3 Instagram posts and a logo.&rdquo;
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-[#6B6B6B]">
                • 3 × Social Posts (₹2,400)<br />
                • 1 × Logo Design (₹5,000)
              </div>
            </div>

            {/* Turn 2 */}
            <div className="problem-step-card p-6 rounded-2xl bg-white/10 border border-white/20 flex flex-col gap-4 relative shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">TURN 02</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">₹9,000</span>
              </div>
              <p className="text-xs sm:text-sm text-white font-mono italic">
                &ldquo;Actually, make the posts 5.&rdquo;
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-[#E7E7E5]">
                • <strong className="text-emerald-400">5 × Social Posts (₹4,000)</strong><br />
                • 1 × Logo Design (₹5,000)
              </div>
            </div>

            {/* Turn 3 */}
            <div className="problem-step-card p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#6B6B6B]">TURN 03</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white font-mono font-bold">₹4,000</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E7E7E5] font-mono italic">
                &ldquo;Remove the logo for now.&rdquo;
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-[#6B6B6B]">
                • 5 × Social Posts (₹4,000)<br />
                • <span className="line-through text-red-400">Logo Design (Removed)</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* HOW IT WORKS SECTION (SOFT WHITE #F7F7F5) */}
      {/* ------------------------------------------------------------- */}
      <section id="how-it-works" className="scroll-reveal-sec py-24 px-4 sm:px-8 bg-[#F7F7F5] text-[#0B0B0D] border-b border-[#0B0B0D]/10">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          
          <div className="anim-fade-up text-center flex flex-col items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B]">Simple 4-Step Sequence</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              How InvoFlow Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#0B0B0D]/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span className="font-mono text-3xl font-black text-[#0B0B0D]">01</span>
              <h3 className="font-heading text-lg font-bold">Paste Conversation</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Copy raw messages from WhatsApp, Slack, or Email directly into InvoFlow.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#0B0B0D]/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span className="font-mono text-3xl font-black text-[#0B0B0D]">02</span>
              <h3 className="font-heading text-lg font-bold">AI Extraction</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                InvoFlow extracts deliverables, quantity changes, and matches your rate catalog.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#0B0B0D]/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span className="font-mono text-3xl font-black text-[#0B0B0D]">03</span>
              <h3 className="font-heading text-lg font-bold">Live Review</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Tweak quantities, rates, and recipient details right inside the live invoice preview.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#0B0B0D]/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <span className="font-mono text-3xl font-black text-[#0B0B0D]">04</span>
              <h3 className="font-heading text-lg font-bold">Export Verified PDF</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Download a clean, high-precision PDF invoice formatted in INR instantly.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STATEFUL INVOICING DIFFERENTIATOR (OBSIDIAN BLACK #0B0B0D) */}
      {/* ------------------------------------------------------------- */}
      <section id="stateful-invoicing" className="stateful-section scroll-reveal-sec py-24 px-4 sm:px-8 bg-[#0B0B0D] text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          
          <div className="anim-fade-up flex-1 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-white w-max">
              Core Differentiator
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Not a one-shot <br />invoice generator.
            </h2>
            <p className="text-sm sm:text-base text-[#E7E7E5]/70 leading-relaxed max-w-lg">
              Your invoice keeps evolving as your client&apos;s requirements change over time. Every new message updates the ledger dynamically without creating duplicate items or losing context.
            </p>
            
            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="px-6 py-3 rounded-xl bg-white hover:bg-[#F7F7F5] text-[#0B0B0D] text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                Try Stateful Workspace →
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col gap-3">
            
            <div className="stateful-turn-card p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="font-mono text-[#E7E7E5]">Turn #1: &ldquo;3 Instagram posts & logo&rdquo;</span>
              <span className="font-mono text-white font-bold">₹7,400</span>
            </div>

            <div className="stateful-turn-card p-4 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between text-xs">
              <span className="font-mono text-emerald-300">Turn #2: &ldquo;Make posts 5&rdquo;</span>
              <span className="font-mono text-emerald-300 font-bold">Quantity Updated (3 → 5)</span>
            </div>

            <div className="stateful-turn-card p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="font-mono text-[#E7E7E5]">Turn #3: &ldquo;Remove logo for now&rdquo;</span>
              <span className="font-mono text-red-300 font-bold">Item Removed</span>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SESSION-BASED DESIGN & PRIVACY (PURE WHITE #FFFFFF) */}
      {/* ------------------------------------------------------------- */}
      <section id="privacy" className="scroll-reveal-sec py-24 px-4 sm:px-8 bg-[#FFFFFF] text-[#0B0B0D] border-b border-[#0B0B0D]/10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-8">
          
          <span className="anim-fade-up text-xs font-bold uppercase tracking-widest text-[#6B6B6B]">Session-Based Philosophy</span>
          
          <h2 className="anim-fade-up font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
            Built for the conversation.<br />Not for collecting your data.
          </h2>

          <p className="anim-fade-up max-w-2xl text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
            InvoFlow is intentionally session-based. You don&apos;t need an account or a database just to create an invoice. Create your invoice, download it, and move on.
          </p>

          <div className="anim-fade-up grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-4">
            
            <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#0B0B0D]/10 flex flex-col gap-1 items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D]">No Login</span>
              <span className="text-[11px] text-[#6B6B6B]">Zero sign-up friction</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#0B0B0D]/10 flex flex-col gap-1 items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D]">No Chat Storage</span>
              <span className="text-[11px] text-[#6B6B6B]">Messages discarded after session</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#0B0B0D]/10 flex flex-col gap-1 items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D]">No DB Lock-in</span>
              <span className="text-[11px] text-[#6B6B6B]">Export clean PDFs directly</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#0B0B0D]/10 flex flex-col gap-1 items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D]">Instant Speed</span>
              <span className="text-[11px] text-[#6B6B6B]">Sub-second processing</span>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FINAL CTA (OBSIDIAN BLACK #0B0B0D) */}
      {/* ------------------------------------------------------------- */}
      <section className="scroll-reveal-sec py-28 px-4 sm:px-8 bg-[#0B0B0D] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10">
          
          <h2 className="anim-fade-up font-heading text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Your next invoice could start with a message.
          </h2>

          <p className="anim-fade-up text-sm sm:text-lg text-[#E7E7E5]/70 max-w-xl">
            Stop rebuilding invoices every time your client changes their mind.
          </p>

          <div className="anim-fade-up flex flex-col items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="px-9 py-4 rounded-xl bg-white hover:bg-[#F7F7F5] active:bg-[#E7E7E5] text-[#0B0B0D] text-base font-extrabold shadow-2xl transition-all cursor-pointer flex items-center gap-3"
            >
              <span>Create Your First Invoice</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <span className="text-xs text-[#6B6B6B] font-medium">No account required.</span>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER (OBSIDIAN BLACK #0B0B0D / HAIRLINE BORDER) */}
      {/* ------------------------------------------------------------- */}
      <footer className="py-8 px-4 sm:px-8 bg-[#0B0B0D] text-[#6B6B6B] border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">InvoFlow</span>
            <span>© 2026 • Premium Conversational Invoicing Studio</span>
          </div>

          <button
            type="button"
            onClick={onOpenWorkspace}
            className="text-white hover:underline font-semibold cursor-pointer"
          >
            Open Invoice Workspace →
          </button>
        </div>
      </footer>
    </div>
  );
}
