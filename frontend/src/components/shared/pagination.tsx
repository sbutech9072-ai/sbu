import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        'flex items-center justify-center space-x-2 py-4 text-[#1E5A54]',
        className
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="h-9 w-9 border-[#1E5A54]/30 text-[#1E5A54]"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(p)}
          className={cn(
            'h-9 w-9 p-0 font-mono text-xs',
            p === currentPage
              ? 'pointer-events-none bg-[#F7623D] text-[#EEE6E2]'
              : 'border-[#1E5A54]/30 text-[#1E5A54]'
          )}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="h-9 w-9 border-[#1E5A54]/30 text-[#1E5A54]"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
