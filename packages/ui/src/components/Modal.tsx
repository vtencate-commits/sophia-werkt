import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
  className?: string;
  overlayClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
  className,
  overlayClassName,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <>
      <div
        className={twMerge(
          'fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity',
          overlayClassName
        )}
        onClick={onClose}
        role='presentation'
      />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div
          className={twMerge(
            'relative w-full rounded-lg bg-white shadow-xl',
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
              {title && (
                <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
              )}
              {closeButton && (
                <button
                  onClick={onClose}
                  className='ml-auto inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  aria-label='Close modal'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className='px-6 py-4'>{children}</div>

          {/* Footer */}
          {footer && (
            <div className='border-t border-gray-200 flex items-center justify-end gap-3 px-6 py-4'>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

Modal.displayName = 'Modal';

export { Modal };
