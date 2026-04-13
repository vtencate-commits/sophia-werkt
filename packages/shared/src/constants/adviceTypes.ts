import type { AdviceType } from '../types/case.types';

export const ADVICE_TYPE_LABELS: Record<AdviceType, string> = {
  VSO_REVIEW: 'VSO Beoordeling',
  VSO_NEGOTIATION: 'Onderhandeling VSO',
  DISMISSAL_ADVICE: 'Ontslagadvies',
  LABOR_DISPUTE: 'Arbeidsconflict',
  NON_COMPETE_CHECK: 'Concurrentiebeding check',
  OTHER: 'Anders',
};

export const ADVICE_TYPE_DESCRIPTIONS: Record<AdviceType, string> = {
  VSO_REVIEW: 'Beoordeling van een vaststellingsovereenkomst namens de werknemer',
  VSO_NEGOTIATION: 'Onderhandeling over de voorwaarden van een vaststellingsovereenkomst',
  DISMISSAL_ADVICE: 'Advies bij (dreigend) ontslag of reorganisatie',
  LABOR_DISPUTE: 'Juridisch advies bij een arbeidsconflict met de werkgever',
  NON_COMPETE_CHECK: 'Beoordeling van een concurrentie of relatiebeding',
  OTHER: 'Overig arbeidsrechtelijk advies',
};
