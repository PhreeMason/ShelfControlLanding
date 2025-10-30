import Link from "next/link";
import { Logo } from "@/components/logo";
import { Hero } from "@/components/landing/hero";
import { ProblemCards } from "@/components/landing/problem-cards";
import { Benefits } from "@/components/landing/benefits";
import { Steps } from "@/components/landing/steps";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { About } from "@/components/landing/about";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-xl text-slate-900">
                ShelfControl
              </span>
            </Link>
            <a
              href="#waitlist"
              className="px-6 py-2 bg-violet-700 text-white font-semibold rounded-lg hover:bg-violet-800 transition-colors"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Hero />
        <ProblemCards />
        <Benefits />
        <Steps />
        <WaitlistForm />
        <About />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
