import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    helperText,
    variant = 'default',
    id,
    ...props
  }, ref) => {
    const generatedId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'block w-full rounded-md px-3 py-2 text-base transition-colors';
    const borderClasses = error
      ? 'border-2 border-red-500 focus:border-red-600 focus:ring-red-100'
      : 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
    const variantClasses = variant === 'filled'
      ? 'bg-gray-100 focus:bg-white'
      : 'bg-white';

    const inputClasses = twMerge(
      baseClasses,
      borderClasses,
      variantClasses,
      'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
      className
    );

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={generatedId}
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={generatedId}
          type={type}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${generatedId}-error` : helperText ? `${generatedId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${generatedId}-error`} className='mt-1 text-sm text-red-600'>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${generatedId}-helper`} className='mt-1 text-sm text-gray-500'>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
