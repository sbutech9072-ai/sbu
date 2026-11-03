import React from 'react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { StudioShell } from '@/components/human/studio-shell';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioShell>
      <div className="min-h-screen flex flex-col bg-[#EEE6E2] text-[#1E5A54]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </StudioShell>
  );
}
