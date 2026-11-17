import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Compass, FolderGit2, Layers, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#EEE6E2] text-[#1E5A54] px-4 py-12 selection:bg-[#F7623D] selection:text-[#EEE6E2]">
      <div className="site-container flex items-center justify-between border-b border-[#1E5A54]/15 pb-4 text-xs font-medium text-[#1E5A54]/70">
        <span>SBU TECH</span>
        <span>404 — Page not found</span>
      </div>

      <div className="site-container my-12 max-w-4xl">
        <h1 className="font-headline text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-[#1E5A54]">
          We couldn&apos;t find that page.
        </h1>

        <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-[#1E5A54]/80">
          The URL you entered may have moved or no longer exists. Use one of the links below to
          get back to the site.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/"
            className="group flex flex-col justify-between rounded-xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-5 transition-colors hover:border-[#F7623D]"
          >
            <div className="flex items-center justify-between">
              <Compass className="h-5 w-5 text-[#1E5A54]" />
              <ArrowUpRight className="h-4 w-4 text-[#1E5A54]/60 group-hover:text-[#F7623D]" />
            </div>
            <h2 className="mt-6 font-headline text-lg font-bold text-[#1E5A54]">
              Home
            </h2>
          </Link>

          <Link
            href="/projects"
            className="group flex flex-col justify-between rounded-xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-5 transition-colors hover:border-[#F7623D]"
          >
            <div className="flex items-center justify-between">
              <FolderGit2 className="h-5 w-5 text-[#1E5A54]" />
              <ArrowUpRight className="h-4 w-4 text-[#1E5A54]/60 group-hover:text-[#F7623D]" />
            </div>
            <h2 className="mt-6 font-headline text-lg font-bold text-[#1E5A54]">
              Projects
            </h2>
          </Link>

          <Link
            href="/services"
            className="group flex flex-col justify-between rounded-xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-5 transition-colors hover:border-[#F7623D]"
          >
            <div className="flex items-center justify-between">
              <Layers className="h-5 w-5 text-[#F7623D]" />
              <ArrowUpRight className="h-4 w-4 text-[#1E5A54]/60 group-hover:text-[#F7623D]" />
            </div>
            <h2 className="mt-6 font-headline text-lg font-bold text-[#1E5A54]">
              Services
            </h2>
          </Link>

          <Link
            href="/contact"
            className="group flex flex-col justify-between rounded-xl border border-[#1E5A54]/20 bg-[#F8F4F2] p-5 transition-colors hover:border-[#F7623D]"
          >
            <div className="flex items-center justify-between">
              <Mail className="h-5 w-5 text-[#F7623D]" />
              <ArrowUpRight className="h-4 w-4 text-[#1E5A54]/60 group-hover:text-[#F7623D]" />
            </div>
            <h2 className="mt-6 font-headline text-lg font-bold text-[#1E5A54]">
              Contact
            </h2>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="default" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="default">
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </div>

      <div className="site-container flex items-center justify-between border-t border-[#1E5A54]/15 pt-4 text-xs text-[#1E5A54]/70">
        <span>SBU TECH</span>
        <span>Software Engineering Studio</span>
      </div>
    </div>
  );
}
