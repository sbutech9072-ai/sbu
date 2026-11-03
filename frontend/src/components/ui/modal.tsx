'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Solid studio ink overlay without backdrop-blur */}
      <div
        className="fixed inset-0 bg-[#1E5A54]/75 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-[#1E5A54]/25 bg-[#F8F4F2] p-6 text-[#1E5A54] shadow-[8px_8px_0px_rgba(30,90,84,0.22)] transition-all duration-200',
          maxWidthClasses
        )}
      >
        <div className="mb-4 flex items-start justify-between border-b border-[#1E5A54]/15 pb-4">
          <div>
            <h3
              id="modal-title"
              className="font-headline text-xl uppercase tracking-tight text-[#1E5A54]"
            >
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs leading-relaxed text-[#1E5A54]/75">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#1E5A54]/20 p-1.5 text-[#1E5A54]/80 transition-colors hover:border-[#F7623D] hover:bg-[#F7623D] hover:text-[#EEE6E2]"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
