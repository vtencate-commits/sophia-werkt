import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled';
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    label,
    error,
    helperText,
    options,
    placeholder,
    variant = 'default',
    id,
    ...props
  }, ref) => {
    const generatedId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'block w-full rounded-md px-3 py-2 text-base transition-colors appearance-none bg-right pr-10';
    const borderClasses = error
      ? 'border-2 border-red-500 focus:border-red-600 focus:ring-red-100'
      : 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
    const variantClasses = variant === 'filled'
      ? 'bg-gray-100 focus:bg-white'
      : 'bg-white';

    const selectClasses = twMerge(
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
        <div className='relative'>
          <select
            ref={ref}
            id={generatedId}
            className={selectClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${generatedId}-error` : helperText ? `${generatedId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value='' disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 14l-7 7m0 0l-7-7m7 7V3'
            />
          </svg>
        </div>
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

Select.displayName = 'Select';

export { Select };
