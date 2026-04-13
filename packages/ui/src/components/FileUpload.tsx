import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
  isDragging?: boolean;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    onFilesSelected,
    acceptedTypes = ['*'],
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    maxFiles = 1,
    disabled = false,
    multiple = true,
    label,
    helperText,
    error,
    className,
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [validationError, setValidationError] = useState<string>();

    const validateFiles = (files: File[]): File[] => {
      const validFiles: File[] = [];
      setValidationError(undefined);

      if (files.length > maxFiles && maxFiles > 0) {
        setValidationError(
          `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`
        );
        return [];
      }

      for (const file of files) {
        // Check file size
        if (file.size > maxFileSize) {
          setValidationError(
            `File "${file.name}" exceeds maximum size of ${(maxFileSize / 1024 / 1024).toFixed(2)}MB`
          );
          continue;
        }

        // Check file type
        if (acceptedTypes[0] !== '*') {
          const fileExtension = `.${file.name.split('.').pop()}`.toLowerCase();
          const isAccepted =
            acceptedTypes.includes(fileExtension) ||
            acceptedTypes.includes(file.type);

          if (!isAccepted) {
            setValidationError(
              `File type "${fileExtension}" is not accepted`
            );
            continue;
          }
        }

        validFiles.push(file);
      }

      return validFiles;
    };

    const handleFileSelect = (files: FileList | null) => {
      if (!files || disabled) return;

      const fileArray = Array.from(files);
      const validFiles = validateFiles(fileArray);

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        onFilesSelected(validFiles);
      }
    };

    const handleClick = () => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    };

    const removeFile = (index: number) => {
      const updated = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updated);
      onFilesSelected(updated);
    };

    const displayError = error || validationError;

    return (
      <div ref={ref} className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {label}
          </label>
        )}

        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={twMerge(
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
            disabled && 'cursor-not-allowed opacity-50',
            displayError && 'border-red-300 bg-red-50',
            className
          )}
        >
          <input
            ref={fileInputRef}
            type='file'
            multiple={multiple && maxFiles > 1}
            accept={acceptedTypes.join(',')}
            onChange={handleInputChange}
            disabled={disabled}
            className='hidden'
          />

          <svg
            className={twMerge(
              'mx-auto h-12 w-12 transition-colors',
              displayError ? 'text-red-400' : 'text-gray-400'
            )}
            stroke='currentColor'
            fill='none'
            viewBox='0 0 48 48'
          >
            <path
              d='M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M14 28l10-10 10 10M28 18v12'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>

          <p
            className={twMerge(
              'mt-2 text-sm font-medium',
              displayError ? 'text-red-700' : 'text-gray-900'
            )}
          >
            {displayError ? displayError : 'Drag and drop files here, or click to select'}
          </p>

          {helperText && !displayError && (
            <p className='mt-1 text-xs text-gray-500'>
              {helperText}
            </p>
          )}

          {!displayError && (
            <p className='mt-1 text-xs text-gray-600'>
              Max {maxFiles > 1 ? `${maxFiles} files` : '1 file'} of{' '}
              {(maxFileSize / 1024 / 1024).toFixed(2)}MB
              {acceptedTypes[0] !== '*' && ` (${acceptedTypes.join(', ')})`}
            </p>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className='mt-4 space-y-2'>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-md border border-gray-200 bg-white p-3'
              >
                <div className='flex items-center gap-2 min-w-0'>
                  <svg
                    className='h-5 w-5 flex-shrink-0 text-gray-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M8 16.5a.5.5 0 01-.5-.5v-5H5.707l2.147-2.146a.5.5 0 00-.708-.708l-3 3a.5.5 0 000 .708l3 3a.5.5 0 00.708-.708L5.707 10H7.5V16a.5.5 0 01.5.5z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium text-gray-900'>
                      {file.name}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {(file.size / 1024).toFixed(2)}KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className='ml-2 flex-shrink-0 text-gray-400 hover:text-red-600'
                  type='button'
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
