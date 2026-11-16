import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface LogoProps {
  variant?: 'navbar' | 'footer' | 'admin' | 'login';
  size?: 'sm' | 'md' | 'lg' | number;
  className?: string;
  showText?: boolean;
  href?: string | null;
  onClick?: () => void;
  priority?: boolean;
}

export function Logo({
  variant = 'navbar',
  size,
  className = '',
  showText = true,
  href,
  onClick,
  priority = false,
}: LogoProps) {
  // Determine pixel dimensions and container sizing
  let pixelSize = 40;
  let markContainerClass = 'h-10 w-10';

  if (typeof size === 'number') {
    pixelSize = size;
    markContainerClass = `h-[${size}px] w-[${size}px]`;
  } else if (size === 'sm') {
    pixelSize = 32;
    markContainerClass = 'h-8 w-8';
  } else if (size === 'md') {
    pixelSize = 40;
    markContainerClass = 'h-10 w-10';
  } else if (size === 'lg') {
    pixelSize = 48;
    markContainerClass = 'h-12 w-12';
  } else {
    // Defaults based on variant
    switch (variant) {
      case 'footer':
        pixelSize = 36;
        markContainerClass = 'h-9 w-9';
        break;
      case 'admin':
        pixelSize = 36;
        markContainerClass = 'h-9 w-9';
        break;
      case 'login':
        pixelSize = 40;
        markContainerClass = 'h-10 w-10';
        break;
      case 'navbar':
      default:
        pixelSize = 40;
        markContainerClass = 'h-10 w-10';
        break;
    }
  }

  // Determine link destination
  const defaultHref = variant === 'admin' ? '/admin' : '/';
  const targetHref = href !== undefined ? href : defaultHref;

  // Typography and layout per variant
  const isFooter = variant === 'footer';
  const isAdmin = variant === 'admin';
  const isLogin = variant === 'login';

  const defaultContainerClass = isFooter
    ? 'flex items-center gap-2.5 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5A54] rounded-lg'
    : isAdmin
    ? 'flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg'
    : isLogin
    ? 'inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5A54] rounded-lg'
    : 'flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5A54] rounded-lg';

  const titleNode = isAdmin ? (
    <span className="font-headline text-lg uppercase text-[#1E5A54] tracking-tight flex items-center gap-1 leading-none">
      Sbu<span className="text-[#1E5A54] decoration-[#F7623D]">Tech</span>
    </span>
  ) : isFooter ? (
    <span className="font-headline text-xl font-bold tracking-tight text-[#1E5A54] uppercase flex items-center gap-1 leading-none">
      Sbu <span className="text-[#1E5A54] decoration-[#F7623D]">Tech</span>
    </span>
  ) : isLogin ? (
    <span className="font-headline text-2xl font-bold tracking-tight text-[#1E5A54] uppercase flex items-center gap-1 leading-none">
      Sbu <span className="text-[#1E5A54] decoration-[#F7623D]">Tech</span>
    </span>
  ) : (
    <span className="font-headline text-2xl font-bold tracking-tight text-[#1E5A54] uppercase flex items-center gap-1 leading-none">
      Sbu <span className="text-[#1E5A54] decoration-[#F7623D]">Tech</span>
    </span>
  );

  const subtitleNode = isAdmin ? (
    <span className="text-[10px] font-mono tracking-widest text-[#1E5A54] uppercase block mt-0.5">
      Admin Desk
    </span>
  ) : isFooter ? (
    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#1E5A54]/70 mt-0.5">
      Software Studio
    </span>
  ) : isLogin ? (
    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1E5A54] mt-0.5">
      Software Studio
    </span>
  ) : (
    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1E5A54] mt-0.5">
      Software Studio
    </span>
  );

  const content = (
    <>
      {/*
        Subtle rounded light container:
        Keeps the dark-blue logo mark beautifully framed and crisply legible across both
        light mode (cream background) and dark mode (dark background).
      */}
      <div
        className={`${markContainerClass} rounded-full border border-[#1E5A54] bg-[#F8F4F2] dark:bg-[#FAF7F5] dark:border-white/40 flex items-center justify-center p-0.5 overflow-hidden transition-transform group-hover:scale-105 shadow-sm shrink-0`}
        style={{
          width: typeof size === 'number' ? size : undefined,
          height: typeof size === 'number' ? size : undefined,
        }}
      >
        <Image
          src="/logo.jpeg"
          alt="SBU TECH"
          width={pixelSize}
          height={pixelSize}
          unoptimized
          priority={priority || variant === 'navbar'}
          className="h-full w-full object-cover rounded-full"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          {titleNode}
          {subtitleNode}
        </div>
      )}
    </>
  );

  const combinedClassName = `${defaultContainerClass} ${className}`.trim();

  if (targetHref) {
    return (
      <Link
        href={targetHref}
        onClick={onClick}
        className={combinedClassName}
        aria-label="SBU TECH Home"
      >
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={combinedClassName}>
      {content}
    </div>
  );
}

export default Logo;
