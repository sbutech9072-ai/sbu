import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Compass, FolderGit2, Layers, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HandArrow,
  HandUnderline,
  StudioStamp,
} from '@/components/human/hand-crafted-svg';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#EEE6E2] text-[#1E5A54] px-6 py-12 sm:px-12 selection:bg-[#F7623D] selection:text-[#EEE6E2]">
      {/* Top Studio Index Bar */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between border-b border-[#1E5A54]/20 pb-4 font-mono text-[11px] uppercase tracking-[0.18em]">
        <span>SBU TECH // STUDIO ROUTING TABLE</span>
        <span className="text-[#F7623D]">STATUS: 404 NOT FOUND</span>
      </div>

      {/* Main Editorial 404 Block */}
      <div className="mx-auto my-12 w-full max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <StudioStamp
            text="404 // ROUTE OFF THE MAP"
            subtext="INDEX LOOKUP FAILED"
            rotate="left"
            variant="orange"
          />
          <HandArrow direction="right" color="#1E5A54" className="hidden sm:block" />
        </div>

        <h1 className="font-headline text-6xl sm:text-8xl lg:text-9xl uppercase leading-[0.9] tracking-tight text-[#1E5A54]">
          THIS ROUTE IS NOT IN OUR{' '}
          <span className="relative inline-block text-[#F7623D]">
            BLUEPRINT.
            <HandUnderline color="#1E5A54" className="-bottom-2 left-0" />
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-[#1E5A54]/85">
          The URL you entered either moved during a recent architecture cleanup or never existed in the first place. Pick a verified destination below to get back on solid ground.
        </p>

        {/* Studio Directory Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/"
            className="group flex flex-col justify-between rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F7623D]"
          >
            <div className="flex items-center justify-between">
              <Compass className="h-5 w-5 text-[#F7623D]" />
              <ArrowUpRight className="h-4 w-4 text-[#1E5A54]/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F7623D]" />
            </div>
            <div className="mt-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1E5A54]/60">
                01 // ROOT
              </span>
              <h2 className="mt-1 font-headline text-2xl uppercase text-[#1E5A54]">
                STUDIO HOME
              </h2>
            </div>
          </Link>

          <Link
            href="/projects"
            className="group flex flex-col justify-between rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F7623D]"
          >
            <div className="flex items-center justify-between">
              <FolderGit2 className="h-5 w-5 text-[#F7623D]" />
              <ArrowUpRight className="h-4 w-4 text-[#1E5A54]/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F7623D]" />
            </div>
            <div className="mt-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1E5A54]/60">
                02 // ARCHIVE
              </span>
              <h2 className="mt-1 font-headline text-2xl uppercase text-[#1E5A54]">
                SHIPPED WORK
              </h2>
            </div>
          </Link>

          <Link
            href="/services"
            className="group flex flex-col justify-between rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F7623D]"
          >
            <div className="flex items-center justify-between">
              <Layers className="h-5 w-5 text-[#F7623D]" />
              <ArrowUpRight className="h-4 w-4 text-[#1E5A54]/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F7623D]" />
            </div>
            <div className="mt-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1E5A54]/60">
                03 // CAPABILITIES
              </span>
              <h2 className="mt-1 font-headline text-2xl uppercase text-[#1E5A54]">
                OUR SERVICES
              </h2>
            </div>
          </Link>

          <Link
            href="/contact"
            className="group flex flex-col justify-between rounded-2xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F7623D]"
          >
            <div className="flex items-center justify-between">
              <Mail className="h-5 w-5 text-[#F7623D]" />
              <ArrowUpRight className="h-4 w-4 text-[#1E5A54]/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F7623D]" />
            </div>
            <div className="mt-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1E5A54]/60">
                04 // DIRECT LINE
              </span>
              <h2 className="mt-1 font-headline text-2xl uppercase text-[#1E5A54]">
                START A PROJECT
              </h2>
            </div>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="default" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Front Page</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="default">
            <Link href="/contact">Report a Broken Link</Link>
          </Button>
        </div>
      </div>

      {/* Bottom Footnote */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between border-t border-[#1E5A54]/20 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#1E5A54]/70">
        <span>SBU TECH ENGINEERING</span>
        <span>DHAKA // REMOTE WORLDWIDE</span>
      </div>
    </div>
  );
}
