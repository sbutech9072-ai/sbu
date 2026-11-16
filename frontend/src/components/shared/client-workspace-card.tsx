import Link from 'next/link';
import {
  FolderGit2,
  Globe,
  LogOut,
  MessageSquare,
  Phone,
  ShieldCheck,
} from 'lucide-react';

type ClientWorkspaceCardProps = {
  fullName: string;
  email: string;
  country: string | null;
  whatsapp: string | null;
  avatarUrl?: string | null;
  onSignOut: () => void;
};

export function ClientWorkspaceCard({
  fullName,
  email,
  country,
  whatsapp,
  avatarUrl,
  onSignOut,
}: ClientWorkspaceCardProps) {
  return (
    <div className="bg-[#F8F4F2] border border-[#1E5A54]/25 rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-[#1E5A54]/15 pb-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-12 h-12 rounded-full border border-[#1E5A54]/20 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#1E5A54] text-[#EEE6E2] flex items-center justify-center font-bold text-lg">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-headline text-lg font-bold uppercase tracking-wide text-[#1E5A54]">
              {fullName}
            </h3>
            <p className="text-xs text-[#1E5A54]/75">{email}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E5A54]/10 text-[#1E5A54] text-[11px] font-mono font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E5A54]" />
          Client
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#EEE6E2] rounded-2xl p-3 border border-[#1E5A54]/15">
          <span className="text-[10px] uppercase tracking-widest text-[#1E5A54]/70 font-semibold block mb-1">
            Location / Region
          </span>
          <span className="font-semibold text-sm text-[#1E5A54] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#1E5A54]" />
            {country || 'Verified Profile'}
          </span>
        </div>
        <div className="bg-[#EEE6E2] rounded-2xl p-3 border border-[#1E5A54]/15">
          <span className="text-[10px] uppercase tracking-widest text-[#1E5A54]/70 font-semibold block mb-1">
            Direct Communication
          </span>
          <span className="font-semibold text-sm text-[#1E5A54] flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-[#1E5A54]" />
            {whatsapp || 'Email Preferred'}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          href="/contact"
          className="w-full bg-[#1E5A54] hover:bg-[#16443F] text-[#EEE6E2] font-semibold py-3 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Message Engineering Partner</span>
        </Link>
        <Link
          href="/services"
          className="w-full bg-transparent hover:bg-[#1E5A54]/5 text-[#1E5A54] border border-[#1E5A54]/30 font-semibold py-2.5 rounded-full text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Explore Technical Services</span>
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="w-full text-center text-xs text-[#F7623D] hover:underline pt-2 flex items-center justify-center gap-1 font-semibold uppercase tracking-wider cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Account</span>
        </button>
      </div>
    </div>
  );
}
