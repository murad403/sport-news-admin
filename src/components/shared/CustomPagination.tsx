import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomPaginationProps {
  count: number;
  page: number;
  pageSize?: number;
  onChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  count,
  page,
  pageSize = 10,
  onChange,
}) => {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      if (start > 2) {
        pageNumbers.push('...');
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-6 border-t border-slate-800/40">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="relative inline-flex items-center rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="relative ml-3 inline-flex items-center rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-200">{Math.min(count, (page - 1) * pageSize + 1)}</span> to{' '}
            <span className="font-semibold text-slate-200">{Math.min(count, page * pageSize)}</span> of{' '}
            <span className="font-semibold text-slate-200">{count}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-lg shadow-xs gap-1.5" aria-label="Pagination">
            <button
              onClick={() => onChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-lg p-2 text-slate-400 hover:bg-slate-800/60 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800/60 transition-all"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pages.map((p, idx) => (
              <button
                key={idx}
                onClick={() => typeof p === 'number' && onChange(p)}
                disabled={p === '...'}
                className={`relative inline-flex items-center rounded-lg px-3.5 py-2 text-xs font-semibold border transition-all ${p === page
                    ? 'z-10 bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                    : p === '...'
                      ? 'border-transparent text-slate-500 cursor-default'
                      : 'border-slate-800/60 text-slate-400 hover:bg-slate-800/40 hover:text-white'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => onChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-lg p-2 text-slate-400 hover:bg-slate-800/60 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800/60 transition-all"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;