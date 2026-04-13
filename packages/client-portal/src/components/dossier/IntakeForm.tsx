'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AdviceType } from '@sophia-werkt/shared';
import { useDossier } from '@/hooks/useDossier';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

const adviceTypes = [
  { value: 'VSO_REVIEW', label: 'VSO-beoordeling' },
  { value: 'VSO_NEGOTIATION', label: 'VSO-onderhandeling' },
  { value: 'DISMISSAL_ADVICE', label: 'Ontslagadvies' },
  { value: 'LABOR_DISPUTE', label: 'Arbeidsgeschil' },
  { value: 'NON_COMPETE_CHECK', label: 'Concurrentiebeding check' },
  { value: 'OTHER', label: 'Overig' },
] as const;

const createCaseSchema = z.object({
  title: z.string().min(5, 'Titel moet minimaal 5 tekens zijn'),
  adviceType: z.enum(['VSO_REVIEW', 'VSO_NEGOTIATION', 'DISMISSAL_ADVICE', 'LABOR_DISPUTE', 'NON_COMPETE_CHECK', 'OTHER']),
  description: z.string().optional(),
  employerName: z.string().optional(),
  employerKvk: z.string().optional(),
});

type CreateCaseFormData = z.infer<typeof createCaseSchema>;

interface IntakeFormProps {
  onSuccess?: (caseId: string) => void;
}

export function IntakeForm({ onSuccess }: IntakeFormProps) {
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { createDossier, isLoading } = useDossier();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset: _reset,
  } = useForm<CreateCaseFormData>({
    resolver: zodResolver(createCaseSchema),
  });

  const adviceType = watch('adviceType');

  const onSubmit = async (data: CreateCaseFormData) => {
    try {
      const result = await createDossier({
        title: data.title,
        adviceType: data.adviceType as AdviceType,
        description: data.description,
        employerName: data.employerName,
        employerKvk: data.employerKvk,
      });

      if (onSuccess) {
        onSuccess(result.id);
      } else {
        router.push(`/dossier/${result.id}`);
      }
    } catch (error) {
      console.error('Failed to create case:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='card max-w-2xl mx-auto p-8'>
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className='flex items-center'>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? 'bg-sophia-secondary text-white'
                    : 'bg-gray-200 text-sophia-muted'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    s < step ? 'bg-sophia-secondary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-sophia-text'>Adviestype</h2>
            <p className='text-sophia-muted'>Wat is het soort advies dat u nodig hebt?</p>

            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 mt-6'>
              {adviceTypes.map((type) => (
                <label
                  key={type.value}
                  className='relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-sophia-secondary'
                >
                  <input
                    type='radio'
                    {...register('adviceType')}
                    value={type.value}
                    className='h-4 w-4'
                  />
                  <span className='ml-3 font-medium text-sophia-text'>{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-sophia-text'>Documenten uploaden</h2>
            <p className='text-sophia-muted'>Upload relevante documenten (optioneel)</p>

            <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
              <Upload className='mx-auto h-8 w-8 text-sophia-muted mb-2' />
              <p className='text-sm text-sophia-muted mb-2'>
                Sleep documenten hier of klik om te selecteren
              </p>
              <input
                type='file'
                multiple
                onChange={handleFileUpload}
                className='hidden'
                id='file-upload'
              />
              <label htmlFor='file-upload' className='text-sophia-secondary cursor-pointer'>
                Selecteer bestanden
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className='space-y-2'>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                  >
                    <span className='text-sm text-sophia-text'>{file.name}</span>
                    <button
                      type='button'
                      onClick={() => removeFile(index)}
                      className='text-sophia-secondary text-sm'
                    >
                      Verwijderen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-sophia-text'>Details</h2>
            <p className='text-sophia-muted'>Vertel ons meer over uw situatie</p>

            <div className='space-y-4 mt-6'>
              <div>
                <label className='block text-sm font-medium text-sophia-text mb-2'>
                  Casus titel *
                </label>
                <input
                  type='text'
                  {...register('title')}
                  placeholder='Bijvoorbeeld: Beoordeling VSO werkgevers X'
                  className='w-full'
                />
                {errors.title && (
                  <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-sophia-text mb-2'>
                  Werkgever naam
                </label>
                <input
                  type='text'
                  {...register('employerName')}
                  placeholder='Naam van de werkgever'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-sophia-text mb-2'>
                  Werkgever KVK-nummer
                </label>
                <input
                  type='text'
                  {...register('employerKvk')}
                  placeholder='KVK-nummer'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-sophia-text mb-2'>
                  Beschrijving van uw situatie
                </label>
                <textarea
                  {...register('description')}
                  placeholder='Beschrijf uw situatie in detail'
                  rows={5}
                  className='w-full'
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className='space-y-4'>
            <h2 className='text-2xl font-bold text-sophia-text'>Bevestiging</h2>
            <p className='text-sophia-muted mb-6'>
              Controleer uw gegevens voordat u de aanvraag indient
            </p>

            <div className='space-y-3 bg-sophia-bg p-4 rounded-lg'>
              <div>
                <p className='text-xs text-sophia-muted uppercase'>Adviestype</p>
                <p className='font-medium text-sophia-text mt-1'>
                  {adviceTypes.find((t) => t.value === adviceType)?.label}
                </p>
              </div>
              {uploadedFiles.length > 0 && (
                <div>
                  <p className='text-xs text-sophia-muted uppercase'>Documenten</p>
                  <p className='font-medium text-sophia-text mt-1'>{uploadedFiles.length} bestanden</p>
                </div>
              )}
            </div>

            <p className='text-sm text-sophia-muted'>
              Door in te dienen gaat u akkoord met onze voorwaarden en privacybeleid.
            </p>
          </div>
        )}

        <div className='flex justify-between gap-4 mt-8'>
          <button
            type='button'
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className='flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-sophia-text hover:bg-gray-50 disabled:opacity-50'
          >
            <ChevronLeft className='h-4 w-4' />
            Vorige
          </button>

          {step < 4 ? (
            <button
              type='button'
              onClick={() => setStep(step + 1)}
              className='flex items-center gap-2 px-6 py-2 bg-sophia-secondary text-white rounded-lg hover:bg-opacity-90'
            >
              Volgende
              <ChevronRight className='h-4 w-4' />
            </button>
          ) : (
            <button
              type='submit'
              disabled={isLoading}
              className='flex items-center gap-2 px-6 py-2 bg-sophia-secondary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50'
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size='sm' />
                  Verzenden...
                </>
              ) : (
                'Dossier aanmaken'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
