import Link from 'next/link';
import { Terminal, Home, ArrowLeft, Layers, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#090d16] text-slate-100 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-lg text-center space-y-6">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-400">
          <Terminal className="h-4 w-4" />
          <span>Error 404 • Resource Not Located</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          The endpoint or page you requested does not exist or has been relocated to another service
          route.
        </p>

        {/* Quick Links */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-2">
            Recommended Destinations
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href="/"
              className="p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-800 flex items-center gap-2 text-slate-200 transition-colors"
            >
              <Home className="h-4 w-4 text-blue-400" />
              <span>Company Home</span>
            </Link>
            <Link
              href="/services"
              className="p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-800 flex items-center gap-2 text-slate-200 transition-colors"
            >
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Explore Services</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild size="default" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="default">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

