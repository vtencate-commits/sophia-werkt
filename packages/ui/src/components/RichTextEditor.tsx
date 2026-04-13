import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({
    value,
    onChange,
    placeholder = 'Enter text...',
    disabled = false,
    readOnly = false,
    minHeight = '200px',
    maxHeight = '600px',
    label,
    error,
    helperText,
    className,
  }, ref) => {
    return (
      <div ref={ref} className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {label}
          </label>
        )}

        <div
          className={twMerge(
            'rounded-md border transition-colors',
            error
              ? 'border-2 border-red-500 focus-within:border-red-600'
              : 'border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100',
            disabled && 'bg-gray-50 opacity-50 cursor-not-allowed',
            className
          )}
        >
          <div className='border-b border-gray-200 bg-gray-50 p-2'>
            <div className='flex flex-wrap gap-1'>
              <button
                disabled={disabled || readOnly}
                className='rounded p-2 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                title='Bold (Ctrl+B)'
              >
                <strong>B</strong>
              </button>
              <button
                disabled={disabled || readOnly}
                className='rounded p-2 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                title='Italic (Ctrl+I)'
              >
                <em>I</em>
              </button>
              <button
                disabled={disabled || readOnly}
                className='rounded p-2 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                title='Underline (Ctrl+U)'
              >
                <u>U</u>
              </button>
              <div className='w-px bg-gray-300' />
              <button
                disabled={disabled || readOnly}
                className='rounded p-2 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                title='Bullet List'
              >
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
              <button
                disabled={disabled || readOnly}
                className='rounded p-2 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                title='Numbered List'
              >
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
              <div className='w-px bg-gray-300' />
              <button
                disabled={disabled || readOnly}
                className='rounded p-2 text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                title='Add Link'
              >
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M12.586 4.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.172 9.172a2 2 0 112.828 2.828L6.343 15.828a2 2 0 11-2.828-2.828l3.657-3.657z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>

          <textarea
            value={value}
            onChange={(e) => {
              if (!disabled && !readOnly) {
                onChange(e.target.value);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            style={{
              minHeight,
              maxHeight,
            }}
            className='w-full resize-none border-none p-4 font-mono text-sm focus:outline-none focus:ring-0 disabled:bg-gray-50 disabled:cursor-not-allowed'
          />
        </div>

        {error && (
          <p className='mt-1 text-sm text-red-600'>{error}</p>
        )}
        {helperText && !error && (
          <p className='mt-1 text-sm text-gray-500'>{helperText}</p>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
