import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  className?: string;
  buttonClassName?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblings = 1,
  className,
  buttonClassName,
}) => {
  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getPaginationItems = () => {
    const totalNumbers = siblings * 2 + 3; // current + siblings on each side + first + last + dots

    if (totalPages <= totalNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblings, 1);
    const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (siblings * 2 + 2), totalPages);
      return [1, '...', ...rightRange];
    }

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, siblings * 2 + 3);
      return [...leftRange, '...', totalPages];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }

    return [];
  };

  const items = getPaginationItems();

  const baseButtonClasses = 'px-3 py-2 text-sm font-medium rounded-md transition-colors';
  const activeButtonClasses = 'bg-blue-600 text-white';
  const inactiveButtonClasses = 'text-gray-700 hover:bg-gray-100 active:bg-gray-200';
  const disabledButtonClasses = 'text-gray-400 cursor-not-allowed opacity-50';

  return (
    <nav
      className={twMerge('flex items-center justify-center gap-2', className)}
      aria-label='Pagination navigation'
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={twMerge(
          baseButtonClasses,
          currentPage === 1 ? disabledButtonClasses : inactiveButtonClasses,
          buttonClassName
        )}
        aria-label='Previous page'
      >
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      <div className='flex gap-1'>
        {items.map((item, index) => {
          if (item === '...') {
            return (
              <span
                key={`dots-${index}`}
                className='px-3 py-2 text-gray-700'
              >
                ...
              </span>
            );
          }

          const pageNumber = item as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={twMerge(
                baseButtonClasses,
                isActive ? activeButtonClasses : inactiveButtonClasses,
                buttonClassName
              )}
              aria-label={`Page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={twMerge(
          baseButtonClasses,
          currentPage === totalPages ? disabledButtonClasses : inactiveButtonClasses,
          buttonClassName
        )}
        aria-label='Next page'
      >
        <span>Next</span>
      </button>

      {/* Page Info */}
      <div className='ml-4 text-sm text-gray-600'>
        Page <span className='font-medium'>{currentPage}</span> of{' '}
        <span className='font-medium'>{totalPages}</span>
      </div>
    </nav>
  );
};

Pagination.displayName = 'Pagination';

export { Pagination };
