'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  CheckCircle2,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { servicesData } from '@/data/services';
import { Input } from '@/components/ui/input';
import { HandUnderline, StudioStamp } from '@/components/human/hand-crafted-svg';
import { MagneticWrap } from '@/components/human/magnetic-button';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="border-t border-[#1E5A54]/20 bg-[#EEE6E2] text-[#1E5A54]">
      {/* Newsletter Bar */}
      <div className="border-b border-[#1E5A54]/20 py-12 bg-[#F8F4F2]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7623D]" />
                <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#1E5A54]">
                  Studio Field Notes
                </span>
              </div>
              <div className="inline-block">
                <h3 className="font-headline text-3xl md:text-4xl font-black uppercase text-[#1E5A54] leading-tight">
                  Architecture Notes & System Postmortems
                </h3>
                <div className="w-32 mt-1">
                  <HandUnderline className="h-2.5 w-full" />
                </div>
              </div>
              <p className="text-sm text-[#1E5A54]/85 max-w-md font-sans">
                One practical dispatch per month covering Next.js architecture, Go services, and production AI pipelines. Written by our engineers, never by marketers.
              </p>
            </div>
            <div className="lg:col-span-6">
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-[#1E5A54] bg-[#EEE6E2] border border-[#1E5A54]/30 p-4 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#F7623D]" />
                  <span>You are on the list. Expect our next issue at the start of the month.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <Input
                    type="email"
                    placeholder="Enter your work email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="h-11 bg-[#EEE6E2]"
                  />
                  <MagneticWrap>
                    <button
                      type="submit"
                      className="h-11 px-6 w-full sm:w-auto whitespace-nowrap rounded-full bg-[#F7623D] hover:bg-[#E05330] text-white text-xs font-bold uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </MagneticWrap>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-full border border-[#1E5A54] bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54]">
                <Terminal className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-2xl font-bold tracking-tight text-[#1E5A54] uppercase flex items-center gap-1 leading-none">
                  Sbu <span className="text-[#F7623D]">Tech</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1E5A54]/85 mt-0.5">
                  Software Studio
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#1E5A54]/85 max-w-sm leading-relaxed font-sans">
              Senior-led software engineering studio in San Francisco. We design and ship web applications, cloud infrastructure, and private AI workflows that your team owns outright.
            </p>
            <div className="pt-1">
              <StudioStamp
                text="100% CLIENT IP OWNERSHIP"
                subtext="SAN FRANCISCO // EST. 2021"
                rotate="slight-left"
                variant="cream"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-full border border-[#1E5A54]/40 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 stroke-[1.5]" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-full border border-[#1E5A54]/40 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="h-4 w-4 stroke-[1.5]" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-full border border-[#1E5A54]/40 bg-[#F8F4F2] flex items-center justify-center text-[#1E5A54] hover:border-[#1E5A54] hover:bg-[#1E5A54] hover:text-[#EEE6E2] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 stroke-[1.5]" />
              </a>
            </div>
          </div>

          {/* Core Services Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-headline text-lg font-bold uppercase tracking-wider text-[#1E5A54]">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-[0.14em]">
              {servicesData.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-headline text-lg font-bold uppercase tracking-wider text-[#1E5A54]">
              Directory
            </h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-[0.14em]">
              <li>
                <Link href="/about" className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-colors">
                  About Studio
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-colors">
                  Principals & Team
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-colors">
                  Engineering Notes
                </Link>
              </li>
              <li>
                <Link href="/get-a-quote" className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-colors">
                  Project Scope
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-[#1E5A54]/85 hover:text-[#F7623D] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-headline text-lg font-bold uppercase tracking-wider text-[#1E5A54]">
              Dispatch Desk
            </h4>
            <div className="space-y-3 text-xs font-medium text-[#1E5A54]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#F7623D] shrink-0 mt-0.5 stroke-[1.75]" />
                <span className="leading-relaxed">{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#F7623D] shrink-0 stroke-[1.75]" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-[#F7623D] transition-colors font-semibold"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#F7623D] shrink-0 stroke-[1.75]" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="hover:text-[#F7623D] transition-colors font-semibold"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-16 pt-8 border-t border-[#1E5A54]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.14em] text-[#1E5A54]/85">
          <p>© {new Date().getFullYear()} Sbu Tech Inc. Built in San Francisco.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#F7623D] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#F7623D]">•</span>
            <Link href="/contact" className="hover:text-[#F7623D] transition-colors">
              Terms of Engagement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
